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
  static const CARDS_LIST = _Paths.CARDS_LIST;
  static const ADD_CARD_INTRO = _Paths.ADD_CARD_INTRO;
  static const DATA = _Paths.DATA;
  static const WELCOME_BACK = _Paths.WELCOME_BACK;
  static const PERSONAL_INFO = _Paths.PERSONAL_INFO;
  static const SELECT_COUNTRY = _Paths.SELECT_COUNTRY;
  static const ACCOUNT_SUCCESS = _Paths.ACCOUNT_SUCCESS;
  static const ACCOUNT_DETAILS = _Paths.ACCOUNT_DETAILS;
  static const SUPPORT = _Paths.SUPPORT;
  static const SETTINGS = _Paths.SETTINGS;
  static const DATA_PRIVACY = _Paths.DATA_PRIVACY;
  static const FORGOT_PASSWORD = _Paths.FORGOT_PASSWORD;
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
  static const CARDS_LIST = '/cards-list';
  static const ADD_CARD_INTRO = '/add-card-intro';
  static const DATA = '/data';
  static const WELCOME_BACK = '/welcome-back';
  static const PERSONAL_INFO = '/personal-info';
  static const SELECT_COUNTRY = '/select-country';
  static const ACCOUNT_SUCCESS = '/account-success';
  static const ACCOUNT_DETAILS = '/account-details';
  static const SUPPORT = '/support';
  static const SETTINGS = '/settings';
  static const DATA_PRIVACY = '/data-privacy';
  static const FORGOT_PASSWORD = '/forgot-password';
}
