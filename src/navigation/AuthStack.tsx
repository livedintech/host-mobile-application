import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import NavigationRoutes from './NavigationRoutes';

const Stack = createNativeStackNavigator();
const { Navigator, Screen } = Stack;

const AuthStack = () => {

    return (
        <Navigator initialRouteName={NavigationRoutes.AUTH_STACK.ON_BOARDING}>
            <Screen
                options={{
                    headerShown: false
                }}
                name={NavigationRoutes.AUTH_STACK.ON_BOARDING}
                getComponent={() => require('@/screens/auth/Onboarding/OnboardingScreen').default}
            />
            <Screen
                options={{
                    headerShown: false
                }}
                name={NavigationRoutes.AUTH_STACK.LOGIN_WITH_PHONE}
                getComponent={() => require('@/screens/auth/LoginWithPhone/LoginWithPhoneScreen').default}
            />
        </Navigator>
    );
};

export default AuthStack;
