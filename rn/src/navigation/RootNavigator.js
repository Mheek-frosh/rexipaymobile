import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuth } from '../context/AuthContext';
import OnboardingScreen from '../screens/OnboardingScreen';
import SignupScreen from '../screens/auth/SignupScreen';
import LoginScreen from '../screens/auth/LoginScreen';
import OtpVerificationScreen from '../screens/auth/OtpVerificationScreen';
import PersonalInfoScreen from '../screens/auth/PersonalInfoScreen';
import NINAndFaceScreen from '../screens/auth/NINAndFaceScreen';
import AccountSuccessScreen from '../screens/auth/AccountSuccessScreen';
import ForgotPasswordPhoneScreen from '../screens/auth/ForgotPasswordPhoneScreen';
import ForgotPasswordOtpScreen from '../screens/auth/ForgotPasswordOtpScreen';
import ForgotPasswordSetPasswordScreen from '../screens/auth/ForgotPasswordSetPasswordScreen';
import MainTabs from './MainTabs';
import TransferScreen from '../screens/transferscreen/TransferScreen';
import TransactionsScreen from '../screens/transferscreen/TransactionsScreen';
import NotificationsScreen from '../screens/home/NotificationsScreen';
import NotificationDetailScreen from '../screens/home/NotificationDetailScreen';
import NotificationSettingsScreen from '../screens/home/NotificationSettingsScreen';
import SettingsScreen from '../screens/SettingsScreen';
import SupportScreen from '../screens/SupportScreen';
import DataPrivacyScreen from '../screens/DataPrivacyScreen';
import AccountDetailsScreen from '../screens/profile/AccountDetailsScreen';
import BankStatementRequestScreen from '../screens/profile/BankStatementRequestScreen';
import BankStatementSuccessScreen from '../screens/profile/BankStatementSuccessScreen';
import DeleteAccountScreen from '../screens/profile/DeleteAccountScreen';
import PaymentSuccessScreen from '../screens/transferscreen/PaymentSuccessScreen';
import AirtimeScreen from '../screens/utilities/AirtimeScreen';
import ChangeLimitScreen from '../screens/transferscreen/ChangeLimitScreen';
import BankReceiveScreen from '../screens/transferscreen/BankReceiveScreen';
import BankConvertScreen from '../screens/transferscreen/BankConvertScreen';
import CryptoReceiveScreen from '../screens/crypto/CryptoReceiveScreen';
import CryptoSellScreen from '../screens/crypto/CryptoSellScreen';
import AddMoneyScreen from '../screens/home/AddMoneyScreen';
import SendCryptoScreen from '../screens/crypto/SendCryptoScreen';
import SendCryptoAssetScreen from '../screens/crypto/SendCryptoAssetScreen';
import TransactionDetailScreen from '../screens/transferscreen/TransactionDetailScreen';
import DebitCardTransactionDetailScreen from '../screens/transferscreen/DebitCardTransactionDetailScreen';
import AddCardScreen from '../screens/AddCardScreen';
import ForgotPinPhoneScreen from '../screens/ForgotPinPhoneScreen';
import ForgotPinOtpScreen from '../screens/ForgotPinOtpScreen';
import ForgotPinSetPinScreen from '../screens/ForgotPinSetPinScreen';
import OfflinePayScreen from '../screens/utilities/OfflinePayScreen';
import ChangePinScreen from '../screens/ChangePinScreen';
import BiometricsScreen from '../screens/BiometricsScreen';
import AllServicesScreen from '../screens/utilities/AllServicesScreen';
import SavingsHomeScreen from '../screens/home/SavingsHomeScreen';
import SavingsSetupScreen from '../screens/home/SavingsSetupScreen';
import SavingsGoalDetailScreen from '../screens/home/SavingsGoalDetailScreen';
import ReferralEarnScreen from '../screens/home/ReferralEarnScreen';
import RewardsHubScreen from '../screens/home/RewardsHubScreen';
import InternetDataScreen from '../screens/utilities/InternetDataScreen';
import ElectricityBillScreen from '../screens/utilities/ElectricityBillScreen';
import ShoppingHubScreen from '../screens/utilities/ShoppingHubScreen';
import DealsHubScreen from '../screens/utilities/DealsHubScreen';
import HealthHubScreen from '../screens/utilities/HealthHubScreen';
import CryptoMarketScreen from '../screens/crypto/CryptoMarketScreen';
import CryptoAssetDetailScreen from '../screens/crypto/CryptoAssetDetailScreen';

const Stack = createNativeStackNavigator();

