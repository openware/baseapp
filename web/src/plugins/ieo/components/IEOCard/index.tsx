import classnames from 'classnames';
import * as React from 'react';
import { injectIntl } from 'react-intl';
import { Decimal } from '../../../../components';
import { CryptoIcon } from '../../../../components/CryptoIcon';
import { localeDate } from '../../../../helpers';
import { IntlProps } from '../../../../index';
import { Currency } from '../../../../modules';
import { ieoFields } from '../../constants';
import { getCountdownDate } from '../../helpers';
import { DataIEOInterface } from '../../modules';

interface CardIEOProps {
    ieo: DataIEOInterface;
    onIEOSelect: (ieo: DataIEOInterface) => void;
    handleFetchIEO: () => void;
    onClick: (ieo: DataIEOInterface) => void;
    currencies: Currency[];
}

interface State {
    countdownValue: string;
}

const limitDescription = 80;

type Props = CardIEOProps & IntlProps;

class IEOCardComponent extends React.Component<Props, State> {
    public countdownInterval;

    constructor(props: Props) {
        super(props);

        this.state = {
            countdownValue: '00:00:00',
        };
    }

    public translate = (e: string) => {
        return this.props.intl.formatMessage({ id: e });
    };

    public componentDidMount() {
        const { ieo } = this.props;
        if (ieo) {
            let countdownDate = ieo.starts_at;

            if (ieo.state === 'ongoing') {
                countdownDate = ieo.finishes_at;
            }

            this.countdownInterval = setInterval(() => {
                if (ieo.state === 'distributing' && ieo.type === 'proportional') {
                    countdownDate = ieo.finishes_at;
                    this.setState({ countdownValue: getCountdownDate(countdownDate, '5m') });
                } else {
                    this.setState({ countdownValue: getCountdownDate(countdownDate) });
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
                if (nextProps.ieo.state === 'distributing' && this.props.ieo.type === 'proportional') {
                    countdownDate = nextProps.ieo.finishes_at;
                    this.setState({ countdownValue: getCountdownDate(countdownDate, '5m') });
                } else {
                    this.setState({ countdownValue: getCountdownDate(countdownDate) });
                }
            }, 1000);
        }
    }

    public componentDidUpdate(prevProps: Props, prevState: State) {
        const { ieo } = this.props;

        if (prevProps.ieo && ieo && prevProps.ieo.state !== ieo.state) {
            clearInterval(this.countdownInterval);
            let countdownDate = ieo.starts_at;

            if (ieo.state === 'ongoing') {
                countdownDate = ieo.finishes_at;
            }

            this.countdownInterval = setInterval(() => {
                this.setState({ countdownValue: getCountdownDate(countdownDate) });

                if (ieo.state === 'distributing' && ieo.type === 'proportional') {
                    countdownDate = ieo.finishes_at;
                    this.setState({ countdownValue: getCountdownDate(countdownDate, '5m') });
                } else {
                    this.setState({ countdownValue: getCountdownDate(countdownDate) });
                }
            }, 1000);
        }
    }

    public componentWillUnmount(): void {
        clearInterval(this.countdownInterval);
    }

    public render() {
        const { currency_id, name, state, description, metadata } = this.props.ieo;
        const cuttedDescription = description && description.length >= limitDescription ? `${description.slice(0, limitDescription)} ...` : description;
        const currency = this.props.currencies.find(item => item.id === currency_id);
        const iconUrl = (ieoFields.metadata && metadata && metadata.icon_url) || (currency && currency.icon_url);

        return (
            <div className="pg-ieo__card" onClick={this.handleClick}>
                <div className="pg-ieo__card-header">
                    {iconUrl ? <img className="pg-ieo__card-header__icon" src={iconUrl} alt="ieo-icon" /> : <CryptoIcon className="pg-ieo__card-header__icon" code={currency_id.toUpperCase()} />}
                    <span className="pg-ieo__card-header__text">{currency_id && currency_id.toUpperCase()}</span>
                </div>
                <div className="pg-ieo__card-content">
                    <span className="pg-ieo__card-content__title">{name}</span>
                    {ieoFields.description && <span className="pg-ieo__card-content__text">{cuttedDescription}</span>}
                    {this.getContent(state)}
                </div>
            </div>
        );
    }

    private handleClick = () => {
        const { ieo } = this.props;

        this.props.onClick(ieo);
    };

    private getContent = (state: string) => {
        switch (state) {
            case 'preparing':
                return this.renderPreparingItem();
            case 'ongoing':
            case 'distributing':
                return this.renderInProgress();
            case 'finished':
                return this.renderFinished();
            default:
                return;
        }
    };

    private renderPreparingItem = () => {
        const {
            starts_at,
            finishes_at,
            supply,
            currency_id,
            metadata,
        } = this.props.ieo;
        const currency = this.props.currencies.find(item => item.id === currency_id);

        return (
            <div className="pg-ieo__card-content-block">
                <div className="pg-ieo__card-content-block__row">
                    <span className="pg-ieo__card-content-block__text">{this.translate('page.body.ieo.profile.info.goal')}</span>
                    <span className="pg-ieo__card-content-block__text text-bold">
                        {Decimal.format(supply, +((ieoFields.metadata && metadata && metadata.precision) || (currency && currency.precision) || 0))}&nbsp;
                        {currency_id && currency_id.toUpperCase()}
                    </span>
                </div>
                <div className="pg-ieo__card-content-block__row">
                    <span className="pg-ieo__card-content-block__text">{this.translate('page.body.ieo.card.start.date')}</span>
                    <span className="pg-ieo__card-content-block__text text-bold">{localeDate(starts_at, 'fullDate')}</span>
                </div>
                <div className="pg-ieo__card-content-block__row">
                    <span className="pg-ieo__card-content-block__text">{this.translate('page.body.ieo.card.end.date')}</span>
                    <span className="pg-ieo__card-content-block__text text-bold">{localeDate(finishes_at, 'fullDate')}</span>
                </div>
            </div>
        );
    };

    private renderInProgress = () => {
        const { supply, currency_id, metadata } = this.props.ieo;
        const currency = this.props.currencies.find(item => item.id === currency_id);

        return (
            <div className="pg-ieo__card-content-block">
                <div className="pg-ieo__card-content-block__row">
                    <span className="pg-ieo__card-content-block__text">{this.translate('page.body.ieo.profile.info.goal')}</span>
                    <span className="pg-ieo__card-content-block__text text-bold">
                        {Decimal.format(supply, +((ieoFields.metadata && metadata && metadata.precision) || (currency && currency.precision) || 0))}&nbsp;
                        {currency_id && currency_id.toUpperCase()}
                    </span>
                </div>
                {this.renderProgressBar()}
            </div>
        );
    };

    private renderFinished = () => {
        const { tokens_ordered, pairs } = this.props.ieo;
        const { currencies } = this.props;
        const quoteCurrency = currencies.length && pairs[0].quote_currency_id ? currencies.find(currency => (currency.id && currency.id.toLowerCase() === pairs[0].quote_currency_id.toLowerCase()) || false) : null;
        const amountOfQuote = tokens_ordered && quoteCurrency ? Decimal.format(+tokens_ordered * +pairs[0].price, +quoteCurrency.precision) : null;

        return (
            <div className="pg-ieo__card-content-block">
                <div className="pg-ieo__card-content-block__row">
                    <span className="pg-ieo__card-content-block__text">{this.translate('page.body.ieo.card.raised')}</span>
                    <span className="pg-ieo__card-content-block__text text-bold">
                        {amountOfQuote} {pairs[0].quote_currency_id && pairs[0].quote_currency_id.toUpperCase()}
                    </span>
                </div>
                {this.renderProgressBar()}
            </div>
        );
    };

    private renderProgressBar = () => {
        const { countdownValue } = this.state;
        const { supply, tokens_ordered, state } = this.props.ieo;

        const percentage = +supply ? +Decimal.format((+(tokens_ordered || 0) * 100) / +supply, 2) : 0;

        const countDownColorClass = classnames('content__ieo-countdown', {
            'content__ieo-countdown--red': countdownValue && Number(countdownValue.split(':').pop()) % 2 === 0,
            'font-yellow': state === 'finished',
        });

        const percentageClass = classnames('filler', {
            'filler--zero': percentage < 5,
            'back-yellow': state === 'finished',
        });

        const currentProgressClass = classnames('ieo-progress-bar__value__current', {
            'font-yellow': state === 'finished',
        });

        return (
            <React.Fragment>
                <div className="pg-ieo__card-content-block__row">
                    <span className="pg-ieo__card-content-block__text">{this.translate('page.body.ieo.card.countdown')}</span>
                    <div className={countDownColorClass}>{countdownValue === '00:00:00' ? this.translate('page.body.ieo.card.end') : countdownValue}</div>
                </div>
                <div className="ieo-progress-bar">
                    <div className={percentageClass} style={{ width: `${percentage}%` }} />
                    <div className="ieo-progress-bar__value">
                        <div className="ieo-progress-bar__value__label">{this.translate('page.body.ieo.profile.info.progress')}</div>
                        <div className={currentProgressClass}>{`${percentage}%`}</div>
                    </div>
                </div>
            </React.Fragment>
        );
    };
}

export const IEOCard = injectIntl(IEOCardComponent);
