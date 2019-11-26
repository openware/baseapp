import { Decimal } from '@openware/components';
import * as React from 'react';
import { InjectedIntlProps, injectIntl } from 'react-intl';
import { RouterProps } from 'react-router';
import { withRouter } from 'react-router-dom';
import { OrderIEO } from '../';
import { getCountdownDate, localeDate } from '../../../../helpers';
import { Currency } from '../../../../modules';
import { Blur, LoginBlur } from '../../components';
import { DataIEOInterface } from '../../modules';

interface OwnProps {
    currency: Currency;
    ieo: DataIEOInterface;
    isLoggedIn: boolean;
}

interface State {
    countdownValue: string;
}

type Props = OwnProps & InjectedIntlProps & RouterProps;

class IEOInfoComponent extends React.Component<Props, State> {
    public countdownInterval;

    constructor(props: Props) {
        super(props);

        this.state = {
            countdownValue: '00:00:00',
        };
    }

    public componentDidMount() {
        const { ieo } = this.props;
        if (ieo) {
            let countdownDate = ieo.starts_at;

            if (ieo.state === 'ongoing') {
                countdownDate = ieo.finishes_at;
            }

            this.countdownInterval = setInterval(() => {
                if (ieo.state === 'distributing') {
                    countdownDate = ieo.finishes_at;
                    this.setState({ countdownValue: getCountdownDate(countdownDate, '5m')});
                } else {
                    this.setState({ countdownValue: getCountdownDate(countdownDate)});
                }
            }, 1000);
        }
    }

    public componentWillReceiveProps(nextProps) {
        const { ieo } = this.props;

        if (!ieo && nextProps.ieo) {
            let countdownDate = nextProps.ieo.starts_at;

            if (nextProps.ieo.state === 'ongoing') {
                countdownDate = nextProps.ieo.finishes_at;
            }

            this.countdownInterval = setInterval(() => {
                if (nextProps.ieo.state === 'distributing') {
                    countdownDate = nextProps.ieo.finishes_at;
                    this.setState({ countdownValue: getCountdownDate(countdownDate, '5m')});
                } else {
                    this.setState({ countdownValue: getCountdownDate(countdownDate)});
                }
            }, 1000);
        }
    }

    public componentDidUpdate(prevProps: Props, prevState: State) {
        const { ieo } = this.props;
        const { countdownValue } = this.state;

        if (prevState.countdownValue !== countdownValue &&
            countdownValue === '00:00:00' &&
            prevState.countdownValue === '00:00:01') {
            this.props.handleFetchIEO();
        }

        if (prevProps.ieo && ieo && prevProps.ieo.state !== ieo.state) {
            clearInterval(this.countdownInterval);
            let countdownDate = ieo.starts_at;

            if (ieo.state === 'ongoing') {
                countdownDate = ieo.finishes_at;
            }

            this.countdownInterval = setInterval(() => {
                if (ieo.state === 'distributing') {
                    countdownDate = ieo.finishes_at;
                    this.setState({ countdownValue: getCountdownDate(countdownDate, '5m')});
                } else {
                    this.setState({ countdownValue: getCountdownDate(countdownDate)});
                }
            }, 1000);
        }
    }

    public translate = (e: string) => {
        return this.props.intl.formatMessage({ id: e });
    };

    public render() {
        const { currency, ieo } = this.props;

        return (
            <div className="ieo-profile-info">
                <div className="ieo-profile-info__main">
                    <div className="ieo-profile-info__main__info">
                        <div className="ieo-profile-info__main__info__coin-area">
                            <div className="ieo-profile-info__main__info__coin-area__coin-logo">
                                {currency && <img src={currency.icon_url} alt="coin logo" />}
                            </div>
                            <div className="ieo-profile-info__main__info__coin-area__coin-currency">
                                {ieo.currency_id && ieo.currency_id.toUpperCase()}
                            </div>
                            <div className="ieo-profile-info__main__info__coin-area__currency-name">
                                {ieo.name}
                            </div>
                        </div>
                        {this.renderContent(ieo.state)}
                    </div>
                    <div className="ieo-profile-info__main__description">
                        {this.translate('page.body.ieo.profile.info.description')}
                    </div>
                </div>
                <div className="ieo-profile-info__order">
                    <OrderIEO currentIEO={ieo} />
                    {this.renderBlur()}
                </div>
            </div>
        );
    }

    private renderBlur = () => {
        const { isLoggedIn, ieo } = this.props;

        if (!isLoggedIn) {
            return (
                <LoginBlur
                    title={this.translate('page.body.ieo.details.order.blur.login')}
                    btnLabel={this.translate('page.body.ieo.details.order.blur.btnLogin')}
                    createAccountLabel={this.translate('page.body.ieo.details.order.blur.createAccount')}
                    onSignInClick={this.onSignInClick}
                    onSignUpClick={this.onSignUpClick}
                />
            );
        } else {
            switch (ieo.state) {
                case 'preparing':
                    return (
                        <Blur
                            title={this.props.intl.formatMessage({ id: 'page.body.ieo.details.order.content.blur.title' })}
                            ieo={ieo}
                        />
                    );
                case 'finished':
                    return (
                        <Blur
                            title={this.props.intl.formatMessage({ id: 'page.body.ieo.details.order.content.blur.titleFinished' })}
                            ieo={ieo}
                        />
                    );
                default:
                    return null;
            }
        }
    };

