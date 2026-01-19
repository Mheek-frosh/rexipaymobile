import 'package:get/get.dart';

import '../bindings/main_binding.dart';
import '../screens/main_wrapper.dart';
import '../screens/transactions_screen.dart';
import '../screens/notification_screen.dart';
import '../screens/transfer_screen.dart';
import '../screens/payment_success_screen.dart';
import '../screens/auth/signup_screen.dart';
import '../screens/auth/login_screen.dart';
import '../screens/auth/otp_verification_screen.dart';
import '../screens/auth/welcome_back_screen.dart';
import '../screens/auth/personal_info_screen.dart';
import '../screens/auth/select_country_screen.dart';
import '../screens/auth/account_success_screen.dart';
import '../screens/airtime_screen.dart';
import '../screens/choose_crypto_screen.dart';
import '../screens/transfer_crypto_screen.dart';
import '../screens/change_limit_screen.dart';
import '../bindings/airtime_binding.dart';
import '../bindings/crypto_binding.dart';
import '../bindings/change_limit_binding.dart';
import '../bindings/card_binding.dart';
import '../screens/wallet/card_list_screen.dart';
import '../screens/wallet/add_card_intro_screen.dart';
import '../screens/profile/account_details_screen.dart';
import '../utils/three_d_transition.dart';
import 'app_routes.dart';

// ignore: avoid_classes_with_only_static_members
class AppPages {
  static const INITIAL = Routes.INITIAL;

  static final routes = [
    GetPage(
      name: Routes.HOME,
      page: () => const MainWrapper(),
      binding: MainBinding(),
    ),
    GetPage(
      name: Routes.TRANSACTIONS,
      page: () => const TransactionsScreen(),
      binding: MainBinding(),
    ),
    GetPage(
      name: Routes.NOTIFICATIONS,
      page: () => const NotificationScreen(),
      binding: MainBinding(),
    ),
    GetPage(
      name: Routes.TRANSFER,
      page: () => const TransferScreen(),
      binding: MainBinding(),
    ),
    GetPage(
      name: Routes.PAYMENT_SUCCESS,
      page: () => const PaymentSuccessScreen(),
      binding: MainBinding(),
    ),
    GetPage(
      name: Routes.SIGNUP,
      page: () => const SignupScreen(),
      binding: MainBinding(),
    ),
    GetPage(
      name: Routes.LOGIN,
      page: () => const LoginScreen(),
      binding: MainBinding(),
    ),
    GetPage(
      name: Routes.OTP_VERIFICATION,
      page: () => const OtpVerificationScreen(),
      binding: MainBinding(),
    ),
    GetPage(
      name: Routes.AIRTIME,
      page: () => const AirtimeScreen(),
      binding: AirtimeBinding(),
    ),
    GetPage(
      name: Routes.CHOOSE_CRYPTO,
      page: () => const ChooseCryptoScreen(),
      binding: CryptoBinding(),
    ),
    GetPage(
      name: Routes.TRANSFER_CRYPTO,
      page: () => const TransferCryptoScreen(),
      binding: CryptoBinding(),
    ),
    GetPage(
      name: Routes.CHANGE_LIMIT,
      page: () => const ChangeLimitScreen(),
      binding: ChangeLimitBinding(),
    ),
    GetPage(
      name: Routes.CARDS_LIST,
      page: () => const CardListScreen(),
      binding: CardBinding(),
    ),
    GetPage(
      name: Routes.ADD_CARD_INTRO,
      page: () => const AddCardIntroScreen(),
      binding: CardBinding(),
    ),
    GetPage(
      name: Routes.WELCOME_BACK,
      page: () => const WelcomeBackScreen(),
      binding: MainBinding(),
    ),
    GetPage(
      name: Routes.PERSONAL_INFO,
      page: () => const PersonalInfoScreen(),
      binding: MainBinding(),
    ),
    GetPage(
      name: Routes.SELECT_COUNTRY,
      page: () => const SelectCountryScreen(),
      binding: MainBinding(),
    ),
    GetPage(
      name: Routes.ACCOUNT_SUCCESS,
      page: () => const AccountSuccessScreen(),
      binding: MainBinding(),
    ),
    GetPage(
      name: Routes.ACCOUNT_DETAILS,
      page: () => const AccountDetailsScreen(),
      binding: MainBinding(),
      customTransition: ThreeDTransition(),
      transitionDuration: const Duration(milliseconds: 600),
      opaque: false,
    ),
  ];
}
