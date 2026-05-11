import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import NavigationRoutes from './NavigationRoutes';
import HeaderApp from '@/components/molecules/Header/HeaderApp';
import TabStack from './TabStack';

const Stack = createNativeStackNavigator();

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
        options={{ header: () => <HeaderApp isGoBack /> }}
        name={NavigationRoutes.APP_STACK.RESERVATION_CALENDAR}
        getComponent={() =>
          require('@/screens/appstack/Listing/ReservationCalendarScreen')
            .default
        }
      />
      <Stack.Screen
        options={{ header: () => <HeaderApp isGoBack /> }}
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
        options={{ header: () => <HeaderApp isGoBack /> }}
        name={NavigationRoutes.APP_STACK.CREATE_CHECKLIST}
        getComponent={() =>
          require('@/screens/appstack/TaskManagement/screens/CreateChecklist/CreateChecklistScreen')
            .default
        }
      />
      <Stack.Screen
        options={{ header: () => <HeaderApp isGoBack /> }}
        name={NavigationRoutes.APP_STACK.EDIT_TASK}
        getComponent={() =>
          require('@/screens/appstack/TaskManagement/screens/EditTask/EditTaskScreen')
            .default
        }
      />
      <Stack.Screen
        options={{ header: () => <HeaderApp isGoBack /> }}
        name={NavigationRoutes.APP_STACK.VIEW_TASK}
        getComponent={() =>
          require('@/screens/appstack/TaskManagement/screens/ViewTask/ViewTaskScreen')
            .default
        }
      /> */}

      {/* TASK SCREEN OLD END */}

      <Stack.Screen
        options={{
          header: () => <HeaderApp isLogo isGoBack isLang />,
        }}
        name={NavigationRoutes.APP_STACK.BILLING}
        getComponent={() =>
          require('@/screens/appstack/Billing/BillingScreen').default
        }
      />
      <Stack.Screen
        options={{ header: () => <HeaderApp isGoBack /> }}
        name={NavigationRoutes.APP_STACK.SUBSCRIPTION_HISTORY}
        getComponent={() =>
          require('@/screens/appstack/SubscriptionHistory/SubscriptionHistoryScreen')
            .default
        }
      />
      <Stack.Screen
        options={{ header: () => <HeaderApp isGoBack /> }}
        name={NavigationRoutes.APP_STACK.TRANSACTION_HISTORY}
        getComponent={() =>
          require('@/screens/appstack/TransactionHistory/TransactionHistoryScreen')
            .default
        }
      />
      <Stack.Screen
        options={{ header: () => <HeaderApp isGoBack /> }}
        name={NavigationRoutes.APP_STACK.PAYMENT_METHOD_LIST}
        getComponent={() =>
          require('@/screens/appstack/PaymentMethodList/PaymentMethodListScreen')
            .default
        }
      />
      <Stack.Screen
        options={{ header: () => <HeaderApp isGoBack /> }}
        name={NavigationRoutes.APP_STACK.ADD_NEW_PAYMENT_METHOD}
        getComponent={() =>
          require('@/screens/appstack/AddNewPaymentMethod/AddNewPaymentMethodScreen')
            .default
        }
      />
      <Stack.Screen
        options={{ header: () => <HeaderApp isGoBack /> }}
        name={NavigationRoutes.APP_STACK.SELECT_PAYMENT_METHOD}
        getComponent={() =>
          require('@/screens/appstack/SelectPayment/SelectPaymentScreen')
            .default
        }
      />
      <Stack.Screen
        options={{ header: () => <HeaderApp isGoBack /> }}
        name={NavigationRoutes.APP_STACK.ACCOUNT}
        getComponent={() =>
          require('@/screens/appstack/Account/AccountScreen').default
        }
      />
      <Stack.Screen
        options={{ header: () => <HeaderApp isGoBack /> }}
        name={NavigationRoutes.APP_STACK.ANALYTIC_SCREEN}
        getComponent={() =>
          require('@/screens/appstack/Analytics/screens/AnalyticsScreen')
            .default
        }
      />
      <Stack.Screen
        options={{
          header: () => <HeaderApp isGoBack />,
        }}
        name={NavigationRoutes.APP_STACK.MANAGE_BOOKING}
        getComponent={() =>
          require('@/screens/appstack/ManageBooking/ManageBookingScreen')
            .default
        }
      />
      <Stack.Screen
        options={{
          headerShown: false
        }}
        name={NavigationRoutes.APP_STACK.AIRBNB_IMPORT}
        getComponent={() =>
          require('@/screens/appstack/AirbnbImport/AirbnbImportScreen').default
        }
      />
      <Stack.Screen
        options={{ header: () => <HeaderApp isGoBack /> }}
        name={NavigationRoutes.APP_STACK.GATHREN_PMSID}
        getComponent={() =>
          require('@/screens/appstack/GathrenCreateAccount/GathrenCreateAccountScreen')
            .default
        }
      />
      <Stack.Screen
        options={{
          headerShown: false
        }}
        name={NavigationRoutes.APP_STACK.GATHERN_IMPORT}
        getComponent={() =>
          require('@/screens/appstack/GathernImport/GathernImportScreen')
            .default
        }
      />
      <Stack.Screen
        options={{ header: () => <HeaderApp isGoBack /> }}
        name={NavigationRoutes.APP_STACK.BOOKING_COM_PMSID}
        getComponent={() =>
          require('@/screens/appstack/BookingComPMSID/BookingComPMSIDScreen')
            .default
        }
      />
      <Stack.Screen
        options={{ header: () => <HeaderApp isGoBack /> }}
        name={NavigationRoutes.APP_STACK.PROFILE_SETTING}
        getComponent={() =>
          require('@/screens/appstack/Profile/ProfileScreen').default
        }
      />
      <Stack.Screen
        options={{ header: () => <HeaderApp isGoBack /> }}
        name={NavigationRoutes.APP_STACK.CHANGE_PASSWORD}
        getComponent={() =>
          require('@/screens/appstack/ChangePassword/ChangePasswordScreen')
            .default
        }
      />
      <Stack.Screen
        options={{ header: () => <HeaderApp isGoBack /> }}
        name={NavigationRoutes.APP_STACK.MANAGE_YOUR_LISTINGS}
        getComponent={() =>
          require('@/screens/appstack/ManageListing/ManageListingScreen')
            .default
        }
      />
      <Stack.Screen
        options={{ header: () => <HeaderApp isGoBack /> }}
        name={NavigationRoutes.APP_STACK.CREATE_LISTING_STEP_ONE}
        getComponent={() =>
          require('@/screens/appstack/CreateListingStepOne/CreateListingStepOneScreen')
            .default
        }
      />
      <Stack.Screen
        options={{ header: () => <HeaderApp isGoBack /> }}
        name={NavigationRoutes.APP_STACK.PROPERTY_STEP_ONE_WELCOME}
        getComponent={() =>
          require('@/screens/appstack/PropertyStep1Welcome/PropertyStep1Welcome')
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
        name={NavigationRoutes.APP_STACK.AMENITIES}
        getComponent={() =>
          require('@/screens/appstack/ListingManagement/Amenities/AmenitiesScreen')
            .default
        }
      />
      <Stack.Screen
        options={{ headerShown: false }}
        name={NavigationRoutes.APP_STACK.MAKE_PROPERTY_STAND_OUT}
        getComponent={() =>
          require('@/screens/appstack/ListingManagement/MakePropertyStandOut/MakePropertyStandOutScreen')
            .default
        }
      />
      <Stack.Screen
        options={{ headerShown: false }}
        name={NavigationRoutes.APP_STACK.LOCATION}
        getComponent={() =>
          require('@/screens/appstack/ListingManagement/Edit/Location/LocationScreen')
            .default
        }
      />
      <Stack.Screen
        options={{ headerShown: false }}
        name={NavigationRoutes.APP_STACK.WIFI_AND_DOOR_LOCK_SCREEN}
        getComponent={() =>
          require('@/screens/appstack/ListingManagement/Edit/WifiAndDoorLock/WifiAndDoorLockScreen')
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
        name={NavigationRoutes.APP_STACK.ADD_PROPERTY_GUIDELINES}
        getComponent={() =>
          require('@/screens/appstack/ListingManagement/AddPropertyGuidelines/AddPropertyGuidelinesScreen')
            .default
        }
      />
      <Stack.Screen
        options={{ headerShown: false }}
        name={NavigationRoutes.APP_STACK.SELECT_PROPERTY_POLICIES}
        getComponent={() =>
          require('@/screens/appstack/ListingManagement/SelectPropertyPolicies/SelectPropertyPoliciesScreen')
            .default
        }
      />
      <Stack.Screen
        options={{ headerShown: false }}
        name={NavigationRoutes.APP_STACK.FINISH_UP_STEP_3}
        getComponent={() =>
          require('@/screens/appstack/ListingManagement/FinishUpStep3/FinishUpStep3Screen')
            .default
        }
      />
      <Stack.Screen
        options={{ headerShown: false }}
        name={NavigationRoutes.APP_STACK.ADD_BOOKING_RULES}
        getComponent={() =>
          require('@/screens/appstack/ListingManagement/AddBookingRules/AddBookingRulesScreen')
            .default
        }
      />
      <Stack.Screen
        options={{ headerShown: false }}
        name={NavigationRoutes.APP_STACK.ADD_BOOKING_CANCEL_POLICIES}
        getComponent={() =>
          require('@/screens/appstack/ListingManagement/AddBookingCancelPolicies/AddBookingCancelPoliciesScreen')
            .default
        }
      />
      <Stack.Screen
        options={{ headerShown: false }}
        name={NavigationRoutes.APP_STACK.ADD_DISCOUNTS}
        getComponent={() =>
          require('@/screens/appstack/ListingManagement/AddDiscounts/AddDiscountsScreen')
            .default
        }
      />
      <Stack.Screen
        options={{ headerShown: false }}
        name={NavigationRoutes.APP_STACK.ADD_AI_PRICING}
        getComponent={() =>
          require('@/screens/appstack/ListingManagement/AIPricing/AddAIPricingScreen')
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
        options={{ headerShown: false }}
        name={NavigationRoutes.APP_STACK.PROPERTY_DETAIL}
        getComponent={() =>
          require('@/screens/appstack/PropertyDetail/PropertyDetailScreen')
            .default
        }
      />
      <Stack.Screen
        options={{ header: () => <HeaderApp isGoBack /> }}
        name={NavigationRoutes.APP_STACK.PROPERTY_TOUR}
        getComponent={() =>
          require('@/screens/appstack/PropertyTour/PropertyTourScreen').default
        }
      />
      <Stack.Screen
        options={{ header: () => <HeaderApp isGoBack /> }}
        name={NavigationRoutes.APP_STACK.CONNECTED_OTA}
        getComponent={() =>
          require('@/screens/appstack/ConnectedOTA/ConnectedOTAScreen').default
        }
      />
      <Stack.Screen
        options={{ header: () => <HeaderApp isGoBack /> }}
        name={NavigationRoutes.APP_STACK.BOOKING_COM_STEP_1}
        getComponent={() =>
          require('@/screens/appstack/BookingCom/BookingComStep1/BookingComStep1Screen')
            .default
        }
      />
      <Stack.Screen
        options={{ header: () => <HeaderApp isGoBack /> }}
        name={NavigationRoutes.APP_STACK.BOOKING_COM_STEP_2}
        getComponent={() =>
          require('@/screens/appstack/BookingCom/BookingComStep2/BookingComStep2Screen')
            .default
        }
      />
      <Stack.Screen
        options={{ header: () => <HeaderApp isGoBack /> }}
        name={NavigationRoutes.APP_STACK.BOOKING_COM_STEP_3}
        getComponent={() =>
          require('@/screens/appstack/BookingCom/BookingComStep3/BookingComStep3Screen')
            .default
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
        options={{ header: () => <HeaderApp isGoBack /> }}
        name={NavigationRoutes.APP_STACK.USER_MANAGEMENT}
        getComponent={() =>
          require('@/screens/appstack/UserManagement/screens/UserManagementScreen')
            .default
        }
      />
      <Stack.Screen
        options={{ header: () => <HeaderApp isGoBack /> }}
        name={NavigationRoutes.APP_STACK.USER_MANAGEMENT_FORM}
        getComponent={() =>
          require('@/screens/appstack/UserManagement/screens/UserFormScreen')
            .default
        }
      />

      <Stack.Screen
        options={{ header: () => <HeaderApp isGoBack /> }}
        name={NavigationRoutes.APP_STACK.SAVED_REPLIES}
        getComponent={() =>
          require('@/screens/appstack/SavedReplies/SavedRepliesScreen').default
        }
      />
      <Stack.Screen
        options={{ header: () => <HeaderApp isGoBack /> }}
        name={NavigationRoutes.APP_STACK.SAVED_REPLIES_CREATE_EDIT}
        getComponent={() =>
          require('@/screens/appstack/SavedRepliesCreateEdit/SavedRepliesCreateEditScreen')
            .default
        }
      />
      <Stack.Screen
        options={{ headerShown: false }}
        name={NavigationRoutes.APP_STACK.AUTOMATION_TEMPLATE}
        getComponent={() =>
          require('@/screens/appstack/AutomationTemplate/AutomationTemplateScreen')
            .default
        }
      />
      <Stack.Screen
        options={{ header: () => <HeaderApp isGoBack /> }}
        name={NavigationRoutes.APP_STACK.CREATE_EDIT_AUTOMATION_TEMPLATE}
        getComponent={() =>
          require('@/screens/appstack/AutomationTemplateCreateEdit/AutomationTemplateCreateEditScreen')
            .default
        }
      />
      <Stack.Screen
        options={{ header: () => <HeaderApp isGoBack /> }}
        name={NavigationRoutes.APP_STACK.AI_AUTO_REPLY}
        getComponent={() =>
          require('@/screens/appstack/AIAutoReply/AIAutoReplyScreen').default
        }
      />
      <Stack.Screen
        options={{ header: () => <HeaderApp isGoBack /> }}
        name={NavigationRoutes.APP_STACK.CREATE_EDIT_AI_AUTO_REPLY}
        getComponent={() =>
          require('@/screens/appstack/CreateEditAIRule/CreateEditAIRuleScreen')
            .default
        }
      />
      <Stack.Screen
        options={{ header: () => <HeaderApp isGoBack /> }}
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
        options={{ header: () => <HeaderApp isGoBack /> }}
        name={NavigationRoutes.APP_STACK.SMART_LOCK}
        getComponent={() =>
          require('@/screens/appstack/SmartLock/SmartLockScreen')
            .default
        }
      /> */}
      <Stack.Screen
        options={{ header: () => <HeaderApp isGoBack /> }}
        name={NavigationRoutes.APP_STACK.TT_LOCK_CREDENTIALS}
        getComponent={() =>
          require('@/screens/appstack/TTLockCredentials/TTLockCredentialsScreen')
            .default
        }
      />
      <Stack.Screen
        options={{ header: () => <HeaderApp isGoBack /> }}
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
        options={{ header: () => <HeaderApp isGoBack /> }}
        name={NavigationRoutes.APP_STACK.GENERATE_PASSCODE}
        getComponent={() =>
          require('@/screens/appstack/GeneratePasscode/GeneratePasscodeScreen')
            .default
        }
      />
      <Stack.Screen
        options={{ header: () => <HeaderApp isGoBack /> }}
        name={NavigationRoutes.APP_STACK.REVIEW_MANAGEMENT}
        getComponent={() =>
          require('@/screens/appstack/ReviewManagement/screens/ReviewManagementScreen')
            .default
        }
      />
      <Stack.Screen
        options={{ header: () => <HeaderApp isGoBack /> }}
        name={NavigationRoutes.APP_STACK.REVIEW_MANAGEMENT_GUEST_RATE_SCREEN}
        getComponent={() =>
          require('@/screens/appstack/ReviewManagement/screens/RateYourGuestScreen')
            .default
        }
      />
      <Stack.Screen
        // options={{ header: () => <HeaderApp isGoBack /> }}
        options={{ headerShown: false }}
        name={NavigationRoutes.APP_STACK.REVIEW_MANAGEMENT_DETAIL_SCREEN}
        getComponent={() =>
          require('@/screens/appstack/ReviewManagement/screens/ReviewDetailScreen')
            .default
        }
      />
      <Stack.Screen
        options={{ header: () => <HeaderApp isGoBack /> }}
        name={NavigationRoutes.APP_STACK.REVIEW_MANAGEMENT_VIEW_SCREEN}
        getComponent={() =>
          require('@/screens/appstack/ReviewManagement/screens/ViewReviewScreen')
            .default
        }
      />
      {/* NEW ANALYTIC SCREEN START */}
      <Stack.Screen
        options={{ headerShown: false }}
        name={NavigationRoutes.APP_STACK.STATISTICS_SCREEN}
        getComponent={() =>
          require('@/screens/appstack/Analytics/screens/StatisticsScreen')
            .default
        }
      />
      <Stack.Screen
        options={{ header: () => <HeaderApp isGoBack /> }}
        name={NavigationRoutes.APP_STACK.CHANNEL_PERFORMANCE}
        getComponent={() =>
          require('@/screens/appstack/Analytics/screens/ChannelPerformanceScreen')
            .default
        }
      />
      <Stack.Screen
        options={{ header: () => <HeaderApp isGoBack /> }}
        name={NavigationRoutes.APP_STACK.LISTING_PERFORMANCE}
        getComponent={() =>
          require('@/screens/appstack/Analytics/screens/ListingPerformanceScreen')
            .default
        }
      />
      {/* NEW ANALYTIC SCREEN END */}

      {/* /TASK LIST SCREEN NEW */}

      <Stack.Screen
        options={{ header: () => <HeaderApp isGoBack /> }}
        name={NavigationRoutes.APP_STACK.NO_TASK}
        getComponent={() =>
          require('@/screens/appstack/TaskManagement/screen/NoTaskScreen/NoTaskScreen')
            .default
        }
      />
      <Stack.Screen
        options={{ header: () => <HeaderApp isGoBack /> }}
        name={NavigationRoutes.APP_STACK.RECURRING_INITIAL_SCREEN}
        getComponent={() =>
          require('@/screens/appstack/TaskManagement/screen/RecurringInitialScreen/RecurringInitialScreen')
            .default
        }
      />
      <Stack.Screen
        options={{ header: () => <HeaderApp isGoBack /> }}
        name={NavigationRoutes.APP_STACK.RECURRING_TASK_SCREEN}
        getComponent={() =>
          require('@/screens/appstack/TaskManagement/screen/RecurringTaskScreen/RecurringTaskScreen')
            .default
        }
      />
      {/* <Stack.Screen
        options={{ header: () => <HeaderApp isGoBack /> }}
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
        options={{ header: () => <HeaderApp isGoBack /> }}
        name={NavigationRoutes.APP_STACK.STAFF_NOTES}
        getComponent={() =>
          require('@/screens/appstack/TaskManagement/screen/StaffNotes/StaffNotes')
            .default
        }
      />
      {/* <Stack.Screen
        options={{ header: () => <HeaderApp isGoBack /> }}
        name={NavigationRoutes.APP_STACK.TASK}
        getComponent={() =>
          require('@/screens/appstack/TaskManagement/screen/AllTask/AllTask')
            .default
        }
      /> */}
      <Stack.Screen
        options={{ header: () => <HeaderApp isGoBack /> }}
        name={NavigationRoutes.APP_STACK.EDIT_TASK}
        getComponent={() =>
          require('@/screens/appstack/TaskManagement/screen/EditTask/EditTask')
            .default
        }
      />
      <Stack.Screen
        options={{ header: () => <HeaderApp isGoBack /> }}
        name={NavigationRoutes.APP_STACK.CREATE_TASK_NON_CLEANING}
        getComponent={() =>
          require('@/screens/appstack/TaskManagement/screen/createTaskNonCleaning/createTaskNonCleaning')
            .default
        }
      />
      <Stack.Screen
        options={{ header: () => <HeaderApp isGoBack /> }}
        name={NavigationRoutes.APP_STACK.PRE_ACTIVITY_SCREEN}
        getComponent={() =>
          require('@/screens/appstack/TaskManagement/screen/PreActivity/PreActivity')
            .default
        }
      />

      {/* /TASK LIST SCREEN NEW END */}
      {/* DECLINE INQUIRY BOOKING REQUEST */}
      <Stack.Screen
        options={{ header: () => <HeaderApp isGoBack /> }}
        name={NavigationRoutes.APP_STACK.DECLINE_INQUIRY_STEP1_SCREEN}
        getComponent={() =>
          require('@/screens/appstack/DeclineInquiryForm/StepOne').default
        }
      />
      <Stack.Screen
        options={{ header: () => <HeaderApp isGoBack /> }}
        name={NavigationRoutes.APP_STACK.DECLINE_INQUIRY_STEP2_SCREEN}
        getComponent={() =>
          require('@/screens/appstack/DeclineInquiryForm/StepTwo').default
        }
      />
      <Stack.Screen
        options={{ header: () => <HeaderApp isGoBack /> }}
        name={NavigationRoutes.APP_STACK.DECLINE_INQUIRY_STEP3_SCREEN}
        getComponent={() =>
          require('@/screens/appstack/DeclineInquiryForm/StepThree').default
        }
      />
      {/* DECLINE INQUIRY BOOKING REQUEST END*/}
      <Stack.Screen
        options={{ header: () => <HeaderApp isGoBack /> }}
        name={NavigationRoutes.APP_STACK.CHANGE_RESERVATION_SCREEN}
        getComponent={() =>
          require('@/screens/appstack/ChangeReservation/ChangeReservation')
            .default
        }
      />
      {/* CANCEL RESERVATION  */}
      <Stack.Screen
        options={{ header: () => <HeaderApp isGoBack /> }}
        name={NavigationRoutes.APP_STACK.CANCEL_RESERVATION_STEP1_SCREEN}
        getComponent={() =>
          require('@/screens/appstack/CancelReservation/StepOne').default
        }
      />
      <Stack.Screen
        options={{ header: () => <HeaderApp isGoBack /> }}
        name={NavigationRoutes.APP_STACK.CANCEL_RESERVATION_STEP2_SCREEN}
        getComponent={() =>
          require('@/screens/appstack/CancelReservation/StepTwo').default
        }
      />
      <Stack.Screen
        options={{ header: () => <HeaderApp isGoBack /> }}
        name={NavigationRoutes.APP_STACK.CANCEL_RESERVATION_STEP3_SCREEN}
        getComponent={() =>
          require('@/screens/appstack/CancelReservation/StepThree').default
        }
      />
      <Stack.Screen
        options={{ header: () => <HeaderApp isGoBack /> }}
        name={NavigationRoutes.APP_STACK.CANCEL_RESERVATION_STEP4_SCREEN}
        getComponent={() =>
          require('@/screens/appstack/CancelReservation/StepFour').default
        }
      />
      <Stack.Screen
      options={{ header: () => <HeaderApp isGoBack /> }}
        name={NavigationRoutes.APP_STACK.CONNECT_OTA_PLATFORMS}
        getComponent={() =>
          require('@/screens/appstack/ConnectOTAPlatforms/ConnectOTAPlatformsScreen').default
        }
      />
      {/* CANCEL RESERVATION END */}
      <Stack.Screen
        options={{ headerShown: false }}
        name={NavigationRoutes.APP_STACK.NOTIFIATION}
        getComponent={() =>
          require('@/screens/appstack/Notificaiton/NotificaitonScreen')
            .default
        }
      />
      <Stack.Screen
        options={{ headerShown: false }}
        name={NavigationRoutes.APP_STACK.SUBSCRIPTION_WEBVIEW}
        getComponent={() =>
          require('@/screens/common/Payment/SubscriptionWebViewScreen').default
        }
      />
      <Stack.Screen
        options={{ headerShown: false }}
        name={NavigationRoutes.APP_STACK.CHECKOUT_INSTRUCTION}
        getComponent={() =>
          require('@/screens/appstack/ListingManagement/CheckoutInstruction/CheckoutInstructionScreen').default
        }
      />
    </Stack.Navigator>
  );
};

export default AppStack;
