import React from 'react';
import { StyleSheet } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import NavigationRoutes from './NavigationRoutes';
import HeaderApp from '@/components/molecules/Header/HeaderApp';

const Stack = createNativeStackNavigator();
const { Navigator, Screen } = Stack;

const AppStack = () => {
  return (
    <Navigator initialRouteName={NavigationRoutes.APP_STACK.MORE}>
      <Screen
        options={{ header: () => <HeaderApp isLogo isLang/> }}
        name={NavigationRoutes.APP_STACK.HOME}
        getComponent={() =>
          require('@/screens/appstack/Home/HomeScreen')
            .default
        }
      />
      <Screen
        options={{ header: () => <HeaderApp isLogo isLang/> }}
        name={NavigationRoutes.APP_STACK.LISTING}
        getComponent={() =>
          require('@/screens/appstack/Listing/ListingScreen')
            .default
        }
      />
      <Screen
        options={{ header: () => <HeaderApp isLogo isLang/> }}
        name={NavigationRoutes.APP_STACK.MESSAGE}
        getComponent={() =>
          require('@/screens/appstack/Message/MessageScreen')
            .default
        }
      />
      <Screen
        options={{ header: () => <HeaderApp isLogo isLang/> }}
        name={NavigationRoutes.APP_STACK.TASK}
        getComponent={() =>
          require('@/screens/appstack/Task/TaskScreen')
            .default
        }
      />
       <Screen
        options={{ header: () => <HeaderApp isLogo isLang/> }}
        name={NavigationRoutes.APP_STACK.MORE}
        getComponent={() =>
          require('@/screens/appstack/More/MoreScreen')
            .default
        }
      />
    </Navigator>
  );
};

export default AppStack;

const styles = StyleSheet.create({});
