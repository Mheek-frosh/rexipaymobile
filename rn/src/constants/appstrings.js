// src/constants/appstrings.js

export const appStrings = {
    // Common strings shared across multiple screens
    common: {
        back: 'Back',
        cancel: 'Cancel',
        ok: 'OK',
        save: 'Save',
        continue: 'Continue',
        error: 'Error',
        success: 'Success',
    },

    // Forgot Pin OTP Screen
    forgotPinOtp: {
        title: 'Enter verification code',
        subtitlePrefix: 'We sent a 6-digit code to',
        placeholder: '000000',
        resendIn: 'Resend code in',
        resendSuffix: 's',
        resendPrompt: "Didn't get a code? Resend",
        continueBtn: 'Continue',
        sentAlertTitle: 'Sent',
        sentAlertMessage: 'A new code has been sent to your number.',
        errorAlertTitle: 'Error',
    },

    // Forgot Pin Phone Screen
    forgotPinPhone: {
        title: 'Forgot Transaction PIN?',
        subtitle: "Enter your registered phone number. We'll send you a one-time code to reset your PIN.",
        phoneLabel: 'Phone number',
        phonePlaceholder: '801 234 5678',
        invalidNumberTitle: 'Invalid number',
        invalidNumberMessage: 'Please enter a valid phone number.',
        errorAlertTitle: 'Error',
        errorDefaultMessage: 'Could not send OTP.',
        errorFallbackMessage: 'Something went wrong.',
        sendOtpBtn: 'Send OTP',
        sendingBtn: 'Sending...',
    },
};

export default appStrings;
