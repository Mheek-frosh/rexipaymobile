abstract class Routes {
  Routes._();
  static const INITIAL = _Paths.HOME;
  static const HOME = _Paths.HOME;
  static const PROFILE = _Paths.PROFILE;
  static const TRANSACTIONS = _Paths.TRANSACTIONS;
  static const NOTIFICATIONS = _Paths.NOTIFICATIONS;
  static const TRANSFER = _Paths.TRANSFER;
  static const PAYMENT_SUCCESS = _Paths.PAYMENT_SUCCESS;
  static const SIGNUP = _Paths.SIGNUP;
  static const LOGIN = _Paths.LOGIN;
  static const OTP_VERIFICATION = _Paths.OTP_VERIFICATION;
  static const AIRTIME = _Paths.AIRTIME;
  static const CHOOSE_CRYPTO = _Paths.CHOOSE_CRYPTO;
  static const TRANSFER_CRYPTO = _Paths.TRANSFER_CRYPTO;
  static const CHANGE_LIMIT = _Paths.CHANGE_LIMIT;
}

abstract class _Paths {
  _Paths._();
  static const HOME = '/';
  static const PROFILE = '/profile';
  static const TRANSACTIONS = '/transactions';
  static const NOTIFICATIONS = '/notifications';
  static const TRANSFER = '/transfer';
  static const PAYMENT_SUCCESS = '/payment-success';
  static const SIGNUP = '/signup';
  static const LOGIN = '/login';
  static const OTP_VERIFICATION = '/otp-verification';
  static const AIRTIME = '/airtime';
  static const CHOOSE_CRYPTO = '/choose-crypto';
  static const TRANSFER_CRYPTO = '/transfer-crypto';
  static const CHANGE_LIMIT = '/change-limit';
}
