import 'package:get/get.dart';
import '../controllers/main_controller.dart';
import '../controllers/card_controller.dart';

class MainBinding extends Bindings {
  @override
  void dependencies() {
    Get.lazyPut<MainController>(() => MainController());
    Get.lazyPut<CardController>(() => CardController());
  }
}
