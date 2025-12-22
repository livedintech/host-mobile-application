import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import NavigationRoutes from './NavigationRoutes';

const Stack = createNativeStackNavigator();
const { Navigator, Screen } = Stack;

const AuthStack = () => {

    return (
        <Navigator>
            <Screen
           options={{
            headerShown: false
           }} 
                name={NavigationRoutes.AUTH_STACK.ON_BOARDING}
                getComponent={() => require('@/screens/auth/Onboarding/OnboardingScreen').default}
            />
        </Navigator>
    );
};

export default AuthStack;
