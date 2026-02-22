import 'dart:convert';
import 'package:http/http.dart' as http;
import '../config/api_config.dart';

class BankService {
  static String get _baseUrl => kAuthApiBaseUrl;

  /// Resolve account holder name from account number and bank code
  static Future<ResolveAccountResult> resolveAccount({
    required String accountNumber,
    required String bankCode,
  }) async {
    try {
      final res = await http.post(
        Uri.parse('$_baseUrl/api/bank/resolve-account'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({
          'account_number': accountNumber.replaceAll(RegExp(r'\D'), ''),
          'account_bank': bankCode,
        }),
      );
      final data = jsonDecode(res.body) as Map<String, dynamic>;
      if (res.statusCode == 200 && data['success'] == true) {
        return ResolveAccountResult(
          success: true,
          accountName: data['account_name'] as String? ?? '',
        );
      }
      return ResolveAccountResult(
        success: false,
        error: data['error'] ?? 'Could not resolve account',
      );
    } catch (e) {
      return ResolveAccountResult(success: false, error: e.toString());
    }
  }
}

class ResolveAccountResult {
  final bool success;
  final String? accountName;
  final String? error;
  ResolveAccountResult({required this.success, this.accountName, this.error});
}