    private renderContent = (state: string) => {
        switch (state) {
            case 'preparing':
                return this.renderPreparing();
            case 'ongoing':
            case 'distributing':
                return this.renderInProgress();
            case 'finished':
                return this.renderFinished();
            default:
                return;
        }
    }

    private renderPreparing = () => {
        const { ieo, currency} = this.props;

        return (
            <div className="ieo-profile-info__main__info__value">
                <div className="expiration-time">
                    <div className="expiration-time__label">
                        {this.translate('page.body.ieo.details.info.startsAt')}
                    </div>
                    <div className="expiration-time__value">
                        {localeDate(ieo.starts_at, 'fullDate')}
                    </div>
                </div>
                <div className="expiration-time">
                    <div className="expiration-time__label">
                        {this.translate('page.body.ieo.details.info.finishesAt')}
                    </div>
                    <div className="expiration-time__value">
                        {localeDate(ieo.finishes_at, 'fullDate')}
                    </div>
                </div>
                <div className="ieo-price">
                    <div className="ieo-price__label">
                        {this.translate('page.body.ieo.profile.info.price')}
                    </div>
                    <div className="ieo-price__value">
                        {currency && Decimal.format(ieo.pairs[0].price, currency.precision)}&nbsp;
                        {ieo.pairs[0].quote_currency_id && ieo.pairs[0].quote_currency_id.toUpperCase()}
                    </div>
                </div>
                <div className="ieo-goal">
                    <div className="ieo-goal__label">
                        {this.translate('page.body.ieo.profile.info.goal')}
                    </div>
                    <div className="ieo-goal__value">
                        {ieo.supply}&nbsp;
                        {ieo.currency_id && ieo.currency_id.toUpperCase()}
                    </div>
                </div>
            </div>
        );
    }

    private renderInProgress = () => {
        const { countdownValue } = this.state;
        const { ieo, currency } = this.props;
        const percentage = +Decimal.format((+ieo.tokens_ordered * 100) / +ieo.supply, 2);

        return (
            <div className="ieo-profile-info__main__info__value">
                <div className="expiration-time">
                    <div className="expiration-time__label">
                        {this.translate('page.body.ieo.profile.info.price.close.in')}
                    </div>
                    <div className="expiration-time__value">
                        {countdownValue === '00:00:00' ? 'End' : countdownValue}
                    </div>
                </div>
                <div className="ieo-price">
                    <div className="ieo-price__label">
                        {this.translate('page.body.ieo.profile.info.price')}
                    </div>
                    <div className="ieo-price__value">
                        {currency && Decimal.format(ieo.pairs[0].price, currency.precision)}&nbsp;
                        {ieo.pairs[0].quote_currency_id && ieo.pairs[0].quote_currency_id.toUpperCase()}
                    </div>
                </div>
                <div className="ieo-goal">
                    <div className="ieo-goal__label">
                        {this.translate('page.body.ieo.profile.info.goal')}
                    </div>
                    <div className="ieo-goal__value">
                        {ieo.supply}&nbsp;
                        {ieo.currency_id && ieo.currency_id.toUpperCase()}
                    </div>
                </div>
                <div className="curent-progress-block">
                    <div className="curent-progress-block__price">
                        {ieo.tokens_ordered}&nbsp;/&nbsp;{ieo.supply}&nbsp;{ieo.currency_id && ieo.currency_id.toUpperCase()}
                    </div>
                    <div className="curent-progress-block__progress-bar">
                        <div className="curent-progress-block__progress-bar__current" />
                    </div>
                    <div className="curent-progress-block__value">
                        <div className="curent-progress-block__value__label">
                            {this.translate('page.body.ieo.profile.info.progress')}
                        </div>
                        <div className="curent-progress-block__value__current-value">
                            {`${percentage}%`}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    private renderFinished = () => {
        const { ieo, currency } = this.props;
        const amountOfQuote = ieo.tokens_ordered && currency && Decimal.format(+ieo.tokens_ordered * +ieo.pairs[0].price, currency.precision);
        const percentage = +Decimal.format((+ieo.tokens_ordered * 100) / +ieo.supply, 2);

        return (
            <div className="ieo-profile-info__main__info__value">
                <div className="expiration-time">
                    <div className="expiration-time__label">
                        {this.translate('page.body.ieo.details.info.finishedAt')}
                    </div>
                    <div className="expiration-time__value">
                        {localeDate(ieo.finishes_at, 'fullDate')}
                    </div>
                </div>
                <div className="ieo-price">
                    <div className="ieo-price__label">
                        {this.translate('page.body.ieo.card.raised')}
                    </div>
                    <div className="ieo-price__value">
                        {amountOfQuote} {amountOfQuote && ieo.pairs[0].quote_currency_id && ieo.pairs[0].quote_currency_id.toUpperCase()}
                    </div>
                </div>
                <div className="curent-progress-block">
                    <div className="curent-progress-block__progress-bar">
                        <div className="curent-progress-block__progress-bar__current" />
                    </div>
                    <div className="curent-progress-block__value">
                        <div className="curent-progress-block__value__label">
                            {this.translate('page.body.ieo.profile.info.progress')}
                        </div>
                        <div className="curent-progress-block__value__current-value">
                            {`${percentage}%`}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    private onSignInClick = () => {
        this.props.history.push('/signin');
    };

    private onSignUpClick = () => {
        this.props.history.push('/signup');
    };
}

export const IEOInfo = injectIntl(withRouter(IEOInfoComponent));
