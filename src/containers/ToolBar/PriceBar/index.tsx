import * as React from 'react';
import { FormattedMessage } from 'react-intl';

interface Props {
    percentage: number;
    lastPrice?: string;
    bidUnit?: string;
}

export class PriceBar extends React.Component<Props> {
    public render() {
        const { percentage, lastPrice, bidUnit } = this.props;
        const gap = 18;
        const position = percentage > 50 ? 'right' : 'left';
        const positionValue =
            position === 'left'
                ? percentage < gap
                    ? '0'
                    : `${percentage - gap}%`
                : percentage + gap > 100
                ? '0'
                : `${100 - percentage - gap}%`;
        const style = {};
        style[position] = positionValue;

        return (
            <div className="pg-trading-header-price-bar">
                <div className="pg-trading-header-price-bar-filler">
                    <div className="pg-trading-header-price-bar-filler-left" style={{ width: `${percentage}%` }} />
                    <div className="pg-trading-header-price-bar-filler-cursor" />
                    <div className="pg-trading-header-price-bar-text" style={style}>
                        <FormattedMessage id="page.body.trade.toolBar.lastPrice" />: {lastPrice} {bidUnit}
                    </div>
                    <div
                        className="pg-trading-header-price-bar-filler-right"
                        style={{ width: `${100 - percentage}%` }}
                    />
                </div>
            </div>
        );
    }
}
