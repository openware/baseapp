import classnames from 'classnames';
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { connect, MapStateToProps } from 'react-redux';
import {
    Market,
    RootState,
    selectCurrentColorTheme,
    selectCurrentMarket,
} from '../../../modules';
import {
    ArrowIcon,
} from '../icons/ArrowIcon';
import {
    MarketsList,
} from './MarketsList';
import {
    MarketsTabs,
} from './MarketsTabs';

interface ReduxProps {
    colorTheme: string;
    currentMarket?: Market;
}

interface State {
    isOpen: boolean;
    searchFieldValue: string;
    marketsTabsSelectedValue: string;
}

class MarketSelectorComponent extends React.Component<ReduxProps, State> {
    public readonly state = {
        isOpen: false,
        searchFieldValue: '',
        marketsTabsSelectedValue: '',
    };

    public render() {
        const {
            colorTheme,
            currentMarket,
        } = this.props;
        const {
            isOpen,
            searchFieldValue,
            marketsTabsSelectedValue,
        } = this.state;

        const iconClassName = classnames({
            'pg-trading-header-selector-icon-open': isOpen,
            'pg-trading-header-selector-icon-close': !isOpen,
        });
        const iconImgClassName = classnames({
            'pg-trading-header-selector-icon-img-open': isOpen,
            'pg-trading-header-selector-icon-img-close': !isOpen,
        });
        const listClassName = classnames({
            'pg-trading-header-selector-list-container-open': isOpen,
            'pg-trading-header-selector-list-container-close': !isOpen,
        });
        const searchSelectorClassName = classnames({
            'pg-trading-header-selector-search': isOpen,
            'pg-trading-header-selector-search-closed': !isOpen,
        });
        return (
            <div className="pg-trading-header-selector-container">
                <div className="pg-trading-header-selector" onClick={this.handleOpenSelector}>
                    <div className="pg-trading-header-selector-market">
                        {currentMarket && currentMarket.name}
                    </div>
                    <div className="pg-trading-header-selector-title">
                        <FormattedMessage id="page.body.trade.toolBar.selectMarket" />
                    </div>
                    <div className={iconClassName}>
                        <div className={iconImgClassName}>
                            <ArrowIcon color={isOpen ? (colorTheme === 'basic' ? '#FFFFFF' : '#2F2854') : '#737F92'}/>
                        </div>
                    </div>
                </div>
                <div className={listClassName}>
                    <MarketsTabs onSelect={this.marketsTabsSelectHandler}/>
                    <MarketsList search={searchFieldValue} currencyQuote={marketsTabsSelectedValue}/>
                    <div className={'pg-trading-header-selector-search-wrapper'}>
                        <div className={searchSelectorClassName}>
                            <div className="pg-trading-header-selector-search-icon">
                                <img src={require('../icons/search.svg')} />
                            </div>
                            <input
                                className="pg-trading-header-selector-search-field"
                                onChange={this.searchFieldChangeHandler}
                                value={searchFieldValue}
                            />
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    private handleOpenSelector = () => {
        this.setState({
            isOpen: !this.state.isOpen,
        });
    }

    private searchFieldChangeHandler = e => {
        this.setState({
            searchFieldValue: e.target.value,
        });
    }

    private marketsTabsSelectHandler = value => {
        this.setState({
            marketsTabsSelectedValue: value,
        });
    }
}

const reduxProps: MapStateToProps<ReduxProps, {}, RootState> = state => ({
    colorTheme: selectCurrentColorTheme(state),
    currentMarket: selectCurrentMarket(state),
});

export const MarketSelector = connect<ReduxProps, {}, {}, RootState>(reduxProps)(MarketSelectorComponent);
