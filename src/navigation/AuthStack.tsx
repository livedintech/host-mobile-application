import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import NavigationRoutes from './NavigationRoutes';
import HeaderApp from '@/components/molecules/Header/HeaderApp';

const Stack = createNativeStackNavigator();
const { Navigator, Screen } = Stack;

const AuthStack = () => {
  return (
    <Navigator initialRouteName={NavigationRoutes.AUTH_STACK.ON_BOARDING}>
      <Screen
        options={{
          headerShown: false,
        }}
        name={NavigationRoutes.AUTH_STACK.ON_BOARDING}
        getComponent={() =>
          require('@/screens/auth/Onboarding/OnboardingScreen').default
        }
      />
      <Screen
       options={{ header: () => <HeaderApp isGoBack/> }}
        name={NavigationRoutes.AUTH_STACK.LOGIN_WITH_PHONE}
        getComponent={() =>
          require('@/screens/auth/LoginWithPhone/LoginWithPhoneScreen').default
        }
      />
      <Screen
        options={{
          headerShown: false,
        }}
        name={NavigationRoutes.AUTH_STACK.PROPERTY_CAN_EARN}
        getComponent={() =>
          require('@/screens/auth/PropertyCanEarn/PropertyCanEarnScreen')
            .default
        }
      />
      <Screen
        options={{ header: () => <HeaderApp /> }}
        name={NavigationRoutes.AUTH_STACK.CONNECT_CALENDARS_INTRO}
        getComponent={() =>
          require('@/screens/auth/ConnectCalendarsIntro/ConnectCalendarsIntroScreen')
            .default
        }
      />
      <Screen
        options={{ header: () => <HeaderApp /> }}
        name={NavigationRoutes.AUTH_STACK.AGENT_INTRO}
        getComponent={() =>
          require('@/screens/auth/AgentIntro/AgentIntroScreen')
            .default
        }
      />
       <Screen
        options={{ header: () => <HeaderApp isGoBack/> }}
        name={NavigationRoutes.AUTH_STACK.VERIFY_PHONE_NUMBER}
        getComponent={() =>
          require('@/screens/appstack/VerifyPhoneNumber/VerifyPhoneNumberScreen')
            .default
        }
      />
      <Screen
        options={{ header: () => <HeaderApp /> }}
        name={NavigationRoutes.AUTH_STACK.MANAGE_LISTING}
        getComponent={() =>
          require('@/screens/appstack/ManageListing/ManageListingScreen')
            .default
        }
      />
      <Screen
        options={{
          headerShown: false,
        }}
        name={NavigationRoutes.AUTH_STACK.CREATE_ACCOUNT}
        getComponent={() =>
          require('@/screens/appstack/CreateAccount/CreateAccountScreen')
            .default
        }
      />
      <Screen
        options={{ header: () => <HeaderApp isGoBack/> }}
        name={NavigationRoutes.AUTH_STACK.ENTER_PASSWORD}
        getComponent={() =>
          require('@/screens/auth/EnterPassword/EnterPasswordScreen')
            .default
        }
      />
      <Screen
        options={{ header: () => <HeaderApp isGoBack/> }}
        name={NavigationRoutes.AUTH_STACK.ADD_NEW_PASSWORD}
        getComponent={() =>
          require('@/screens/auth/AddNewPassword/AddNewPasswordScreen').default
        }
      />
    </Navigator>
  );
};

export default AuthStack;
