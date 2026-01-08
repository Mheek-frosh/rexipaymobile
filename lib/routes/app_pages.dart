import 'package:get/get.dart';

import '../bindings/main_binding.dart';
import '../screens/main_wrapper.dart';
import '../screens/transactions_screen.dart';
import '../screens/notification_screen.dart';
import '../screens/transfer_screen.dart';
import '../screens/payment_success_screen.dart';
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
  ];
}
