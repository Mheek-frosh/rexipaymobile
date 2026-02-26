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
import TransferScreen from '../screens/TransferScreen';
import TransactionsScreen from '../screens/TransactionsScreen';
import NotificationsScreen from '../screens/NotificationsScreen';
import SettingsScreen from '../screens/SettingsScreen';
import SupportScreen from '../screens/SupportScreen';
import DataPrivacyScreen from '../screens/DataPrivacyScreen';
import AccountDetailsScreen from '../screens/AccountDetailsScreen';
import PaymentSuccessScreen from '../screens/PaymentSuccessScreen';
import AirtimeScreen from '../screens/AirtimeScreen';
import ChangeLimitScreen from '../screens/ChangeLimitScreen';
import BankReceiveScreen from '../screens/BankReceiveScreen';
import BankConvertScreen from '../screens/BankConvertScreen';
import CryptoReceiveScreen from '../screens/CryptoReceiveScreen';
import CryptoSellScreen from '../screens/CryptoSellScreen';
import AddMoneyScreen from '../screens/AddMoneyScreen';
import SendCryptoScreen from '../screens/SendCryptoScreen';
import SendCryptoAssetScreen from '../screens/SendCryptoAssetScreen';
import TransactionDetailScreen from '../screens/TransactionDetailScreen';
import DebitCardTransactionDetailScreen from '../screens/DebitCardTransactionDetailScreen';
import ForgotPinPhoneScreen from '../screens/ForgotPinPhoneScreen';
import ForgotPinOtpScreen from '../screens/ForgotPinOtpScreen';
import ForgotPinSetPinScreen from '../screens/ForgotPinSetPinScreen';

const Stack = createNativeStackNavigator();

export default function RootNavigator() {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return (
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="MainTabs" component={MainTabs} />
        <Stack.Screen name="Transfer" component={TransferScreen} />
        <Stack.Screen name="Transactions" component={TransactionsScreen} />
        <Stack.Screen name="Notifications" component={NotificationsScreen} />
        <Stack.Screen name="Settings" component={SettingsScreen} />
        <Stack.Screen name="Support" component={SupportScreen} />
        <Stack.Screen name="DataPrivacy" component={DataPrivacyScreen} />
        <Stack.Screen name="AccountDetails" component={AccountDetailsScreen} />
        <Stack.Screen name="Airtime" component={AirtimeScreen} />
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
        <Stack.Screen name="DebitCardTransactionDetail" component={DebitCardTransactionDetailScreen} />
        <Stack.Screen name="ForgotPinPhone" component={ForgotPinPhoneScreen} />
        <Stack.Screen name="ForgotPinOtp" component={ForgotPinOtpScreen} />
        <Stack.Screen name="ForgotPinSetPin" component={ForgotPinSetPinScreen} />
      </Stack.Navigator>
    );
  }

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
      <Stack.Screen name="ForgotPasswordPhone" component={ForgotPasswordPhoneScreen} />
      <Stack.Screen name="ForgotPasswordOtp" component={ForgotPasswordOtpScreen} />
      <Stack.Screen name="ForgotPasswordSetPassword" component={ForgotPasswordSetPasswordScreen} />
    </Stack.Navigator>
  );
}
