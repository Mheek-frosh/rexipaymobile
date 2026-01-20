import 'package:cloud_firestore/cloud_firestore.dart';

class UserModel {
  final String? id;
  final String email;
  final String firstName;
  final String lastName;
  final String phoneNumber;
  final String? profileImageUrl;
  final String countryCode;
  final DateTime? createdAt;

  UserModel({
    this.id,
    required this.email,
    required this.firstName,
    required this.lastName,
    required this.phoneNumber,
    this.profileImageUrl,
    required this.countryCode,
    this.createdAt,
  });

  // Create UserModel from Firestore DocumentSnapshot
  factory UserModel.fromSnapshot(
    DocumentSnapshot<Map<String, dynamic>> document,
  ) {
    final data = document.data()!;
    return UserModel(
      id: document.id,
      email: data['email'] ?? '',
      firstName: data['firstName'] ?? '',
      lastName: data['lastName'] ?? '',
      phoneNumber: data['phoneNumber'] ?? '',
      profileImageUrl: data['profileImageUrl'],
      countryCode: data['countryCode'] ?? '',
      createdAt: (data['createdAt'] as Timestamp?)?.toDate(),
    );
  }

  // Convert UserModel to Map for Firestore
  Map<String, dynamic> toJson() {
    return {
      'email': email,
      'firstName': firstName,
      'lastName': lastName,
      'phoneNumber': phoneNumber,
      'profileImageUrl': profileImageUrl,
      'countryCode': countryCode,
      'createdAt': createdAt ?? FieldValue.serverTimestamp(),
    };
  }

  // CopyWith method for immutability
  UserModel copyWith({
    String? id,
    String? email,
    String? firstName,
    String? lastName,
    String? phoneNumber,
    String? profileImageUrl,
    String? countryCode,
    DateTime? createdAt,
  }) {
    return UserModel(
      id: id ?? this.id,
      email: email ?? this.email,
      firstName: firstName ?? this.firstName,
      lastName: lastName ?? this.lastName,
      phoneNumber: phoneNumber ?? this.phoneNumber,
      profileImageUrl: profileImageUrl ?? this.profileImageUrl,
      countryCode: countryCode ?? this.countryCode,
      createdAt: createdAt ?? this.createdAt,
    );
  }
}
