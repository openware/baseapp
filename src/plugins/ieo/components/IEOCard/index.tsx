import classnames from 'classnames';
import * as React from 'react';
import { getCountdownDate, localeDate } from '../../../../helpers';
import { DataIEOInterface } from '../../modules';

interface Props {
    ieo: DataIEOInterface;
    iconUrl?: string | null;
    translations;
    onIEOSelect: (ieo: DataIEOInterface) => void;
    handleFetchIEO: () => void;
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
        const { iconUrl } = this.props;

        return (
            <div className="pg-ieo__card">
                <div className="pg-ieo__card-header">
                    {iconUrl && <img className="pg-ieo__card-header__icon" src={iconUrl} />}
                    <span className="pg-ieo__card-header__text">{currency_id}</span>
                </div>
                <div className="pg-ieo__card-content">
                    <span className="pg-ieo__card-content__title">{name}</span>
                    <span className="pg-ieo__card-content__text">info</span>
                    {state === 'preparing' ? this.renderPreparingItem() : this.renderItemWithProgressBar()}
                </div>
            </div>
        );
    }

    private renderItemWithProgressBar = () => {
        const { countdownValue } = this.state;
        const {
            supply,
            tokens_ordered,
            currency_id,
        } = this.props.ieo;

        const countDownColorClass = classnames('content__ieo-countdown', {
            'content__ieo-countdown--red': countdownValue && (Number(countdownValue.split(':').pop()) % 2 === 0),
        });

        const percentage = Math.round(Number(tokens_ordered) * 100 / Number(supply));

        const percentageClass = classnames('filler', {
            'filler--zero': percentage < 5,
        });

        return (
            <div className="pg-ieo__card-content-block">
                <div className={countDownColorClass}>{countdownValue}</div>
                <div className="progress-bar">
                    <div className={percentageClass} style={{width: `${percentage}%`}}>
                        {`${percentage}%`}
                    </div>
                </div>
                <div className="progress-data">
                    <span>{tokens_ordered} {currency_id}</span>
                    <span>{supply} {currency_id}</span>
                </div>
            </div>
        );
    };

    private renderPreparingItem = () => {
        const {
            starts_at,
            finishes_at,
            supply,
        } = this.props.ieo;

        return (
            <div className="pg-ieo__card-content-block">
                <div className="pg-ieo__card-content-block__row">
                    <span className="pg-ieo__card-content-block__text">Goal</span>
                    <span className="pg-ieo__card-content-block__text text-bold">{supply}</span>
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
}

