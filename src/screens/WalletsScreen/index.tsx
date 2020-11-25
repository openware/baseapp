import { WalletRouteParams } from 'lib/url';
import { StringUtil } from 'lib/utils';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Spinner } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { useHistory, useParams } from 'react-router';
import { useLocalization, useReduxSelector } from 'src/hooks';

import {
    Tab,
    TabPanel,
    WalletList,
} from '../../components';
import { EstimatedValue } from '../../containers/Wallets/EstimatedValue';
import {
    beneficiariesFetch,
    Beneficiary,
    currenciesFetch,
    selectBeneficiariesActivateSuccess,
    selectBeneficiariesDeleteSuccess,
    selectCurrencies,
    selectHistory,
    selectMobileWalletUi,
    selectWallets,
    selectWalletsLoading,
    walletsAddressFetch,
    walletsData,
    walletsFetch,
} from '../../modules';
import { WalletDepositTab } from './deposit-tab';
import { WalletWithdrawTab } from './withdraw-tab';

// const defaultBeneficiary: Beneficiary = {
//     id: 0,
//     currency: '',
//     name: '',
//     state: '',
//     data: {
//         address: '',
//     },
// };

interface Props {
    walletsError: {
        message: string;
    };
}

export const WalletsScreen: React.FC<Props> = ({ walletsError }) => {
    const getText = useLocalization();
    const dispatch = useDispatch();
    const { currency: activeCurrency } = useParams<WalletRouteParams>();

    const [selectedWalletIndex, setSelectedWalletIndex] = useState(-1);
    const [currentTabIndex, setCurrentTabIndex] = useState(0);
    const [tab, setTab] = useState(getText('page.body.wallets.tabs.deposit'));

    const wallets = useReduxSelector(selectWallets);
    const walletsLoading = useReduxSelector(selectWalletsLoading);
    const historyList = useReduxSelector(selectHistory);
    const mobileWalletChosen = useReduxSelector(selectMobileWalletUi);
    const beneficiariesActivateSuccess = useReduxSelector(selectBeneficiariesActivateSuccess);
    const beneficiariesDeleteSuccess = useReduxSelector(selectBeneficiariesDeleteSuccess);
    const currencies = useReduxSelector(selectCurrencies);

    useEffect(() => {
        if (wallets.length === 0) {
            dispatch(walletsFetch());
        }

        if (wallets.length > 0) {
            dispatch(beneficiariesFetch());
        }

        if (!currencies.length) {
            dispatch(currenciesFetch());
        }

        return () => {
            dispatch(walletsData([]));
        };
    }, []);

    useEffect(() => {
        if (wallets.length) {
            const index = selectedWalletIndex >= 0 ? selectedWalletIndex : 0;
            const { type, balance, currency } = wallets[0];
            if (type === 'coin' && balance) {
                dispatch(walletsAddressFetch({ currency }));
            }
        }
    }, [wallets, selectedWalletIndex]);

    useEffect(() => {
        if (beneficiariesActivateSuccess && beneficiariesDeleteSuccess) {
            dispatch(beneficiariesFetch());
        }
    }, [beneficiariesActivateSuccess, beneficiariesDeleteSuccess]);

    const onTabChange = useCallback((index, label) => setTab(label), []);

    const onCurrentTabChange = useCallback((index) => setCurrentTabIndex(index), []);

    const tabOptions = useMemo<Tab[]>(() => {
        if (wallets.length && currencies.length) {
            let wallet = wallets.find((x) => {
                return StringUtil.isEqual(x.currency, activeCurrency);
            });
            let currency = currencies.find((x) => StringUtil.isEqual(x.id, activeCurrency));

            if (!wallet) {
                wallet = wallets[0];
            }

            if (!currency) {
                currency = currencies[0];
            }

            // const showWithdraw = wallets[selectedWalletIndex].type === 'fiat' || wallets[selectedWalletIndex].balance;

            return [
                {
                    content: wallet && currency ? <WalletDepositTab wallet={wallet} currency={currency} /> : null,
                    label: getText('page.body.wallets.tabs.deposit'),
                },
                {
                    content: wallet ? <WalletWithdrawTab wallet={wallet} /> : null,
                    label: getText('page.body.wallets.tabs.withdraw'),
                    disabled: !(wallet.type === 'fiat' || wallet.balance),
                },
            ];
        } else {
            return [];
        }
    }, [wallets, currencies]);

    return (
        <React.Fragment>
            {wallets.length && <EstimatedValue wallets={wallets} />}
            <div className="pg-container pg-wallet">
                <div className="text-center">{walletsLoading && <Spinner animation="border" variant="primary" />}</div>
                <div
                    className={`row no-gutters pg-wallet__tabs-content ${
                        !historyList.length && 'pg-wallet__tabs-content-height'
                    }`}>
                    <div className={`col-md-5 col-sm-12 col-12 ${mobileWalletChosen && 'd-none d-md-block'}`}>
                        <WalletList
                            items={wallets}
                        />
                    </div>
                    <div
                        className={`pg-wallet__tabs col-md-7 col-sm-12 col-12 ${
                            !mobileWalletChosen && 'd-none d-md-block'
                        }`}>
                        <TabPanel
                            panels={tabOptions}
                            onTabChange={onTabChange}
                            currentTabIndex={currentTabIndex}
                            onCurrentTabChange={onCurrentTabChange}
                        />
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
};
