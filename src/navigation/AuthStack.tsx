import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import NavigationRoutes from './NavigationRoutes';

const Stack = createNativeStackNavigator();
const { Navigator, Screen } = Stack;

const AuthStack = () => {

    return (
        <Navigator>
            <Screen
                name={NavigationRoutes.AUTH_STACK.LOGIN}
                getComponent={() => require('@/screens/auth/Login/LoginScreen').default}
            />
        </Navigator>
    );
};

export default AuthStack;
