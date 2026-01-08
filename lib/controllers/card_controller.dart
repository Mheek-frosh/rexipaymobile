import 'package:get/get.dart';

class CardController extends GetxController {
  final _selectedTab = 0.obs;
  int get selectedTab => _selectedTab.value;

  void changeTab(int index) {
    _selectedTab.value = index;
  }
}
