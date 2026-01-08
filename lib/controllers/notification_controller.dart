import 'package:get/get.dart';
import 'package:flutter/material.dart';

class NotificationModel {
  final String id;
  final String title;
  final String description;
  final String date;
  final IconData icon;
  final Color iconBgColor;
  bool isRead;

  NotificationModel({
    required this.id,
    required this.title,
    required this.description,
    required this.date,
    required this.icon,
    required this.iconBgColor,
    this.isRead = false,
  });
}

class NotificationController extends GetxController {
  final notifications = <NotificationModel>[
    NotificationModel(
      id: '1',
      title: 'Security Updated',
      description:
          'we have updated our security algorithms and your information is now even more secure',
      date: 'Today',
      icon: Icons.security,
      iconBgColor: Colors.blue,
      isRead: false,
    ),
    NotificationModel(
      id: '2',
      title: 'Multiple card features',
      description: 'The multi-card feature is now available to you!',
      date: '18 February, 2025',
      icon: Icons.style,
      iconBgColor: Colors.green,
      isRead: true,
    ),
    NotificationModel(
      id: '3',
      title: 'Account setup completed successfully',
      description: 'The multi-card feature is now available to you!',
      date: '18 February, 2025',
      icon: Icons.person,
      iconBgColor: Colors.blue,
      isRead: true,
    ),
    NotificationModel(
      id: '4',
      title: 'Welcome to CoolPay App!',
      description:
          'Welcome to the application! Follow the instructions and make instant payments!',
      date: '11 January, 2025',
      icon: Icons.favorite,
      iconBgColor: Colors.pink,
      isRead: true,
    ),
  ].obs;

  void deleteNotification(String id) {
    notifications.removeWhere((item) => item.id == id);
  }

  void clearAll() {
    notifications.clear();
  }

  void markAsRead(String id) {
    final index = notifications.indexWhere((item) => item.id == id);
    if (index != -1) {
      notifications[index].isRead = true;
      notifications.refresh();
    }
  }
}
