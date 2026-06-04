import { createRef } from 'react'
import {
    StackActions,
    CommonActions,
    NavigationContainerRef,
    NavigationAction,
    NavigationState,
} from '@react-navigation/native'
import NavigationRoutes from '@/navigation/NavigationRoutes'

export const navigationRef = createRef<NavigationContainerRef<any>>()

let lastNavigateTime = 0
const NAVIGATE_DEBOUNCE_MS = 300

function isReady(): boolean {
    return !!navigationRef.current?.isReady()
}

function canNavigate(debounce = true): boolean {
    if (!isReady()) return false
    if (!debounce) return true
    const now = Date.now()
    if (now - lastNavigateTime < NAVIGATE_DEBOUNCE_MS) return false
    lastNavigateTime = now
    return true
}

export function navigate(route: string, params?: object) {
    if (canNavigate()) {
        ;(navigationRef.current! as any).navigate(route, params)
    }
}

export function replace(route: string, params?: object) {
    if (canNavigate()) {
        navigationRef.current!.dispatch(StackActions.replace(route, params))
    }
}

export function navigateToRoot(route: string, params?: object) {
    if (canNavigate()) {
        ;(navigationRef.current! as any).navigate(NavigationRoutes.APP_STACK.ROOT_STACK, {
            screen: route,
            params,
        })
    }
}

export function goBack(count = 1) {
    if (!isReady()) return

    if (typeof count === 'number' && count > 1) {
        if (!navigationRef.current!.canGoBack()) return
        navigationRef.current!.dispatch(state => {
            const routes = state.routes.slice(0, -count)
            if (routes.length === 0) return CommonActions.goBack()
            return CommonActions.reset({
                ...state,
                routes,
                index: routes.length - 1,
            })
        })
        return
    }

    if (navigationRef.current!.canGoBack()) {
        navigationRef.current!.goBack()
    }
}

export function pop(count = 1) {
    if (!isReady()) return
    if (!navigationRef.current!.canGoBack()) return
    navigationRef.current!.dispatch(StackActions.pop(count))
}

export function reset(route: string, params?: object) {
    if (!isReady()) return
    navigationRef.current!.dispatch(
        CommonActions.reset({
            index: 0,
            routes: [{ name: route, params }],
        }),
    )
}

export function resetToRoutes(routes: any[] = []) {
    if (!isReady() || routes.length === 0) return
    navigationRef.current!.dispatch(
        CommonActions.reset({
            index: routes.length - 1,
            routes,
        }),
    )
}

export function dispatch(
    action: NavigationAction | ((state: NavigationState) => NavigationAction),
) {
    if (!isReady()) return
    navigationRef.current!.dispatch(action)
}

export function canGoBack(): boolean {
    return isReady() && !!navigationRef.current!.canGoBack()
}
