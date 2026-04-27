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
        options={{ header: () => <HeaderApp isGoBack isLang /> }}
        name={NavigationRoutes.AUTH_STACK.LOGIN_WITH_PHONE}
        getComponent={() =>
          require('@/screens/auth/LoginWithPhone/LoginWithPhoneScreen').default
        }
      />
      <Screen
        options={{ header: () => <HeaderApp isGoBack isGetStarted isLang /> }}
        name={NavigationRoutes.AUTH_STACK.PROPERTY_CAN_EARN}
        getComponent={() =>
          require('@/screens/auth/PropertyCanEarn/PropertyCanEarnScreen')
            .default
        }
      />
      <Screen
        options={{ header: () => <HeaderApp isGoBack isLang isGetStarted /> }}
        name={NavigationRoutes.AUTH_STACK.CONNECT_CALENDARS_INTRO}
        getComponent={() =>
          require('@/screens/auth/ConnectCalendarsIntro/ConnectCalendarsIntroScreen')
            .default
        }
      />
      <Screen
        options={{ header: () => <HeaderApp isGoBack isLang isGetStarted /> }}
        name={NavigationRoutes.AUTH_STACK.AGENT_INTRO}
        getComponent={() =>
          require('@/screens/auth/AgentIntro/AgentIntroScreen')
            .default
        }
      />
      <Screen
        options={{ header: () => <HeaderApp isGoBack isLang /> }}
        name={NavigationRoutes.AUTH_STACK.VERIFY_PHONE_NUMBER}
        getComponent={() =>
          require('@/screens/auth/VerifyPhoneNumber/VerifyPhoneNumberScreen')
            .default
        }
      />
      <Screen
        options={{ header: () => <HeaderApp isGoBack isLang /> }}
        name={NavigationRoutes.AUTH_STACK.MANAGE_LISTING}
        getComponent={() =>
          require('@/screens/auth/ManageListing/ManageListingScreen')
            .default
        }
      />
      <Screen
        options={{ header: () => <HeaderApp isGoBack isLang />,gestureEnabled: false, }}
        name={NavigationRoutes.AUTH_STACK.CREATE_ACCOUNT}
        getComponent={() =>
          require('@/screens/auth/CreateAccount/CreateAccountScreen')
            .default
        }
      />
      <Screen
        options={{ header: () => <HeaderApp isGoBack isLang /> }}
        name={NavigationRoutes.AUTH_STACK.ENTER_PASSWORD}
        getComponent={() =>
          require('@/screens/auth/EnterPassword/EnterPasswordScreen')
            .default
        }
      />
      <Screen
        options={{ header: () => <HeaderApp isGoBack isLang /> }}
        name={NavigationRoutes.AUTH_STACK.ADD_NEW_PASSWORD}
        getComponent={() =>
          require('@/screens/auth/AddNewPassword/AddNewPasswordScreen').default
        }
      />
      <Screen
        options={{ header: () => <HeaderApp isGoBack /> }}
        name={NavigationRoutes.AUTH_STACK.PAYMENT}
        getComponent={() =>
          require('@/screens/auth/Payment/PaymentScreen').default
        }
      />
      <Stack.Screen
        options={{ header: () => <HeaderApp isGoBack isLang /> }}
        name={NavigationRoutes.AUTH_STACK.SELECT_PAYMENT_METHOD}
        getComponent={() =>
          require('@/screens/appstack/SelectPayment/SelectPaymentScreen')
            .default
        }
      />
      <Stack.Screen
        options={{ header: () => <HeaderApp isGoBack isLang /> }}
        name={NavigationRoutes.AUTH_STACK.ADD_NEW_PAYMENT_METHOD}
        getComponent={() =>
          require('@/screens/appstack/AddNewPaymentMethod/AddNewPaymentMethodScreen')
            .default
        }
      />
      <Screen
        options={{ header: () => <HeaderApp isGoBack isLang /> }}
        name={NavigationRoutes.AUTH_STACK.ADD_CARD_DETAIL}
        getComponent={() =>
          require('@/screens/auth/AddCardDetail/AddCardDetailScreen').default
        }
      />
      <Screen
        options={{ header: () => <HeaderApp /> }}
        name={NavigationRoutes.AUTH_STACK.TRIAL_SUCCESS}
        getComponent={() =>
          require('@/screens/auth/TrialSuccess/TrialSuccessScreen').default
        }
      />
      <Screen
        options={{ header: () => <HeaderApp /> }}
        name={NavigationRoutes.AUTH_STACK.UPDATE_PASSWORD}
        getComponent={() =>
          require('@/screens/auth/updatePassword/UpdatePasswordScreen').default
        }
      />
      <Screen
        options={{ header: () => <HeaderApp isGoBack isLang /> }}
        name={NavigationRoutes.AUTH_STACK.HUB_SPOT_DETAIL_FORM}
        getComponent={() =>
          require('@/screens/auth/HubspotDetailForm/HubspotDetailFormScreen').default
        }
      />
      <Screen
        options={{ header: () => <HeaderApp isGoBack isLang /> }}
        name={NavigationRoutes.AUTH_STACK.HUB_SPOT_CALENDAR}
        getComponent={() =>
          require('@/screens/auth/HubspotCalendar/HubspotCalendarScreen').default
        }
      />
      <Screen
        options={{ header: () => <HeaderApp /> }}
        name={NavigationRoutes.AUTH_STACK.HUB_SPOT_THANK_YOU}
        getComponent={() =>
          require('@/screens/auth/HubspotThankyou/HubspotThankyouScreen').default
        }
      />
    </Navigator>
  );
};

export default AuthStack;
