import 'package:get/get.dart';

class CardController extends GetxController {
  final _selectedTab = 0.obs;
  final _showCardDetails = false.obs;

  int get selectedTab => _selectedTab.value;
  bool get showCardDetails => _showCardDetails.value;

  void changeTab(int index) {
    _selectedTab.value = index;
  }

  void toggleCardDetails() {
    _showCardDetails.value = !_showCardDetails.value;
  }
}
