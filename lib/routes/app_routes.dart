abstract class Routes {
  Routes._();
  static const INITIAL = _Paths.HOME;
  static const HOME = _Paths.HOME;
  static const PROFILE = _Paths.PROFILE;
  static const TRANSACTIONS = _Paths.TRANSACTIONS;
  static const NOTIFICATIONS = _Paths.NOTIFICATIONS;
  static const TRANSFER = _Paths.TRANSFER;
  static const PAYMENT_SUCCESS = _Paths.PAYMENT_SUCCESS;
}

abstract class _Paths {
  _Paths._();
  static const HOME = '/';
  static const PROFILE = '/profile';
  static const TRANSACTIONS = '/transactions';
  static const NOTIFICATIONS = '/notifications';
  static const TRANSFER = '/transfer';
  static const PAYMENT_SUCCESS = '/payment-success';
}
