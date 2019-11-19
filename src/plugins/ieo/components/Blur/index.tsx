import classnames from 'classnames';
import * as React from 'react';
import { getCountdownDate } from '../../../../helpers';
import { DataIEOInterface } from '../../modules';

interface Props {
    className?: string;
    title?: string;
    ieo: DataIEOInterface;
}

interface State {
    countdownValue: string;
}

export class Blur extends React.Component<Props, State> {
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
                if (ieo.state === 'distributing' && ieo.type === 'proportional') {
                    countdownDate = ieo.finishes_at;
                    this.setState({ countdownValue: getCountdownDate(countdownDate, '5m')});
                } else {
                    this.setState({ countdownValue: getCountdownDate(countdownDate)});
                }
            }, 1000);
        }
    }

    public componentWillReceiveProps(next: Props) {
        const { ieo } = this.props;

        if (next.ieo && next.ieo !== ieo) {
            clearInterval(this.countdownInterval);
            let countdownDate = next.ieo.starts_at;

            if (next.ieo.state === 'ongoing') {
                countdownDate = next.ieo.finishes_at;
            }

            this.countdownInterval = setInterval(() => {
                if (next.ieo.state === 'distributing' && ieo.type === 'proportional') {
                    countdownDate = next.ieo.finishes_at;
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
        const { className, title, ieo } = this.props;
        const { countdownValue } = this.state;

        const countDownColorClass = classnames('pg-blur__content__countdown', {
            'pg-blur__content__countdown--red': countdownValue && (Number(countdownValue.split(':').pop()) % 2 === 0),
        });


        return (
            <div className={`pg-blur ${className}`}>
                <div className="pg-blur__content">
                    {title ? <span className="pg-blur__content__title">{title}</span> : null}
                    {ieo.state !== 'finished' ? <div className={countDownColorClass}>{countdownValue}</div> : null}
                </div>
            </div>
        );
    }
}
