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

export function navigate<K extends keyof any>(
    route: string,
    params?: object | any[K],
) {
    navigationRef.current!.navigate(route, params)
}

export function replace(route: string, params?: object) {
    navigationRef.current!.dispatch(StackActions.replace(route, params))
}

export function navigateToRoot(route: string, params?: object) {
    navigate(NavigationRoutes.APP_STACK.ROOT_STACK, {
        screen: route,
        params,
    })
}

export function goBack(count = 1) {
    if (typeof count === 'number' && count > 1) {
        return navigationRef.current!.dispatch(state => {
            const routes = state.routes.slice(0, -count)
            return CommonActions.reset({
                ...state,
                routes,
                index: routes.length - 1,
            })
        })
    }
    navigationRef.current!.goBack()
}

export function pop(count = 1) {
    const popAction = StackActions.pop(count)
    navigationRef.current!.dispatch(popAction)
}

export function reset(route: string, params?: object) {
    navigationRef.current!.dispatch(
        CommonActions.reset({
            index: 0,
            routes: [{ name: route, params }],
        }),
    )
}

export function resetToRoutes(routes = []) {
    navigationRef.current!.dispatch(
        CommonActions.reset({
            index: routes.length - 1,
            routes: routes,
        }),
    )
}

export function dispatch(
    action: NavigationAction | ((state: NavigationState) => NavigationAction),
) {
    navigationRef.current!.dispatch(action)
}