import 'package:get/get.dart';

import '../bindings/main_binding.dart';
import '../screens/main_wrapper.dart';
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
  ];
}
