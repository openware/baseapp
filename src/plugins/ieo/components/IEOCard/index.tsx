import { Decimal } from '@openware/components';
import classnames from 'classnames';
import * as React from 'react';
import { getCountdownDate, localeDate } from '../../../../helpers';
import { Currency } from '../../../../modules';
import { DataIEOInterface } from '../../modules';

interface Props {
    ieo: DataIEOInterface;
    currency?: Currency;
    onIEOSelect: (ieo: DataIEOInterface) => void;
    handleFetchIEO: () => void;
    onClick: (ieo: DataIEOInterface) => void;
}

interface State {
    countdownValue: string;
}

export class IEOCard extends React.Component<Props, State> {
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

    public componentWillUnmount(): void {
        clearInterval(this.countdownInterval);
    }

    public render() {
        const {
            currency_id,
            name,
            state,
        } = this.props.ieo;
        const { currency } = this.props;

        return (
            <div className="pg-ieo__card" onClick={this.handleClick}>
                <div className="pg-ieo__card-header">
                    {currency && <img className="pg-ieo__card-header__icon" src={currency.icon_url} />}
                    <span className="pg-ieo__card-header__text">{currency_id && currency_id.toUpperCase()}</span>
                </div>
                <div className="pg-ieo__card-content">
                    <span className="pg-ieo__card-content__title">{name}</span>
                    <span className="pg-ieo__card-content__text">info</span>
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
        } = this.props.ieo;

        return (
            <div className="pg-ieo__card-content-block">
                <div className="pg-ieo__card-content-block__row">
                    <span className="pg-ieo__card-content-block__text">Goal</span>
                    <span className="pg-ieo__card-content-block__text text-bold">
                        {supply} {currency_id && currency_id.toUpperCase()}
                    </span>
                </div>
                <div className="pg-ieo__card-content-block__row">
                    <span className="pg-ieo__card-content-block__text">Start date</span>
                    <span className="pg-ieo__card-content-block__text text-bold">
                        {localeDate(starts_at, 'fullDate')}
                    </span>
                </div>
                <div className="pg-ieo__card-content-block__row">
                    <span className="pg-ieo__card-content-block__text">End date</span>
                    <span className="pg-ieo__card-content-block__text text-bold">
                        {localeDate(finishes_at, 'fullDate')}
                    </span>
                </div>
            </div>
        );
    };

    private renderInProgress = () => {
        const { supply, currency_id } = this.props.ieo;

        return (
            <div className="pg-ieo__card-content-block">
                <div className="pg-ieo__card-content-block__row">
                    <span className="pg-ieo__card-content-block__text">
                        Goal
                    </span>
                    <span className="pg-ieo__card-content-block__text text-bold">
                        {supply} {currency_id && currency_id.toUpperCase()}
                    </span>
                </div>
                {this.renderProgressBar()}
            </div>
        );
    };

    private renderFinished = () => {
        const { tokens_ordered, pairs} = this.props.ieo;
        const { currency } = this.props;
        const amountOfQuote = tokens_ordered && currency && Decimal.format(+tokens_ordered * +pairs[0].price, currency.precision);

        return (
            <div className="pg-ieo__card-content-block">
                <div className="pg-ieo__card-content-block__row">
                    <span className="pg-ieo__card-content-block__text">
                        Raised
                    </span>
                    <span className="pg-ieo__card-content-block__text text-bold">
                        {amountOfQuote} {amountOfQuote && pairs[0].quote_currency_id && pairs[0].quote_currency_id.toUpperCase()}
                    </span>
                </div>
                {this.renderProgressBar()}
            </div>
        );
    };

    private renderProgressBar = () => {
        const { countdownValue } = this.state;
        const { supply, tokens_ordered } = this.props.ieo;

        const countDownColorClass = classnames('content__ieo-countdown', {
            'content__ieo-countdown--red': countdownValue && (Number(countdownValue.split(':').pop()) % 2 === 0),
        });

        const percentage = Math.round(Number(tokens_ordered) * 100 / Number(supply));

        const percentageClass = classnames('filler', {
            'filler--zero': percentage < 5,
        });

        return (
            <React.Fragment>
                <div className="pg-ieo__card-content-block__row">
                    <span className="pg-ieo__card-content-block__text">
                        Countdown
                    </span>
                    <div className={countDownColorClass}>
                        {countdownValue === '00:00:00' ? 'End' : countdownValue}
                    </div>
                </div>
                <div className="progress-bar">
                    <div className={percentageClass} style={{width: `${percentage}%`}}>
                        {`${percentage}%`}
                    </div>
                </div>
            </React.Fragment>
        );
    };
}

