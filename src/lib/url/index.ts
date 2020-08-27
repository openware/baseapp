import { AppRoute } from './routing';

const index = new AppRoute('/');
const signIn = new AppRoute('/signin');
const magicLink = new AppRoute('/magic-link');
const accountsConfirmation = new AppRoute('/accounts/confirmation');
const signUp = new AppRoute('/signup');
const forgotPassword = new AppRoute('/forgot_password');
const accountsPasswordReset = new AppRoute('/accounts/password_reset');
const emailVerification = new AppRoute('/email-verification');
const noFound = new AppRoute('/404');
const maintenance = new AppRoute('/500');
const trading = new AppRoute<{ market?: string }>('/trading/:market?');

const orders = new AppRoute('/orders');
const history = new AppRoute('/history');
const confirm = new AppRoute('/confirm');
const profile = new AppRoute('/profile');
const wallets = new AppRoute('/wallets');
const security2fa = new AppRoute('/security/2fa');

export const AppUrls = {
    index,
    signIn,
    magicLink,
    accountsConfirmation,
    signUp,
    forgotPassword,
    accountsPasswordReset,
    emailVerification,
    noFound,
    maintenance,
    trading,
    orders,
    history,
    confirm,
    profile,
    wallets,
    security2fa,
};
