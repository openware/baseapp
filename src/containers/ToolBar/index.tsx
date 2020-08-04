import * as React from 'react';
import { injectIntl } from 'react-intl';
import {
    connect,
    MapDispatchToPropsFunction,
    MapStateToProps,
} from 'react-redux';
import { IntlProps } from '../../index';
import {
    Market,
    RootState,
    selectCurrentMarket,
    selectMarkets,
    selectMarketTickers,
    Ticker,
} from '../../modules';
import { resetLayouts } from '../../modules/public/gridLayout';
import {
    MarketSelector,
} from './MarketSelector';

interface ReduxProps {
    currentMarket?: Market;
    markets: Market[];
    marketTickers: {
        [key: string]: Ticker,
    };
}

interface State {
    isOpen: boolean;
}

interface DispatchProps {
    resetLayouts: typeof resetLayouts;
}

type Props = DispatchProps & ReduxProps & IntlProps;

class ToolBarComponent extends React.Component<Props, State> {
    public readonly state = {
        isOpen: false,
    };

    public translate = (id: string) => {
        return id ? this.props.intl.formatMessage({ id }) : '';
    };

    public render() {
        return (
            <div className="pg-trading-header-container">
                <div className="pg-trading-header-container-selector">
                    <MarketSelector/>
                </div>
            </div>
        );
    }
}

const reduxProps: MapStateToProps<ReduxProps, {}, RootState> = state => ({
    markets: selectMarkets(state),
    currentMarket: selectCurrentMarket(state),
    marketTickers: selectMarketTickers(state),
});

const mapDispatchToProps: MapDispatchToPropsFunction<DispatchProps, {}> = dispatch => ({
    resetLayouts: payload => dispatch(resetLayouts(payload)),
});

export const ToolBar = injectIntl(connect(reduxProps, mapDispatchToProps)(ToolBarComponent)) as any;
