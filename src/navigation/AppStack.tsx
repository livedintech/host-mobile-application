import React from 'react';
import { StyleSheet } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import NavigationRoutes from './NavigationRoutes';
import HeaderApp from '@/components/molecules/Header/HeaderApp';

const Stack = createNativeStackNavigator();
const { Navigator, Screen } = Stack;

const AppStack = () => {
  return (
    <Navigator initialRouteName={NavigationRoutes.APP_STACK.HOME}>
      <Screen
        options={{ header: () => <HeaderApp /> }}
        name={NavigationRoutes.APP_STACK.HOME}
        getComponent={() =>
          require('@/screens/appstack/Home/HomeScreen')
            .default
        }
      />
      
    </Navigator>
  );
};

export default AppStack;

const styles = StyleSheet.create({});
