import 'package:get/get.dart';

class MainController extends GetxController {
  final _currentIndex = 0.obs;
  int get currentIndex => _currentIndex.value;

  // 0: Bank View, 1: Crypto View
  final _homeView = 0.obs;
  int get homeView => _homeView.value;

  void changePage(int index) {
    _currentIndex.value = index;
  }

  void switchHomeView(int index) {
    _homeView.value = index;
  }
}
