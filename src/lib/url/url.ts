import { AppRoute } from 'lib/routing';
import { WalletRouteParams } from './interfaces';

const wallet = new AppRoute<WalletRouteParams>('/wallets/:currency?/:tab?');

export const AppUrl = {
    wallet,
};