export default function RootNavigator() {
  // `isAuthenticated` controls whether to show the main app (logged in) or the auth flows (logged out)
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    // === AUTHENTICATED FLOW ===
    // This navigation stack is only accessible after a successful login or signup.
    // It provides access to the user's dashboard, settings, and transaction screens.
    return (
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="MainTabs" component={MainTabs} />
        <Stack.Screen name="Transfer" component={TransferScreen} />
        <Stack.Screen name="Transactions" component={TransactionsScreen} />
        <Stack.Screen name="Notifications" component={NotificationsScreen} />
        <Stack.Screen name="NotificationDetail" component={NotificationDetailScreen} />
        <Stack.Screen name="NotificationSettings" component={NotificationSettingsScreen} />
        <Stack.Screen name="Settings" component={SettingsScreen} />
        <Stack.Screen name="Support" component={SupportScreen} />
        <Stack.Screen name="DataPrivacy" component={DataPrivacyScreen} />
        <Stack.Screen name="AccountDetails" component={AccountDetailsScreen} />
        <Stack.Screen name="BankStatementRequest" component={BankStatementRequestScreen} />
        <Stack.Screen name="BankStatementSuccess" component={BankStatementSuccessScreen} />
        <Stack.Screen name="DeleteAccount" component={DeleteAccountScreen} />
        <Stack.Screen name="Airtime" component={AirtimeScreen} />
        <Stack.Screen name="AllServices" component={AllServicesScreen} />
        <Stack.Screen name="SavingsHome" component={SavingsHomeScreen} />
        <Stack.Screen name="SavingsSetup" component={SavingsSetupScreen} />
        <Stack.Screen name="SavingsGoalDetail" component={SavingsGoalDetailScreen} />
        <Stack.Screen name="ReferralEarn" component={ReferralEarnScreen} />
        <Stack.Screen name="RewardsHub" component={RewardsHubScreen} />
        <Stack.Screen name="InternetData" component={InternetDataScreen} />
        <Stack.Screen name="ElectricityBill" component={ElectricityBillScreen} />
        <Stack.Screen name="ShoppingHub" component={ShoppingHubScreen} />
        <Stack.Screen name="DealsHub" component={DealsHubScreen} />
        <Stack.Screen name="HealthHub" component={HealthHubScreen} />
        <Stack.Screen name="CryptoMarket" component={CryptoMarketScreen} />
        <Stack.Screen name="CryptoAssetDetail" component={CryptoAssetDetailScreen} />
        <Stack.Screen name="ChangeLimit" component={ChangeLimitScreen} />
        <Stack.Screen name="PaymentSuccess" component={PaymentSuccessScreen} />
        <Stack.Screen name="BankReceive" component={BankReceiveScreen} />
        <Stack.Screen name="BankConvert" component={BankConvertScreen} />
        <Stack.Screen name="CryptoReceive" component={CryptoReceiveScreen} />
        <Stack.Screen name="CryptoSell" component={CryptoSellScreen} />
        <Stack.Screen name="AddMoney" component={AddMoneyScreen} />
        <Stack.Screen name="SendCrypto" component={SendCryptoScreen} />
        <Stack.Screen name="SendCryptoAsset" component={SendCryptoAssetScreen} />
        <Stack.Screen name="TransactionDetail" component={TransactionDetailScreen} />
        {/* --- Recent Additions --- */}
        {/* Allows quick USSD or offline payments */}
        <Stack.Screen name="OfflinePay" component={OfflinePayScreen} />
        <Stack.Screen name="ChangePin" component={ChangePinScreen} />
        <Stack.Screen name="Biometrics" component={BiometricsScreen} />

        <Stack.Screen name="AddCard" component={AddCardScreen} />

        <Stack.Screen name="DebitCardTransactionDetail" component={DebitCardTransactionDetailScreen} />

        {/* --- Forgot Transaction PIN Flow --- */}
        {/* Allows logged-in users to securely reset their 4-digit transaction PIN */}
        {/* 1. Enter phone -> 2. Verify OTP -> 3. Set new PIN */}
        <Stack.Screen name="ForgotPinPhone" component={ForgotPinPhoneScreen} />
        <Stack.Screen name="ForgotPinOtp" component={ForgotPinOtpScreen} />
        <Stack.Screen name="ForgotPinSetPin" component={ForgotPinSetPinScreen} />
      </Stack.Navigator>
    );
  }

  // === UNAUTHENTICATED FLOW ===
  // This navigation stack manages onboarding, login, signup, and account recovery
  // before the user is authenticated.
  return (
    <Stack.Navigator
      initialRoute="Onboarding"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="Onboarding" component={OnboardingScreen} />
      <Stack.Screen
        name="Signup"
        component={SignupScreen}
        options={{ animation: 'fade', animationDuration: 300 }}
      />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="OtpVerification" component={OtpVerificationScreen} />
      <Stack.Screen
        name="PersonalInfo"
        component={PersonalInfoScreen}
        options={{ animation: 'fade', animationDuration: 300 }}
      />
      <Stack.Screen
        name="NINAndFace"
        component={NINAndFaceScreen}
        options={{ animation: 'fade', animationDuration: 300 }}
      />
      <Stack.Screen
        name="AccountSuccess"
        component={AccountSuccessScreen}
        options={{ animation: 'fade', animationDuration: 300 }}
      />

      {/* --- Forgot Password Flow --- */}
      {/* Allows unauthenticated users to recover their account access by resetting their password */}
      {/* 1. Enter registered phone number -> 2. Verify OTP -> 3. Set new password */}
      <Stack.Screen name="ForgotPasswordPhone" component={ForgotPasswordPhoneScreen} />
      <Stack.Screen name="ForgotPasswordOtp" component={ForgotPasswordOtpScreen} />
      <Stack.Screen name="ForgotPasswordSetPassword" component={ForgotPasswordSetPasswordScreen} />
    </Stack.Navigator>
  );
}
