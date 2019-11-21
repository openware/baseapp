import * as React from 'react';
import { InjectedIntlProps, injectIntl } from 'react-intl';
import { IEOOrder } from '../../components/IEOOrder';

const coinCurrency = 'OWC';
const coinCurrencyName = 'Openware Coin Market';
const expirationTime = '28 days 19:32:36';
const priceValue = '0.00125';
const priceCurrency = 'BTC';
const goalValue = '2 000 000';
const goalCurrency = 'USD';
const currentValue = '120 000 000';
const totalValue = '600 000 000';
const currentCoin = 'OWC';
const currentProgressValue = '20%';
const availableBase = 12;
const availableQuote = 11;

type Props = InjectedIntlProps;

class IEOInfoComponent extends React.Component<Props> {
    public translate = (e: string) => {
        return this.props.intl.formatMessage({ id: e });
    };

    public render() {
        return (
            <div className="ieo-profile-info">
                <div className="ieo-profile-info__main">
                    <div className="ieo-profile-info__main__info">
                        <div className="ieo-profile-info__main__info__coin-area">
                            <div className="ieo-profile-info__main__info__coin-area__coin-logo">
                                <img src="" alt="coin logo" />
                            </div>
                            <div className="ieo-profile-info__main__info__coin-area__coin-currency">
                                {coinCurrency}
                            </div>
                            <div className="ieo-profile-info__main__info__coin-area__currency-name">
                                {coinCurrencyName}
                            </div>
                        </div>
                        <div className="ieo-profile-info__main__info__value">
                            <div className="expiration-time">
                                <div className="expiration-time__label">
                                    {this.translate('page.body.ieo.profile.info.price.close.in')}
                                </div>
                                <div className="expiration-time__value">
                                    {expirationTime}
                                </div>
                            </div>
                            <div className="ieo-price">
                                <div className="ieo-price__label">
                                    {this.translate('page.body.ieo.profile.info.price')}
                                </div>
                                <div className="ieo-price__value">
                                    {priceValue}&nbsp;
                                    {priceCurrency}
                                </div>
                            </div>
                            <div className="ieo-goal">
                                <div className="ieo-goal__label">
                                    {this.translate('page.body.ieo.profile.info.goal')}
                                </div>
                                <div className="ieo-goal__value">
                                    {goalValue}&nbsp;
                                    {goalCurrency}
                                </div>
                            </div>
                            <div className="curent-progress-block">
                                <div className="curent-progress-block__price">
                                    {currentValue}/{totalValue}&nbsp;{currentCoin}
                                </div>
                                <div className="curent-progress-block__progress-bar">
                                    <div className="curent-progress-block__progress-bar__current" />
                                </div>
                                <div className="curent-progress-block__value">
                                    <div className="curent-progress-block__value__label">
                                        {this.translate('page.body.ieo.profile.info.progress')}
                                    </div>
                                    <div className="curent-progress-block__value__current-value">
                                        {currentProgressValue}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="ieo-profile-info__main__description">
                        {this.translate('page.body.ieo.profile.info.description')}
                    </div>
                </div>
                <div className="ieo-profile-info__order">
                    <IEOOrder
                        availableBase={availableBase}
                        availableQuote={availableQuote}
                        onSubmit={this.handleSubmit}
                    />
                </div>
            </div>
        );
    }

    private handleSubmit = () => { window.console.log('submit'); };
}

export const IEOInfo = injectIntl(IEOInfoComponent);
