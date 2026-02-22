import 'dart:convert';
import 'package:http/http.dart' as http;
import '../config/api_config.dart';

class AuthService {
  static String get _baseUrl => kAuthApiBaseUrl;

  /// Send OTP to phone number
  static Future<SendOtpResult> sendOtp({
    required String phone,
    String countryCode = '+234',
  }) async {
    try {
      final res = await http.post(
        Uri.parse('$_baseUrl/api/auth/send-otp'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({'phone': phone, 'countryCode': countryCode}),
      );
      final data = jsonDecode(res.body) as Map<String, dynamic>;
      if (res.statusCode == 200 && data['success'] == true) {
        return SendOtpResult(success: true);
      }
      return SendOtpResult(
        success: false,
        error: data['error'] ?? 'Failed to send OTP',
      );
    } catch (e) {
      return SendOtpResult(success: false, error: e.toString());
    }
  }

  /// Verify OTP code
  static Future<VerifyOtpResult> verifyOtp({
    required String phone,
    required String code,
    String countryCode = '+234',
    String? name,
  }) async {
    try {
      final res = await http.post(
        Uri.parse('$_baseUrl/api/auth/verify-otp'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({
          'phone': phone,
          'code': code,
          'countryCode': countryCode,
          'name': name,
        }),
      );
      final data = jsonDecode(res.body) as Map<String, dynamic>;
      if (res.statusCode == 200 && data['success'] == true) {
        final user = data['user'] as Map<String, dynamic>;
        return VerifyOtpResult(
          success: true,
          user: AuthUser(
            phone: user['phone'] as String,
            name: user['name'] as String,
            firstName: user['firstName'] as String,
            lastName: user['lastName'] as String,
          ),
        );
      }
      return VerifyOtpResult(
        success: false,
        error: data['error'] ?? 'Verification failed',
      );
    } catch (e) {
      return VerifyOtpResult(success: false, error: e.toString());
    }
  }

  /// Get resend cooldown status
  static Future<ResendStatus> getResendStatus({
    required String phone,
    String countryCode = '+234',
  }) async {
    try {
      final res = await http.post(
        Uri.parse('$_baseUrl/api/auth/resend-status'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({'phone': phone, 'countryCode': countryCode}),
      );
      final data = jsonDecode(res.body) as Map<String, dynamic>;
      return ResendStatus(
        canResend: data['canResend'] ?? true,
        secondsRemaining: data['secondsRemaining'] ?? 0,
      );
    } catch (_) {
      return const ResendStatus(canResend: true, secondsRemaining: 0);
    }
  }
}

class SendOtpResult {
  final bool success;
  final String? error;
  SendOtpResult({required this.success, this.error});
}

class VerifyOtpResult {
  final bool success;
  final String? error;
  final AuthUser? user;
  VerifyOtpResult({required this.success, this.error, this.user});
}

class AuthUser {
  final String phone;
  final String name;
  final String firstName;
  final String lastName;
  AuthUser({
    required this.phone,
    required this.name,
    required this.firstName,
    required this.lastName,
  });
}

class ResendStatus {
  final bool canResend;
  final int secondsRemaining;
  const ResendStatus({required this.canResend, required this.secondsRemaining});
}
