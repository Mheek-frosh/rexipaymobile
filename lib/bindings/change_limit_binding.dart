import 'package:get/get.dart';
import '../controllers/change_limit_controller.dart';

class ChangeLimitBinding extends Bindings {
  @override
  void dependencies() {
    Get.lazyPut<ChangeLimitController>(() => ChangeLimitController());
  }
}
