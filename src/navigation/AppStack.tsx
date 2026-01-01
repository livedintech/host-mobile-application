import React from 'react';
import { StyleSheet } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import NavigationRoutes from './NavigationRoutes';
import HeaderApp from '@/components/molecules/Header/HeaderApp';
import TabStack from './TabStack';

const Stack = createNativeStackNavigator();
const { Navigator, Screen } = Stack;

const AppStack = () => {
  return (
    <Stack.Navigator
      initialRouteName={NavigationRoutes.APP_STACK.ROOT_STACK}
    >
      <Stack.Screen
        options={{
          headerShown: false
        }}
        name={NavigationRoutes.APP_STACK.ROOT_STACK}
        component={TabStack}
      />
      <Stack.Screen
        options={{ header: () => <HeaderApp isLogo isLang /> }}
        name={NavigationRoutes.APP_STACK.HOME}
        getComponent={() =>
          require('@/screens/appstack/Home/HomeScreen')
            .default
        }
      />
    
     <Stack.Screen
        options={{ header: () => <HeaderApp isLogo isLang/> }}
        name={NavigationRoutes.APP_STACK.LISTING}
        getComponent={() =>
          require('@/screens/appstack/Listing/ListingScreen')
            .default
        }
      />
      <Stack.Screen
        options={{ header: () => <HeaderApp isLogo isLang/> }}
        name={NavigationRoutes.APP_STACK.MESSAGE}
        getComponent={() =>
          require('@/screens/appstack/Message/MessageScreen')
            .default
        }
      />
      <Stack.Screen
        options={{ header: () => <HeaderApp isLogo isLang/> }}
        name={NavigationRoutes.APP_STACK.TASK}
        getComponent={() =>
          require('@/screens/appstack/Task/TaskScreen')
            .default
        }
      />
       <Stack.Screen
        options={{ header: () => <HeaderApp isLogo isLang/> }}
        name={NavigationRoutes.APP_STACK.MORE}
        getComponent={() =>
          require('@/screens/appstack/More/MoreScreen')
            .default
        }
      />
      <Stack.Screen
        options={{ header: () => <HeaderApp isLogo isGoBackAfterLogo isLang/> }}
        name={NavigationRoutes.APP_STACK.BILLING}
        getComponent={() =>
          require('@/screens/appstack/Billing/BillingScreen')
            .default
        }
      />
      <Stack.Screen
        options={{ header: () => <HeaderApp isGoBackAfterLogo/> }}
        name={NavigationRoutes.APP_STACK.SUBSCRIPTION_HISTORY}
        getComponent={() =>
          require('@/screens/appstack/SubscriptionHistory/SubscriptionHistoryScreen')
            .default
        }
      />
      <Stack.Screen
        options={{ header: () => <HeaderApp isGoBackAfterLogo/> }}
        name={NavigationRoutes.APP_STACK.TRANSACTION_HISTORY}
        getComponent={() =>
          require('@/screens/appstack/TransactionHistory/TransactionHistoryScreen')
            .default
        }
      />
      <Stack.Screen
        options={{ header: () => <HeaderApp isGoBackAfterLogo/> }}
        name={NavigationRoutes.APP_STACK.PAYMENT_METHOD_LIST}
        getComponent={() =>
          require('@/screens/appstack/PaymentMethodList/PaymentMethodListScreen')
            .default
        }
      />
      <Stack.Screen
        options={{ header: () => <HeaderApp isGoBackAfterLogo/> }}
        name={NavigationRoutes.APP_STACK.ADD_NEW_PAYMENT_METHOD}
        getComponent={() =>
          require('@/screens/appstack/AddNewPaymentMethod/AddNewPaymentMethodScreen')
            .default
        }
      />
      <Stack.Screen
        options={{ header: () => <HeaderApp isGoBackAfterLogo/> }}
        name={NavigationRoutes.APP_STACK.SELECT_PAYMENT_METHOD}
        getComponent={() =>
          require('@/screens/appstack/SelectPayment/SelectPaymentScreen')
            .default
        }
      />
      <Stack.Screen
        options={{ header: () => <HeaderApp isGoBackAfterLogo/> }}
        name={NavigationRoutes.APP_STACK.ACCOUNT}
        getComponent={() =>
          require('@/screens/appstack/Account/AccountScreen')
            .default
        }
      />

    </Stack.Navigator>
  );
};

export default AppStack;

const styles = StyleSheet.create({});
