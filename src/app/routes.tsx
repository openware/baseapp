import * as React from 'react';
import { Route, Switch } from 'react-router-dom';

import { HelloPage } from '../units/plain/pages/hello';

export const RootRoutes: React.FC = () => {
    return (
        <Switch>
            <Route path="/" component={HelloPage} />
            {/* <Route exact={true} path={AppUrls.magicLink.path} component={MagicLink} />
            <Route path={AppUrls.signIn.path} component={SignInScreen} />
            <Route path={AppUrls.accountsConfirmation.path} component={VerificationScreen} />
            <Route path={AppUrls.signUp.path} component={SignInScreen} />
            <Route path={AppUrls.forgotPassword.path} component={ForgotPasswordScreen} />
            <Route path={AppUrls.forgotPassword.path} component={ChangeForgottenPasswordScreen} />
            <Route path={AppUrls.emailVerification.path} component={EmailVerificationScreen} />
            <Route path={AppUrls.forgotPassword.path} component={RestrictedScreen} />
            <Route path={AppUrls.maintenance.path} component={MaintenanceScreen} />
            <Route path={AppUrls.trading.path} exact={true} component={TradingScreen} />
            <Route path={AppUrls.orders.path} component={OrdersTabScreen} />
            <Route path={AppUrls.history.path} component={HistoryScreen} />
            <Route path={AppUrls.confirm.path} component={ConfirmScreen} />
            <Route path={AppUrls.profile.path} component={ProfileScreen} />
            <Route path={AppUrls.wallets.path} component={WalletsScreen} />
            <Route path={AppUrls.security2fa.path} component={ProfileTwoFactorAuthScreen} />
            <Route path={AppUrls.index.path}>
                <Redirect to={AppUrls.maintenance.path} />
            </Route> */}
        </Switch>
    );
};
