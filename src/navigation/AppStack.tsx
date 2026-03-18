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
    <Stack.Navigator initialRouteName={NavigationRoutes.APP_STACK.ROOT_STACK}>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
        name={NavigationRoutes.APP_STACK.ROOT_STACK}
        component={TabStack}
      />
      <Stack.Screen
        options={{ header: () => <HeaderApp isLogo isLang /> }}
        name={NavigationRoutes.APP_STACK.HOME}
        getComponent={() =>
          require('@/screens/appstack/Home/HomeScreen').default
        }
      />

      <Stack.Screen
        options={{ header: () => <HeaderApp isLogo isLang /> }}
        name={NavigationRoutes.APP_STACK.LISTING}
        getComponent={() =>
          require('@/screens/appstack/Listing/ListingScreen').default
        }
      />
      <Stack.Screen
        // options={{ header: () => <HeaderApp isLogo isLang /> }}
        name={NavigationRoutes.APP_STACK.CHAT}
        getComponent={() =>
          require('@/screens/appstack/Chat/ChatScreen').default
        }
      />
      <Stack.Screen
        options={{ header: () => <HeaderApp isGoBackAfterLogo /> }}
        name={NavigationRoutes.APP_STACK.CREATE_TASK}
        getComponent={() =>
          require('@/screens/appstack/TaskManagement/screens/CreateTask/CreateTaskScreen')
            .default
        }
      />
      {/* TASK SCREEN OLD */}
      {/* <Stack.Screen
        options={{ header: () => <HeaderApp isLogo isLang /> }}
        name={NavigationRoutes.APP_STACK.TASK}
        getComponent={() =>
          require('@/screens/appstack/TaskManagement/screens/TaskList/TaskListScreen')
            .default
        }
      />


      
      <Stack.Screen
        options={{ header: () => <HeaderApp isGoBackAfterLogo /> }}
        name={NavigationRoutes.APP_STACK.CREATE_CHECKLIST}
        getComponent={() =>
          require('@/screens/appstack/TaskManagement/screens/CreateChecklist/CreateChecklistScreen')
            .default
        }
      />
      <Stack.Screen
        options={{ header: () => <HeaderApp isGoBackAfterLogo /> }}
        name={NavigationRoutes.APP_STACK.EDIT_TASK}
        getComponent={() =>
          require('@/screens/appstack/TaskManagement/screens/EditTask/EditTaskScreen')
            .default
        }
      />
      <Stack.Screen
        options={{ header: () => <HeaderApp isGoBackAfterLogo /> }}
        name={NavigationRoutes.APP_STACK.VIEW_TASK}
        getComponent={() =>
          require('@/screens/appstack/TaskManagement/screens/ViewTask/ViewTaskScreen')
            .default
        }
      /> */}

      {/* TASK SCREEN OLD END */}

      {/* <Stack.Screen
        options={{ headerShown: false }}
        name={NavigationRoutes.APP_STACK.MORE}
        getComponent={() =>
          require('@/screens/appstack/More/MoreScreen').default
        }
      /> */}
      <Stack.Screen
        options={{
          header: () => <HeaderApp isLogo isGoBackAfterLogo isLang />,
        }}
        name={NavigationRoutes.APP_STACK.BILLING}
        getComponent={() =>
          require('@/screens/appstack/Billing/BillingScreen').default
        }
      />
      <Stack.Screen
        options={{ header: () => <HeaderApp isGoBackAfterLogo /> }}
        name={NavigationRoutes.APP_STACK.SUBSCRIPTION_HISTORY}
        getComponent={() =>
          require('@/screens/appstack/SubscriptionHistory/SubscriptionHistoryScreen')
            .default
        }
      />
      <Stack.Screen
        options={{ header: () => <HeaderApp isGoBackAfterLogo /> }}
        name={NavigationRoutes.APP_STACK.TRANSACTION_HISTORY}
        getComponent={() =>
          require('@/screens/appstack/TransactionHistory/TransactionHistoryScreen')
            .default
        }
      />
      <Stack.Screen
        options={{ header: () => <HeaderApp isGoBackAfterLogo /> }}
        name={NavigationRoutes.APP_STACK.PAYMENT_METHOD_LIST}
        getComponent={() =>
          require('@/screens/appstack/PaymentMethodList/PaymentMethodListScreen')
            .default
        }
      />
      <Stack.Screen
        options={{ header: () => <HeaderApp isGoBackAfterLogo /> }}
        name={NavigationRoutes.APP_STACK.ADD_NEW_PAYMENT_METHOD}
        getComponent={() =>
          require('@/screens/appstack/AddNewPaymentMethod/AddNewPaymentMethodScreen')
            .default
        }
      />
      <Stack.Screen
        options={{ header: () => <HeaderApp isGoBackAfterLogo /> }}
        name={NavigationRoutes.APP_STACK.SELECT_PAYMENT_METHOD}
        getComponent={() =>
          require('@/screens/appstack/SelectPayment/SelectPaymentScreen')
            .default
        }
      />
      <Stack.Screen
        options={{ header: () => <HeaderApp isGoBackAfterLogo /> }}
        name={NavigationRoutes.APP_STACK.ACCOUNT}
        getComponent={() =>
          require('@/screens/appstack/Account/AccountScreen').default
        }
      />
      <Stack.Screen
        options={{ header: () => <HeaderApp isGoBackAfterLogo /> }}
        name={NavigationRoutes.APP_STACK.ANALYTIC_SCREEN}
        getComponent={() =>
          require('@/screens/appstack/Analytics/screens/AnalyticsScreen')
            .default
        }
      />
      <Stack.Screen
        options={{
          header: () => (
            <HeaderApp isGoBackAfterLogo addIconAfterisGoBack="mapIcon" />
          ),
        }}
        name={NavigationRoutes.APP_STACK.MANAGE_BOOKING}
        getComponent={() =>
          require('@/screens/appstack/ManageBooking/ManageBookingScreen')
            .default
        }
      />
      <Stack.Screen
        options={{ headerShown: false }}
        name={NavigationRoutes.APP_STACK.AIRBNB_IMPORT}
        getComponent={() =>
          require('@/screens/appstack/AirbnbImport/AirbnbImportScreen').default
        }
      />
      <Stack.Screen
        options={{ header: () => <HeaderApp isGoBackAfterLogo /> }}
        name={NavigationRoutes.APP_STACK.GATHREN_PMSID}
        getComponent={() =>
          require('@/screens/appstack/GathrenCreateAccount/GathrenCreateAccountScreen')
            .default
        }
      />
      <Stack.Screen
        options={{ headerShown: false }}
        name={NavigationRoutes.APP_STACK.GATHERN_IMPORT}
        getComponent={() =>
          require('@/screens/appstack/GathernImport/GathernImportScreen')
            .default
        }
      />
      <Stack.Screen
        options={{ header: () => <HeaderApp isGoBackAfterLogo /> }}
        name={NavigationRoutes.APP_STACK.BOOKING_COM_PMSID}
        getComponent={() =>
          require('@/screens/appstack/BookingComPMSID/BookingComPMSIDScreen')
            .default
        }
      />
      <Stack.Screen
        options={{ header: () => <HeaderApp isGoBackAfterLogo /> }}
        name={NavigationRoutes.APP_STACK.PROFILE_SETTING}
        getComponent={() =>
          require('@/screens/appstack/Profile/ProfileScreen').default
        }
      />
      <Stack.Screen
        options={{ header: () => <HeaderApp isGoBackAfterLogo /> }}
        name={NavigationRoutes.APP_STACK.CHANGE_PASSWORD}
        getComponent={() =>
          require('@/screens/appstack/ChangePassword/ChangePasswordScreen')
            .default
        }
      />
      <Stack.Screen
        options={{ header: () => <HeaderApp isGoBackAfterLogo /> }}
        name={NavigationRoutes.APP_STACK.MANAGE_YOUR_LISTINGS}
        getComponent={() =>
          require('@/screens/appstack/ManageListing/ManageListingScreen')
            .default
        }
      />
      <Stack.Screen
        options={{ header: () => <HeaderApp isGoBackAfterLogo /> }}
        name={NavigationRoutes.APP_STACK.CREATE_LISTING_STEP_ONE}
        getComponent={() =>
          require('@/screens/appstack/CreateListingStepOne/CreateListingStepOneScreen')
            .default
        }
      />
      <Stack.Screen
        options={{ headerShown: false }}
        name={NavigationRoutes.APP_STACK.CREATE_LISTING_STEP_ONE_SET_LOCATION}
        getComponent={() =>
          require('@/screens/appstack/CreateListingStepOneLocation/CreateListingStepOneLocationScreen')
            .default
        }
      />
      <Stack.Screen
        options={{ headerShown: false }}
        name={NavigationRoutes.APP_STACK.CONFIRM_ADDRESS}
        getComponent={() =>
          require('@/screens/appstack/ConfirmAddress/ConfirmAddressScreen')
            .default
        }
      />
      <Stack.Screen
        options={{ headerShown: false }}
        name={NavigationRoutes.APP_STACK.ABOUT_THE_PLACE}
        getComponent={() =>
          require('@/screens/appstack/AboutThePlace/AboutThePlaceScreen')
            .default
        }
      />
      <Stack.Screen
        options={{ headerShown: false }}
        name={NavigationRoutes.APP_STACK.INTERIOR_PHOTOS_VIDEOS}
        getComponent={() =>
          require('@/screens/appstack/InteriorPhoto/InteriorPhotoScreen')
            .default
        }
      />
      <Stack.Screen
        options={{ headerShown: false }}
        name={NavigationRoutes.APP_STACK.OTHER_VIDEOS}
        getComponent={() =>
          require('@/screens/appstack/OtherPhotos/OtherPhotosScreen').default
        }
      />
      <Stack.Screen
        options={{ headerShown: false }}
        name={NavigationRoutes.APP_STACK.EXTERIOR_PHOTOS_VIDEOS}
        getComponent={() =>
          require('@/screens/appstack/ExteriorPhoto/ExteriorPhotoScreen')
            .default
        }
      />
      <Stack.Screen
        options={{ headerShown: false }}
        name={NavigationRoutes.APP_STACK.BATHROOM_PHOTOS_VIDEOS}
        getComponent={() =>
          require('@/screens/appstack/BathroomPhoto/BathroomPhotoScreen')
            .default
        }
      />
      <Stack.Screen
        options={{ headerShown: false }}
        name={NavigationRoutes.APP_STACK.DESCRIBE_YOUR_HOUSE}
        getComponent={() =>
          require('@/screens/appstack/DescribeHouse/DescribeHouseScreen')
            .default
        }
      />
      <Stack.Screen
        options={{ headerShown: false }}
        name={NavigationRoutes.APP_STACK.SET_YOUR_PRICING}
        getComponent={() =>
          require('@/screens/appstack/SetPricing/SetPricingScreen').default
        }
      />
      <Stack.Screen
        options={{ headerShown: false }}
        name={NavigationRoutes.APP_STACK.PROPERTY_DISCLOSURE}
        getComponent={() =>
          require('@/screens/appstack/PropertyDisclosure/PropertyDisclosureScreen')
            .default
        }
      />
      <Stack.Screen
        options={{ headerShown: false }}
        name={NavigationRoutes.APP_STACK.DOCUMENT_UPLOAD}
        getComponent={() =>
          require('@/screens/appstack/DocumentUpload/DocumentUploadScreen')
            .default
        }
      />
      <Stack.Screen
        options={{ header: () => <HeaderApp isGoBackAfterLogo /> }}
        name={NavigationRoutes.APP_STACK.PROPERTY_DETAIL}
        getComponent={() =>
          require('@/screens/appstack/PropertyDetail/PropertyDetailScreen')
            .default
        }
      />
      <Stack.Screen
        options={{ header: () => <HeaderApp isGoBackAfterLogo /> }}
        name={NavigationRoutes.APP_STACK.CONNECTED_OTA}
        getComponent={() =>
          require('@/screens/appstack/ConnectedOTA/ConnectedOTAScreen').default
        }
      />
      <Stack.Screen
        options={{ headerShown: false }}
        name={NavigationRoutes.APP_STACK.CHAT_DETAIL}
        getComponent={() =>
          require('@/screens/appstack/ChatDetail/ChatDetailScreen').default
        }
      />
      <Stack.Screen
        options={{ header: () => <HeaderApp isGoBackAfterLogo /> }}
        name={NavigationRoutes.APP_STACK.USER_MANAGEMENT}
        getComponent={() =>
          require('@/screens/appstack/UserManagement/screens/UserManagementScreen')
            .default
        }
      />
      <Stack.Screen
        options={{ header: () => <HeaderApp isGoBackAfterLogo /> }}
        name={NavigationRoutes.APP_STACK.USER_MANAGEMENT_FORM}
        getComponent={() =>
          require('@/screens/appstack/UserManagement/screens/UserFormScreen')
            .default
        }
      />

      <Stack.Screen
        options={{ header: () => <HeaderApp isGoBackAfterLogo /> }}
        name={NavigationRoutes.APP_STACK.SAVED_REPLIES}
        getComponent={() =>
          require('@/screens/appstack/SavedReplies/SavedRepliesScreen').default
        }
      />
      <Stack.Screen
        options={{ header: () => <HeaderApp isGoBackAfterLogo /> }}
        name={NavigationRoutes.APP_STACK.SAVED_REPLIES_CREATE_EDIT}
        getComponent={() =>
          require('@/screens/appstack/SavedRepliesCreateEdit/SavedRepliesCreateEditScreen')
            .default
        }
      />
      <Stack.Screen
        options={{ header: () => <HeaderApp isGoBackAfterLogo /> }}
        name={NavigationRoutes.APP_STACK.AUTOMATION_TEMPLATE}
        getComponent={() =>
          require('@/screens/appstack/AutomationTemplate/AutomationTemplateScreen')
            .default
        }
      />
      <Stack.Screen
        options={{ header: () => <HeaderApp isGoBackAfterLogo /> }}
        name={NavigationRoutes.APP_STACK.CREATE_EDIT_AUTOMATION_TEMPLATE}
        getComponent={() =>
          require('@/screens/appstack/AutomationTemplateCreateEdit/AutomationTemplateCreateEditScreen')
            .default
        }
      />
      <Stack.Screen
        options={{ header: () => <HeaderApp isGoBackAfterLogo /> }}
        name={NavigationRoutes.APP_STACK.AI_AUTO_REPLY}
        getComponent={() =>
          require('@/screens/appstack/AIAutoReply/AIAutoReplyScreen').default
        }
      />
      <Stack.Screen
        options={{ header: () => <HeaderApp isGoBackAfterLogo /> }}
        name={NavigationRoutes.APP_STACK.CREATE_EDIT_AI_AUTO_REPLY}
        getComponent={() =>
          require('@/screens/appstack/CreateEditAIRule/CreateEditAIRuleScreen')
            .default
        }
      />
      <Stack.Screen
        options={{ header: () => <HeaderApp isGoBackAfterLogo /> }}
        name={NavigationRoutes.APP_STACK.WHAT_AI_KNOWS}
        getComponent={() =>
          require('@/screens/appstack/WhatAIKnows/WhatAIKnowsScreen').default
        }
      />
      <Stack.Screen
        options={{ headerShown: false }}
        name={NavigationRoutes.APP_STACK.ASSIGN_CHAT}
        getComponent={() =>
          require('@/screens/appstack/AssignChat/AssignChatScreen').default
        }
      />
      <Stack.Screen
        options={{ headerShown: false }}
        name={NavigationRoutes.APP_STACK.RESERVATION_DETAILS}
        getComponent={() =>
          require('@/screens/appstack/ReservationDetails/ReservationDetailsScreen')
            .default
        }
      />
      {/* <Stack.Screen
        options={{ header: () => <HeaderApp isGoBackAfterLogo /> }}
        name={NavigationRoutes.APP_STACK.SMART_LOCK}
        getComponent={() =>
          require('@/screens/appstack/SmartLock/SmartLockScreen')
            .default
        }
      /> */}
      <Stack.Screen
        options={{ header: () => <HeaderApp isGoBackAfterLogo /> }}
        name={NavigationRoutes.APP_STACK.TT_LOCK_CREDENTIALS}
        getComponent={() =>
          require('@/screens/appstack/TTLockCredentials/TTLockCredentialsScreen')
            .default
        }
      />
      <Stack.Screen
        options={{ header: () => <HeaderApp isGoBackAfterLogo /> }}
        name={NavigationRoutes.APP_STACK.YOUR_SMART_LOCKS}
        getComponent={() =>
          require('@/screens/appstack/YourSmartLockss/YourSmartLocksScreen')
            .default
        }
      />
      <Stack.Screen
        options={{ headerShown: false }}
        name={NavigationRoutes.APP_STACK.SMART_LOCK_ACTIVITY_LOG}
        getComponent={() =>
          require('@/screens/appstack/SmartLockActivityLog/SmartLockActivityLogScreen')
            .default
        }
      />
      <Stack.Screen
        options={{ headerShown: false }}
        name={NavigationRoutes.APP_STACK.ACTIVE_CODES}
        getComponent={() =>
          require('@/screens/appstack/ActiveCodes/ActiveCodesScreen').default
        }
      />
      <Stack.Screen
        options={{ headerShown: false }}
        name={NavigationRoutes.APP_STACK.CREATE_EDIT_BOOKING_DETAIL}
        getComponent={() =>
          require('@/screens/appstack/CreateEditBookingDetail/CreateEditBookingDetailsScreen')
            .default
        }
      />
      <Stack.Screen
        options={{ headerShown: false }}
        name={NavigationRoutes.APP_STACK.CREATE_EDIT_HOUSE_GUIDELINES}
        getComponent={() =>
          require('@/screens/appstack/CreateEditListingHouseGuidelines/CreateEditListingHouseGuidelinesScreen')
            .default
        }
      />
      <Stack.Screen
        options={{ headerShown: false }}
        name={NavigationRoutes.APP_STACK.CREATE_EDIT_CANCEL_POLICIES}
        getComponent={() =>
          require('@/screens/appstack/CreateEditListingCancelPolicies/CreateEditListingCancelPoliciesScreen')
            .default
        }
      />
      <Stack.Screen
        options={{ headerShown: false }}
        name={NavigationRoutes.APP_STACK.CREATE_EDIT_AI_DYNAMIC_PRICING}
        getComponent={() =>
          require('@/screens/appstack/CreateEditListingAiDynamicPricing/CreateEditListingAiDynamicPricingScreen')
            .default
        }
      />
      <Stack.Screen
        options={{ header: () => <HeaderApp isGoBackAfterLogo /> }}
        name={NavigationRoutes.APP_STACK.GENERATE_PASSCODE}
        getComponent={() =>
          require('@/screens/appstack/GeneratePasscode/GeneratePasscodeScreen')
            .default
        }
      />
      <Stack.Screen
        options={{ header: () => <HeaderApp isGoBackAfterLogo /> }}
        name={NavigationRoutes.APP_STACK.REVIEW_MANAGEMENT}
        getComponent={() =>
          require('@/screens/appstack/ReviewManagement/screens/ReviewManagementScreen')
            .default
        }
      />
      <Stack.Screen
        options={{ header: () => <HeaderApp isGoBackAfterLogo /> }}
        name={NavigationRoutes.APP_STACK.REVIEW_MANAGEMENT_GUEST_RATE_SCREEN}
        getComponent={() =>
          require('@/screens/appstack/ReviewManagement/screens/RateYourGuestScreen')
            .default
        }
      />
      <Stack.Screen
        options={{ header: () => <HeaderApp isGoBackAfterLogo /> }}
        name={NavigationRoutes.APP_STACK.REVIEW_MANAGEMENT_DETAIL_SCREEN}
        getComponent={() =>
          require('@/screens/appstack/ReviewManagement/screens/ReviewDetailScreen')
            .default
        }
      />
      <Stack.Screen
        options={{ header: () => <HeaderApp isGoBackAfterLogo /> }}
        name={NavigationRoutes.APP_STACK.REVIEW_MANAGEMENT_VIEW_SCREEN}
        getComponent={() =>
          require('@/screens/appstack/ReviewManagement/screens/ViewReviewScreen')
            .default
        }
      />
      {/* NEW ANALYTIC SCREEN START */}
      <Stack.Screen
        options={{ header: () => <HeaderApp isGoBackAfterLogo /> }}
        name={NavigationRoutes.APP_STACK.STATISTICS_SCREEN}
        getComponent={() =>
          require('@/screens/appstack/Analytics/screens/StatisticsScreen')
            .default
        }
      />
      <Stack.Screen
        options={{ header: () => <HeaderApp isGoBackAfterLogo /> }}
        name={NavigationRoutes.APP_STACK.CHANNEL_PERFORMANCE}
        getComponent={() =>
          require('@/screens/appstack/Analytics/screens/ChannelPerformanceScreen')
            .default
        }
      />
      <Stack.Screen
        options={{ header: () => <HeaderApp isGoBackAfterLogo /> }}
        name={NavigationRoutes.APP_STACK.LISTING_PERFORMANCE}
        getComponent={() =>
          require('@/screens/appstack/Analytics/screens/ListingPerformanceScreen')
            .default
        }
      />
      {/* NEW ANALYTIC SCREEN END */}

      {/* /TASK LIST SCREEN NEW */}

      <Stack.Screen
        options={{ header: () => <HeaderApp isGoBackAfterLogo /> }}
        name={NavigationRoutes.APP_STACK.NO_TASK}
        getComponent={() =>
          require('@/screens/appstack/TaskManagement/screen/NoTaskScreen/NoTaskScreen')
            .default
        }
      />
      <Stack.Screen
        options={{ header: () => <HeaderApp isGoBackAfterLogo /> }}
        name={NavigationRoutes.APP_STACK.RECURRING_INITIAL_SCREEN}
        getComponent={() =>
          require('@/screens/appstack/TaskManagement/screen/RecurringInitialScreen/RecurringInitialScreen')
            .default
        }
      />
      <Stack.Screen
        options={{ header: () => <HeaderApp isGoBackAfterLogo /> }}
        name={NavigationRoutes.APP_STACK.RECURRING_TASK_SCREEN}
        getComponent={() =>
          require('@/screens/appstack/TaskManagement/screen/RecurringTaskScreen/RecurringTaskScreen')
            .default
        }
      />
      {/* <Stack.Screen
        options={{ header: () => <HeaderApp isGoBackAfterLogo /> }}
        name={NavigationRoutes.APP_STACK.VIEW_CHECKLIST_ALL}
        getComponent={() =>
          require('@/screens/appstack/TaskManagement/screen/viewChecklistAll/viewChecklistAll')
            .default
        }
      /> */}
      <Stack.Screen
        options={{
          headerShown: false, 
        }}
        name={NavigationRoutes.APP_STACK.VIEW_CHECKLIST_ALL}
        getComponent={() =>
          require('@/screens/appstack/TaskManagement/screen/viewChecklistAll/viewChecklistAll')
            .default
        }
      />
      <Stack.Screen
        options={{
          headerShown: false, 
        }}
        name={NavigationRoutes.APP_STACK.CHECKLIST_DETAIL}
        getComponent={() =>
          require('@/screens/appstack/TaskManagement/screen/ChecklistDetail/ChecklistDetail')
            .default
        }
      />
      <Stack.Screen
        options={{ header: () => <HeaderApp isGoBackAfterLogo /> }}
        name={NavigationRoutes.APP_STACK.STAFF_NOTES}
        getComponent={() =>
          require('@/screens/appstack/TaskManagement/screen/StaffNotes/StaffNotes')
            .default
        }
      />
      <Stack.Screen
        options={{ header: () => <HeaderApp isGoBackAfterLogo /> }}
        name={NavigationRoutes.APP_STACK.TASK}
        getComponent={() =>
          require('@/screens/appstack/TaskManagement/screen/AllTask/AllTask')
            .default
        }
      />
      <Stack.Screen
        options={{ header: () => <HeaderApp isGoBackAfterLogo /> }}
        name={NavigationRoutes.APP_STACK.EDIT_TASK}
        getComponent={() =>
          require('@/screens/appstack/TaskManagement/screen/EditTask/EditTask')
            .default
        }
      />
      <Stack.Screen
        options={{ header: () => <HeaderApp isGoBackAfterLogo /> }}
        name={NavigationRoutes.APP_STACK.CREATE_TASK_NON_CLEANING}
        getComponent={() =>
          require('@/screens/appstack/TaskManagement/screen/createTaskNonCleaning/createTaskNonCleaning')
            .default
        }
      />
      <Stack.Screen
        options={{ header: () => <HeaderApp isGoBackAfterLogo /> }}
        name={NavigationRoutes.APP_STACK.PRE_ACTIVITY_SCREEN}
        getComponent={() =>
          require('@/screens/appstack/TaskManagement/screen/PreActivity/PreActivity')
            .default
        }
      />

      {/* /TASK LIST SCREEN NEW END */}
    </Stack.Navigator>
  );
};

export default AppStack;

const styles = StyleSheet.create({});
