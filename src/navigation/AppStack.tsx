
import React from 'react';
import { StyleSheet } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import NavigationRoutes from './NavigationRoutes';

const Stack = createNativeStackNavigator();
const { Navigator, Screen } = Stack;

const AppStack = () => {
    return (
        <Navigator initialRouteName={NavigationRoutes.APP_STACK.HOME}>
            <Screen
                name={NavigationRoutes.APP_STACK.HOME}
                getComponent={() => require('@/screens/appstack/Home/HomeScreen').default}
            />
        </Navigator>
    );
};

export default AppStack;

const styles = StyleSheet.create({});
