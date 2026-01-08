import 'package:get/get.dart';
import 'package:rexipaymobile/screens/home_screen.dart';

import '../bindings/main_binding.dart';
import '../screens/main_wrapper.dart';
import '../screens/transactions_screen.dart';
import '../screens/notification_screen.dart';
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
    GetPage(name: Routes.TRANSACTIONS, page: () => const TransactionsScreen()),
    GetPage(name: Routes.NOTIFICATIONS, page: () => const NotificationScreen()),
    GetPage(name: Routes.HOME, page: () => const HomeScreen()),
  ];
}
