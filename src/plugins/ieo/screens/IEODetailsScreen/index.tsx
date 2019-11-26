import * as React from 'react';
import { connect, MapDispatchToProps } from 'react-redux';
import { RouterProps } from 'react-router';
import { withRouter } from 'react-router-dom';
import { getUrlPart, setDocumentTitle } from '../../../../helpers';
import {
    currenciesFetch,
    Currency,
    RootState,
    selectCurrencies,
    selectUserLoggedIn,
} from '../../../../modules';
import { rangerConnectFetch, RangerConnectFetch } from '../../../../modules/public/ranger';
import { RangerState } from '../../../../modules/public/ranger/reducer';
import { selectRanger } from '../../../../modules/public/ranger/selectors';
import { IEODetails, IEOProjectIntroduction } from '../../components';
import { IEOInfo } from '../../containers';
import {
    DataIEOInterface,
    fetchItemIEO,
    selectCurrentIEO,
    selectIEOLoading,
    setCurrentIEO,
} from '../../modules';

interface ReduxProps {
    currentIEO?: DataIEOInterface;
    currencies: Currency[];
    loading: boolean;
    userLoggedIn: boolean;
    rangerState: RangerState;
}

interface DispatchProps {
    fetchItemIEO: typeof fetchItemIEO;
    fetchCurrencies: typeof currenciesFetch;
    setCurrentIEO: typeof setCurrentIEO;
    rangerConnect: typeof rangerConnectFetch;
}

type Props = ReduxProps & DispatchProps & RouterProps;

class IEODetailsContainer extends React.Component<Props> {
    public componentDidMount() {
        setDocumentTitle('IEO Details');
        const { history, currencies, rangerState: { connected, withAuth }, userLoggedIn } = this.props;
        if (history.location.pathname) {
            const urlIEOId = getUrlPart(2, this.props.history.location.pathname);
            this.props.fetchItemIEO(urlIEOId);
        }

        if (!currencies.length) {
            this.props.fetchCurrencies();
        }

        if (!connected) {
            this.props.rangerConnect({ withAuth: userLoggedIn });
        }

        if (userLoggedIn && !withAuth) {
            this.props.rangerConnect({ withAuth: userLoggedIn });
        }
    }

    public componentWillReceiveProps(nextProps) {
        const { history, currencies, userLoggedIn } = this.props;

        if (userLoggedIn !== nextProps.userLoggedIn) {
            this.props.rangerConnect({ withAuth: nextProps.userLoggedIn });
        }

        if (history.location.pathname !== nextProps.history.location.pathname) {
            const urlIEOId = getUrlPart(2, nextProps.history.location.pathname);
            this.props.fetchItemIEO(urlIEOId);
        }

        if (!nextProps.currencies.length && JSON.stringify(nextProps.currencies) !== JSON.stringify(currencies)) {
            this.props.fetchCurrencies();
        }
    }

    public render() {
        const { currentIEO, loading } = this.props;

        return (
            <div className="container pg-currentIEO-page">
                {currentIEO && !loading ? this.renderContent() : null}
            </div>
        );
    }

    private renderContent = () => {
        const { currencies, currentIEO } = this.props;
        const currencyItem = currencies.length && currentIEO && currencies.find(cur => cur.id === currentIEO.currency_id);

        return (
            <React.Fragment>
                <div className="pg-currentIEO-page__info">
                    <IEOInfo
                        currency={currencyItem}
                        ieo={currentIEO}
                    />
                </div>
                <div className="pg-currentIEO-page__details">
                    <IEODetails />
                </div>
                <div className="pg-currentIEO-page__product-intiduction">
                    <IEOProjectIntroduction />
                </div>
            </React.Fragment>
        );
    }
}

const mapStateToProps = (state: RootState): ReduxProps => ({
    currentIEO: selectCurrentIEO(state),
    currencies: selectCurrencies(state),
    loading: selectIEOLoading(state),
    rangerState: selectRanger(state),
    userLoggedIn: selectUserLoggedIn(state),
});

const mapDispatchToProps: MapDispatchToProps<DispatchProps, {}> = dispatch => ({
    fetchItemIEO: payload => dispatch(fetchItemIEO(payload)),
    fetchCurrencies: () => dispatch(currenciesFetch()),
    setCurrentIEO: payload => dispatch(setCurrentIEO(payload)),
    rangerConnect: (payload: RangerConnectFetch['payload']) => dispatch(rangerConnectFetch(payload)),
});

// tslint:disable-next-line:no-any
export const IEODetailsScreen = withRouter(connect(mapStateToProps, mapDispatchToProps)(IEODetailsContainer) as any);

