import 'package:get/get.dart';
import '../controllers/airtime_controller.dart';

class AirtimeBinding extends Bindings {
  @override
  void dependencies() {
    Get.lazyPut<AirtimeController>(() => AirtimeController());
  }
}
