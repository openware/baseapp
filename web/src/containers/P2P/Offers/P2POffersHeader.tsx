import React, { FC, ReactElement } from 'react';
import { Button } from 'react-bootstrap';
import { useIntl } from 'react-intl';
import { useHistory } from 'react-router';
import { PlusIcon } from 'src/assets/images/PlusIcon';
import { DropdownComponent } from 'src/components';

interface ParentProps {
    side: string;
    fiatCurrency: string;
    fiatCurrencies: string[];
    paymentMethod: string;
    paymentsList: string[];
    onClickSideTab: (side: string) => void;
    setPayment: (value: string) => void;
    setFiatCurrency: (id: string) => void;
}

type Props = ParentProps;

export const P2POffersHeader: FC<Props> = (props: Props): ReactElement => {
    const { formatMessage } = useIntl();
    const history = useHistory();

    const {
        onClickSideTab,
        paymentsList,
        paymentMethod,
        setPayment,
        side,
        fiatCurrencies,
        setFiatCurrency,
        fiatCurrency,
    } = props;

    const onCreateClick = React.useCallback(() => {
        history.push('/create-offer');
    }, [history]);

    return (
        <div className="cr-p2p-header">
            <div className="cr-p2p-header__filters">
                <div className="cr-p2p-header__btn-wrapper">
                    <Button
                        onClick={() => onClickSideTab('buy')}
                        size="lg"
                        variant={side === 'buy' ? 'success' : 'outline-success'}
                    >
                        {formatMessage({ id: 'page.body.p2p.tabs.buy' })}
                    </Button>
                    <Button
                        onClick={() => onClickSideTab('sell')}
                        size="lg"
                        variant={side === 'sell' ? 'danger' : 'outline-danger'}

                    >
                        {formatMessage({ id: 'page.body.p2p.tabs.sell' })}
                    </Button>
                </div>
                {fiatCurrencies.length > 1 && (
                    <div className="cr-p2p-header__dp">
                        <div className="cr-p2p-header__dp-label">{formatMessage({ id: 'page.body.p2p.dropdown.fiat' })}</div>
                        <DropdownComponent
                            className="cr-p2p-header__dp-dropdown"
                            list={fiatCurrencies}
                            onSelect={value => setFiatCurrency(fiatCurrencies[value])}
                            placeholder={fiatCurrency}
                        />
                    </div>
                )}
                <div className="cr-p2p-header__dp">
                    <div className="cr-p2p-header__dp-label">{formatMessage({ id: 'page.body.p2p.dropdown.payments' })}</div>
                    <DropdownComponent
                        className="cr-p2p-header__dp-dropdown"
                        list={paymentsList}
                        onSelect={value => setPayment(paymentsList[value])}
                        placeholder={paymentMethod || formatMessage({ id: 'page.body.p2p.dropdown.all' })}
                    />
                </div>
            </div>
            <div className="cr-p2p-header__action">
                <Button
                    onClick={onCreateClick}
                    size="lg"
                    variant="primary"
                >
                    <span>{formatMessage({ id: 'page.body.p2p.tabs.create' })}</span>
                    <PlusIcon className="icon"/>
                </Button>
            </div>
        </div>
    );
};
