import { History } from 'history';
import * as React from 'react';
import { InjectedIntlProps, injectIntl } from 'react-intl';
import { connect, MapDispatchToPropsFunction } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { LogoIcon } from '../../assets/images/LogoIcon';
import {
    Market,
    RootState,
    selectCurrentColorTheme,
    selectCurrentMarket,
    selectMarketSelectorState,
    selectMobileWalletUi,
    selectSidebarState,
    setMobileWalletUi,
    toggleMarketSelector,
    toggleSidebar,
} from '../../modules';
import { HeaderToolbar } from '../HeaderToolbar';
import { NavBar } from '../NavBar';
import { showLanding } from '../../api';

interface ReduxProps {
    currentMarket: Market | undefined;
    colorTheme: string;
    mobileWallet: string;
    sidebarOpened: boolean;
    marketSelectorOpened: boolean;
}

interface DispatchProps {
    setMobileWalletUi: typeof setMobileWalletUi;
    toggleSidebar: typeof toggleSidebar;
    toggleMarketSelector: typeof toggleMarketSelector;
}

interface HistoryProps {
    history: History;
}

type Props = ReduxProps & HistoryProps & DispatchProps & InjectedIntlProps;

class Head extends React.Component<Props> {
    public render() {
        const {mobileWallet } = this.props;
        const tradingCls = window.location.pathname.includes('/trading') ? 'pg-container-trading' : '';
        const shouldRenderHeader = !['/confirm'].some(r => window.location.pathname.includes(r)) && window.location.pathname !== '/';

        return (
            <React.Fragment>
            {shouldRenderHeader &&
                <header className={`pg-header`}>
                    <div className={`pg-container pg-header__content ${tradingCls}`}>
                        <div
                            className={`pg-sidebar__toggler ${mobileWallet && 'pg-sidebar__toggler-mobile'}`}
                            onClick={this.openSidebar}
                        >
                            <span className="pg-sidebar__toggler-item"/>
                            <span className="pg-sidebar__toggler-item"/>
                            <span className="pg-sidebar__toggler-item"/>
                        </div>
                        <div onClick={e => this.redirectToLanding()} className="pg-header__logo">
                            <div className="pg-logo">
                                <LogoIcon className="pg-logo__img" />
                            </div>
                        </div>
                        {this.renderMarketToggler()}
                        <div className="pg-header__location">
                            {mobileWallet ? <span>{mobileWallet}</span> : <span>{window.location.pathname.split('/')[1]}</span>}
                        </div>
                        {this.renderMobileWalletNav()}
                        <div className="pg-header__navbar">
                            {this.renderMarketToolbar()}
                            <NavBar onLinkChange={this.closeMenu}/>
                        </div>
                    </div>
                </header>}
          </React.Fragment>
        );
    }

    public renderMobileWalletNav = () => {
        const { colorTheme, mobileWallet } = this.props;
        const isLight = colorTheme === 'light' ? 'Light' : '';

        return mobileWallet && (
            <div onClick={this.backWallets} className="pg-header__toggler">
                <img alt="" src={require(`./back${isLight}.svg`)} />
            </div>
        );
    };

    public translate = (id: string) => {
        return id ? this.props.intl.formatMessage({ id }) : '';
    };

    private renderMarketToolbar = () => {
        if (!window.location.pathname.includes('/trading/')) {
            return null;
        }

        return <HeaderToolbar/>;
    };

    private renderMarketToggler = () => {
        const { currentMarket, marketSelectorOpened, colorTheme } = this.props;
        const isLight = colorTheme === 'light';
        if (!window.location.pathname.includes('/trading/')) {
            return null;
        }

        return (
            <div className="pg-header__market-selector-toggle" onClick={this.props.toggleMarketSelector}>
                <p className="pg-header__market-selector-toggle-value">
                    {currentMarket && currentMarket.name}
                </p>
                {marketSelectorOpened ? (
                    <img src={require(`./arrows/arrowBottom${isLight ? 'Light' : ''}.svg`)} alt="arrow"/>
                ) : (
                    <img src={require(`./arrows/arrowRight${isLight ? 'Light' : ''}.svg`)} alt="arrow"/>
                )}
            </div>
        );
    };

    private redirectToLanding = () => {
        this.props.toggleSidebar(false);
        this.props.history.push(`${showLanding() ? '/' : '/trading'}`);
    }

    private openSidebar = () => this.props.toggleSidebar(!this.props.sidebarOpened);

    private backWallets = () => this.props.setMobileWalletUi('');

    private closeMenu = (e: any) => this.props.setMobileWalletUi('');
}

const mapStateToProps = (state: RootState): ReduxProps => ({
    currentMarket: selectCurrentMarket(state),
    colorTheme: selectCurrentColorTheme(state),
    mobileWallet: selectMobileWalletUi(state),
    sidebarOpened: selectSidebarState(state),
    marketSelectorOpened: selectMarketSelectorState(state),
});

const mapDispatchToProps: MapDispatchToPropsFunction<DispatchProps, {}> =
    dispatch => ({
        setMobileWalletUi: payload => dispatch(setMobileWalletUi(payload)),
        toggleSidebar: payload => dispatch(toggleSidebar(payload)),
        toggleMarketSelector: () => dispatch(toggleMarketSelector()),
    });

const Header = injectIntl(withRouter(connect(mapStateToProps, mapDispatchToProps)(Head) as any) as any);

export {
    Header,
};
