import {
  CHECKLIST_ICON_MAP,
  DEFAULT_CHECKLIST_ICON,
  CUSTOM_SECTION_ICON,
} from '@/constants/checklistIcons';

export const getChecklistIcon = (key?: string, isCustom?: boolean) => {
  if (isCustom) {
    return CUSTOM_SECTION_ICON;
  }

  if (!key) {
    return DEFAULT_CHECKLIST_ICON;
  }

  const normalizedKey = key.toLowerCase();

  return CHECKLIST_ICON_MAP[normalizedKey] || DEFAULT_CHECKLIST_ICON;
};
