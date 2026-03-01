const fs = require('fs');
const glob = require('glob');
const path = require('path');

const srcDir = path.join(__dirname, 'src');

const screensMap = {
    'SplashScreen': 'onboarding/SplashScreen',
    'OnboardingScreen': 'onboarding/OnboardingScreen',
    'HomeScreen': 'home/HomeScreen',
    'NotificationsScreen': 'home/NotificationsScreen',
    'StatsScreen': 'home/StatsScreen',
    'ProfileScreen': 'profile/ProfileScreen',
    'SettingsScreen': 'profile/SettingsScreen',
    'DataPrivacyScreen': 'profile/DataPrivacyScreen',
    'ChangeLimitScreen': 'profile/ChangeLimitScreen',
    'SupportScreen': 'profile/SupportScreen',
    'AccountDetailsScreen': 'profile/AccountDetailsScreen',
    'TransactionsScreen': 'transactions/TransactionsScreen',
    'TransactionDetailScreen': 'transactions/TransactionDetailScreen',
    'CardsScreen': 'cards/CardsScreen',
    'DebitCardTransactionDetailScreen': 'cards/DebitCardTransactionDetailScreen',
    'TransferScreen': 'transfers/TransferScreen',
    'AddMoneyScreen': 'transfers/AddMoneyScreen',
    'BankReceiveScreen': 'transfers/BankReceiveScreen',
    'OfflinePayScreen': 'transfers/OfflinePayScreen',
    'PaymentSuccessScreen': 'transfers/PaymentSuccessScreen',
    'AirtimeScreen': 'transfers/AirtimeScreen',
    'BankConvertScreen': 'crypto/BankConvertScreen',
    'CryptoReceiveScreen': 'crypto/CryptoReceiveScreen',
    'CryptoSellScreen': 'crypto/CryptoSellScreen',
    'SendCryptoAssetScreen': 'crypto/SendCryptoAssetScreen',
    'SendCryptoScreen': 'crypto/SendCryptoScreen',
    'ForgotPinOtpScreen': 'security/ForgotPinOtpScreen',
    'ForgotPinPhoneScreen': 'security/ForgotPinPhoneScreen',
    'ForgotPinSetPinScreen': 'security/ForgotPinSetPinScreen',
};

// 1. Update navigation files
const navFiles = glob.sync('src/navigation/**/*.js', { cwd: __dirname });
navFiles.forEach(file => {
    const filePath = path.join(__dirname, file);
    let content = fs.readFileSync(filePath, 'utf8');
    let changed = false;

    Object.keys(screensMap).forEach(screen => {
        // Regex to match "import ScreenName from '../screens/ScreenName';"
        // and replace with "import ScreenName from '../screens/subfolder/ScreenName';"
        const regex = new RegExp(`from\\s+['"](\\.\\./screens/)${screen}['"]`, 'g');
        if (regex.test(content)) {
            content = content.replace(regex, `from '../screens/${screensMap[screen]}'`);
            changed = true;
        }
    });

    if (changed) {
        fs.writeFileSync(filePath, content);
        console.log(`Updated navigation file: ${file}`);
    }
});

// App.js
const appFile = path.join(__dirname, 'App.js');
if (fs.existsSync(appFile)) {
    let content = fs.readFileSync(appFile, 'utf8');
    if (content.includes("from './src/screens/SplashScreen'")) {
        content = content.replace(
            "from './src/screens/SplashScreen'",
            "from './src/screens/onboarding/SplashScreen'"
        );
        fs.writeFileSync(appFile, content);
        console.log("Updated App.js");
    }
}

// 2. Fix imports WITHIN screen files (they moved deeper, so '../components' becomes '../../components')
const screenFolders = ['onboarding', 'home', 'profile', 'transactions', 'cards', 'transfers', 'crypto', 'security'];

screenFolders.forEach(folder => {
    const files = glob.sync(`src/screens/${folder}/**/*.js`, { cwd: __dirname });

    files.forEach(file => {
        const filePath = path.join(__dirname, file);
        let content = fs.readFileSync(filePath, 'utf8');
        let changed = false;

        // Match imports from root-level src directories (components, theme, data, services, utils, context, constants)
        const dirs = ['components', 'theme', 'data', 'services', 'utils', 'context', 'constants', 'navigation'];

        dirs.forEach(dir => {
            // Replace '../dir' with '../../dir'
            const regex = new RegExp(`from\\s+['"]\\.\\./${dir}`, 'g');
            if (regex.test(content)) {
                content = content.replace(regex, `from '../../${dir}`);
                changed = true;
            }
        });

        if (changed) {
            fs.writeFileSync(filePath, content);
            console.log(`Updated screen file: ${file}`);
        }
    });
});

console.log('Update script completed.');
