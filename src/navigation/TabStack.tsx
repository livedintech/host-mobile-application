import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import NavigationRoutes from './NavigationRoutes';
import BottomTab from '@/components/molecules/BottomTab/BottomTab';
import HeaderApp from '@/components/molecules/Header/HeaderApp';

const Tab = createBottomTabNavigator();

const TabStack = () => {
  return (
    <Tab.Navigator tabBar={props => <BottomTab {...props} />}>
      <Tab.Screen
        options={{ headerShown:false }}
        name={NavigationRoutes.APP_STACK.HOME}
        component={require('@/screens/appstack/Home/HomeScreen').default}
      />
      <Tab.Screen
        options={{ header: () => <HeaderApp /> }}
        name={NavigationRoutes.APP_STACK.LISTING}
        component={require('@/screens/appstack/Listing/ListingScreen').default}
      />
      <Tab.Screen
        options={{headerShown: false }}
        name={NavigationRoutes.APP_STACK.CHAT}
        component={require('@/screens/appstack/Chat/ChatScreen').default}
      />
    <Tab.Screen
  name={NavigationRoutes.APP_STACK.TASK}
  component={
    require('@/screens/appstack/TaskManagement/screen/AllTask/AllTask')
      .default
  }
  options={{ headerShown: false }}
/>
      <Tab.Screen
        options={{ headerShown: false }}
        name={NavigationRoutes.APP_STACK.MORE}
        component={require('@/screens/appstack/More/MoreScreenNew').default}
      />
    </Tab.Navigator>
  );
};

export default TabStack;
