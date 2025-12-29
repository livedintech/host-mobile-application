import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import NavigationRoutes from './NavigationRoutes';
import BottomTab from '@/components/molecules/BottomTab/BottomTab';
import HeaderApp from '@/components/molecules/Header/HeaderApp';

const Tab = createBottomTabNavigator();

const TabStack = () => {
  return (
    <Tab.Navigator
      tabBar={(props) => <BottomTab {...props} />}
      screenOptions={{
        header: () => <HeaderApp isLogo isLang />,
      }}
    >
      <Tab.Screen 
        name={NavigationRoutes.APP_STACK.HOME} 
        component={require('@/screens/appstack/Home/HomeScreen').default} 
      />
      <Tab.Screen 
        name={NavigationRoutes.APP_STACK.LISTING} 
        component={require('@/screens/appstack/Listing/ListingScreen').default} 
      />
      <Tab.Screen 
        name={NavigationRoutes.APP_STACK.MESSAGE} 
        component={require('@/screens/appstack/Message/MessageScreen').default} 
      />
      <Tab.Screen 
        name={NavigationRoutes.APP_STACK.TASK} 
        component={require('@/screens/appstack/Task/TaskScreen').default} 
      />
      <Tab.Screen 
        name={NavigationRoutes.APP_STACK.MORE} 
        component={require('@/screens/appstack/More/MoreScreen').default} 
      />
    </Tab.Navigator>
  );
};

export default TabStack;