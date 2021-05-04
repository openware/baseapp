import React, { FC, ReactElement, useCallback, useEffect, useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import { useIntl } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import { Decimal, TabPanel } from 'src/components';
import { HOST_URL } from 'src/constants';
import { getCountdownDate, secondToMinutes, titleCase } from 'src/helpers';
import { Currency, P2POrder, p2pOrdersUpdateFetch, selectCurrencies, UserPaymentMethod } from 'src/modules';

interface ParentProps {
    order: P2POrder;
    isTaker: boolean;
}

type Props = ParentProps;

const OrderWaitPayment: FC<Props> = (props: Props): ReactElement => {
    const [timeLeft, setTimeLeft] = useState<string>('00:00:00');
    const [confirmTransfer, setConfirmTransfer] = useState<boolean>(false);
    const [tab, setTab] = useState<string>('');
    const [tabMapping, setTabMapping] = useState<string[]>([]);
    const [currentTabIndex, setCurrentTabIndex] = useState<number>(0);
    const currencies: Currency[] = useSelector(selectCurrencies);

    const { order, isTaker } = props;
    const dispatch = useDispatch();
    const { formatMessage } = useIntl();

    useEffect(() => {
        if (order) {
            const timer = setTimeout(() => {
                setTimeLeft(getCountdownDate(order.state === 'prepared' ? order.first_approve_expire_at : order.second_approve_expire_at));
            }, 1000);

            return () => {
                clearTimeout(timer);
            };
        }
    });

    useEffect(() => {
        if (order) {
            const pmList = order.side === 'sell'
                ? [ order.payment_method?.payment_method.name ]
                : order.offer.payment_methods.map(i => i.payment_method.name);
            setTabMapping(pmList);
            setTab(pmList[0]);
            setCurrentTabIndex(0);
        }
    }, [order]);

    const translate = useCallback((id: string, value?: any) => formatMessage({ id }, { ...value }), []);

    const clickCheckBox = useCallback(e => {
        if (e) {
            e.preventDefault();
            setConfirmTransfer(!confirmTransfer);
        }
    }, [confirmTransfer]);

    const handleCancel = useCallback(() => {
        order && dispatch(p2pOrdersUpdateFetch({ id: order.id, action: 'cancel' }));
    }, [order]);

    const handleClickPaid = useCallback(() => {
        const selectedPaymentMethod = order?.offer?.payment_methods[currentTabIndex];

        order && dispatch(p2pOrdersUpdateFetch({
            id: order.id,
            action: 'approve',
            ...(order.side === 'buy' && order.state === 'prepared' && { payment_method_id: selectedPaymentMethod.id }),
        }));
    }, [order, currentTabIndex]);

    const onCurrentTabChange = useCallback((index: number) => {
        setCurrentTabIndex(index);
    }, [tabMapping]);

    const onTabChange = useCallback((index: number) => {
        if (tab !== tabMapping[index]) {
            setTab(tabMapping[index]);
        }        
    }, [tabMapping]);

    const renderTabs = useCallback(() => tabMapping.map((i, index) => {
        const selectedPaymentMethod = order.side === 'sell'
            ? order?.payment_method
            : order?.offer?.payment_methods[index];

        return {
            content: currentTabIndex === index ? getPaymentMethodInfo(selectedPaymentMethod) : null,
            label: <div><img className="payment-method-logo ml-2 mr-3 mb-1" src={`${HOST_URL}/api/v2/p2p/public/payment_methods/${selectedPaymentMethod?.payment_method.id}/logo`} alt=""/>{i}</div>,
        };
    }), [order, currentTabIndex, tabMapping]);

    const getPaymentMethodInfo = (pm?: UserPaymentMethod) => {
        return pm ? (
            <div className="pm-list">
                {
                    Object.keys(pm.data).map(key => {
                        return (
                            <div className="pm-list__item">
                                <label>{titleCase(key)}</label>
                                <div>{pm.data[key]}</div>
                            </div>
                        );
                    })
                }
            </div>
        ) : null;
    };

    const renderPaymentMethodDetails = () => {
        const details = order.side === 'sell' ? order?.payment_method : order?.offer?.payment_methods?.find(pm => pm.id === order.payment_method_id);

        return details ? <div className="pm-details"> {
            Object.keys(details.payment_method.options).map(key => {
                const option = details.payment_method.options[key];

                return (
                    <div className="field">
                        <div className="label">{option.name}</div>
                        <div className="value">{details.data[key]}</div>
                    </div>
                );
            })
        }</div> : null;
    };

    const getPrecision = useCallback((cur: string) => {
        return cur && currencies.find(i => i.id === cur.toLowerCase())?.precision;
    }, [currencies]);

    return (
        <div className="cr-prepare-order">
            {!isTaker && order?.side === 'sell' || isTaker && order?.side === 'buy' ? (
                <div className="cr-prepare-order__block">
                    <span className="bold">{translate('page.body.p2p.order.transfer.info.1')}</span>
                    <span className="bold">{translate('page.body.p2p.order.transfer.info.2')}</span>
                </div>
            ) : (
                <div className="cr-prepare-order__block">
                    <div className="cr-prepare-order__block--row">
                        <span className="bold-36">{translate(`page.body.p2p.order.transfer.order.wait.info`)}</span>
                    </div>
                    <div className="cr-prepare-order__block--row">
                        { renderPaymentMethodDetails() }
                    </div>
                </div>
            )}
            {!isTaker && order?.side === 'sell' || isTaker && order?.side === 'buy' ? (
                <div className="cr-prepare-order-tab">
                    <div className="cr-prepare-order-tab__tabs-content">
                        <TabPanel
                            panels={renderTabs()}
                            onTabChange={onTabChange}
                            currentTabIndex={currentTabIndex}
                            onCurrentTabChange={onCurrentTabChange}
                        />
                    </div>
                </div>
            ) : null}
            <div className="cr-prepare-order__block">
                <div className="cr-prepare-order__block--row">
                    <span className="huge-text">{translate(`page.body.p2p.order.transfer.order.wait.timer.${order?.state}`)}</span>
                    <span className="ticker">{timeLeft}</span>
                </div>
                <div className="cr-prepare-order__block--row">
                    <span>{translate(`page.body.p2p.order.transfer.order.wait.warning.${order?.state}`, order && { time: secondToMinutes(order.offer.time_limit) })}</span>
                </div>
                <div className="cr-prepare-order__block--row">
                    <Form className="cr-prepare-order__checkbox" onClick={clickCheckBox}>
                        <Form.Check
                            type="checkbox"
                            custom
                            id="confirmTransfer"
                            checked={confirmTransfer}
                            readOnly={true}
                            label={translate(`page.body.p2p.order.transfer.order.wait.confirm.checkbox.${order?.state}`, order && { amount: `${Decimal.format(+order.amount * +order.offer?.price, getPrecision(order.offer?.quote), ',')} ${order?.offer?.quote?.toUpperCase()}` })}
                        />
                    </Form>
                </div>
            </div>
            {!isTaker && order?.side === 'sell' || isTaker && order?.side === 'buy' ? (
                <div className="cr-prepare-order__btn-wrapper__grid">
                    <Button
                        onClick={handleClickPaid}
                        size="lg"
                        variant="primary"
                        disabled={!confirmTransfer}
                    >
                        {translate('page.body.p2p.order.transfer.have.paid')}
                    </Button>
                    <Button
                        onClick={handleCancel}
                        size="lg"
                        variant="secondary"
                    >
                        {translate('page.body.p2p.order.transfer.cancel.order').toUpperCase()}
                    </Button>
                </div>
            ) : (
                <div className="cr-prepare-order__btn-wrapper__grid">
                    <Button
                        onClick={handleClickPaid}
                        size="lg"
                        variant="primary"
                        disabled={!confirmTransfer}
                    >
                        {translate('page.body.p2p.order.transfer.order.wait.confirm')}
                    </Button>
                    <Button
                        onClick={() => window.console.log('dispute')}
                        size="lg"
                        variant="secondary"
                    >
                        {translate('page.body.p2p.order.transfer.order.wait.logDispute')}
                    </Button>
                </div>
            )}
        </div>
    );
};

export {
    OrderWaitPayment,
};
