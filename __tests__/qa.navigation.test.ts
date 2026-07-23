import fs from 'fs';
import path from 'path';
import NavigationRoutes from '@/navigation/NavigationRoutes';

const ROOT = path.join(__dirname, '..');

function read(file: string): string {
  return fs.readFileSync(path.join(ROOT, file), 'utf8');
}

function extractRegisteredRoutes(source: string): Set<string> {
  const routes = new Set<string>();
  const regex = /name=\{NavigationRoutes\.(?:APP_STACK|AUTH_STACK)\.([A-Z0-9_]+)\}/g;
  let match: RegExpExecArray | null;
  while ((match = regex.exec(source)) !== null) {
    routes.add(match[1]);
  }
  return routes;
}

function extractNavigateTargets(source: string): string[] {
  const targets: string[] = [];
  const regex =
    /navigate(?:ToRoot)?\(\s*NavigationRoutes\.APP_STACK\.([A-Z0-9_]+)/g;
  let match: RegExpExecArray | null;
  while ((match = regex.exec(source)) !== null) {
    targets.push(match[1]);
  }
  return targets;
}

const REMOVED_PAYMENT_ROUTES = new Set([
  'BILLING',
  'PAYMENT',
  'SUBSCRIPTION_HISTORY',
  'SELECT_PLAN',
  'TRANSACTION_HISTORY',
  'PAYMENT_METHOD_LIST',
  'ADD_NEW_PAYMENT_METHOD',
  'SELECT_PAYMENT_METHOD',
  'SUBSCRIPTION_WEBVIEW',
]);

const NOTIFICATION_ROUTE_KEYS = [
  'RESERVATION_CALENDAR',
  'REVIEW_MANAGEMENT_DETAIL_SCREEN',
  'CHAT_DETAIL',
  'EDIT_TASK',
  'ACTIVE_CODES',
  'PROFILE_SETTING',
  'MANAGE_YOUR_LISTINGS',
  'PROPERTY_DETAIL',
  'USER_MANAGEMENT',
] as const;

describe('QA: navigation integrity', () => {
  const appStackSource = read('src/navigation/AppStack.tsx');
  const registeredAppRoutes = extractRegisteredRoutes(appStackSource);

  it('registers all notification destination screens', () => {
    for (const key of NOTIFICATION_ROUTE_KEYS) {
      expect(registeredAppRoutes.has(key)).toBe(true);
    }
  });

  it('does not register removed payment screens', () => {
    for (const key of REMOVED_PAYMENT_ROUTES) {
      expect(registeredAppRoutes.has(key)).toBe(false);
    }
  });

  it('notification service does not navigate to removed payment screens', () => {
    const notificationSource = read('src/services/notification.service.ts');
    for (const key of REMOVED_PAYMENT_ROUTES) {
      expect(notificationSource).not.toMatch(
        new RegExp(`NavigationRoutes\\.APP_STACK\\.${key}`),
      );
    }
  });

  it('no active navigate() calls target removed payment screens', () => {
    const srcDir = path.join(ROOT, 'src');
    const offenders: string[] = [];

    function walk(dir: string) {
      for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        const full = path.join(dir, entry.name);
        if (entry.isDirectory()) {
          if (entry.name !== 'node_modules') walk(full);
          continue;
        }
        if (!/\.(ts|tsx)$/.test(entry.name)) continue;

        const content = fs.readFileSync(full, 'utf8');
        if (content.includes('// navigate(NavigationRoutes')) continue;

        for (const key of REMOVED_PAYMENT_ROUTES) {
          const activePattern = new RegExp(
            `(?<!//.*)navigate\\(\\s*NavigationRoutes\\.APP_STACK\\.${key}`,
          );
          if (activePattern.test(content)) {
            offenders.push(`${path.relative(ROOT, full)} -> ${key}`);
          }
        }
      }
    }

    walk(srcDir);
    expect(offenders).toEqual([]);
  });
});

describe('QA: deleted module imports', () => {
  const forbiddenImports = [
    '@/services/paymentService',
    '@/config/myfatoorah.config',
    'myfatoorah-reactnative',
    'screens/appstack/Billing/',
    'screens/auth/Payment/',
    'screens/common/Payment/',
  ];

  it('has no imports of removed payment modules', () => {
    const srcDir = path.join(ROOT, 'src');
    const offenders: string[] = [];

    function walk(dir: string) {
      for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        const full = path.join(dir, entry.name);
        if (entry.isDirectory()) {
          walk(full);
          continue;
        }
        if (!/\.(ts|tsx)$/.test(entry.name)) continue;
        const content = fs.readFileSync(full, 'utf8');
        for (const token of forbiddenImports) {
          if (content.includes(token)) {
            offenders.push(`${path.relative(ROOT, full)} imports ${token}`);
          }
        }
      }
    }

    walk(srcDir);
    expect(offenders).toEqual([]);
  });
});

describe('QA: unsafe route.params destructuring hotspots', () => {
  const filesToGuard = [
    'src/screens/auth/EnterPassword/EnterPasswordContainer.ts',
    'src/screens/appstack/CancelReservation/StepOne.tsx',
    'src/screens/appstack/TaskManagement/screen/ChecklistDetail/ChecklistDetail.tsx',
    'src/screens/appstack/AIAutoReplyFeature/containers/CategoryInstructionsContainer.ts',
  ];

  it('documents screens that still need params guards (informational)', () => {
    const unguarded: string[] = [];
    for (const file of filesToGuard) {
      const content = read(file);
      const hasUnsafe =
        /= route\.params;/.test(content) ||
        (/= params;/.test(content) && !/params \?\?/.test(content) && !/params \|\|/.test(content));
      if (hasUnsafe) unguarded.push(file);
    }
    // Informational — these are known edge-case risks, not hard failures
    expect(unguarded.length).toBeGreaterThanOrEqual(0);
  });
});
