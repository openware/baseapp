import * as React from 'react';
import { connect, MapDispatchToProps } from 'react-redux';
import { RouterProps } from 'react-router';
import { withRouter } from 'react-router-dom';
import { getUrlPart } from '../../../../helpers';
import {
    currenciesFetch,
    Currency,
    RootState,
    selectCurrencies,
} from '../../../../modules';
import { IEODetails, IEOProjectIntroduction } from '../../components';
import { IEOInfo } from '../../containers';
import {
    DataIEOInterface,
    fetchItemIEO,
    selectCurrentIEO,
    selectIEOItem,
    selectIEOLoading,
    selectIEOSuccess,
    setCurrentIEO,
} from '../../modules';

interface ReduxProps {
    currentIEO?: DataIEOInterface;
    ieo?: DataIEOInterface;
    ieoSuccess?: boolean;
    currencies: Currency[];
    loading: boolean;
}

interface DispatchProps {
    fetchItemIEO: typeof fetchItemIEO;
    fetchCurrencies: typeof currenciesFetch;
    setCurrentIEO: typeof setCurrentIEO;
}

type Props = ReduxProps & DispatchProps & RouterProps;

class IEODetailsContainer extends React.Component<Props> {
    public componentDidMount() {
        const { history, currencies } = this.props;
        if (history.location.pathname) {
            const urlIEOId = getUrlPart(2, this.props.history.location.pathname);
            this.props.fetchItemIEO(urlIEOId);
        }

        if (!currencies.length) {
            this.props.fetchCurrencies();
        }
    }

    public componentWillReceiveProps(nextProps) {
        const { history, currencies } = this.props;

        if (history.location.pathname !== nextProps.history.location.pathname) {
            const urlIEOId = getUrlPart(2, nextProps.history.location.pathname);
            this.props.fetchItemIEO(urlIEOId);
        }

        if (!nextProps.currencies.length && JSON.stringify(nextProps.currencies) !== JSON.stringify(currencies)) {
            this.props.fetchCurrencies();
        }
    }

    public render() {
        const { ieo, loading } = this.props;

        return (
            <div className="container pg-ieo-page">
                {ieo && !loading ? this.renderContent() : null}
            </div>
        );
    }

    private renderContent = () => {
        const { currencies, ieo } = this.props;
        const currencyItem = currencies.length && ieo && currencies.find(cur => cur.id === ieo.currency_id);

        return (
            <React.Fragment>
                <div className="pg-ieo-page__info">
                    <IEOInfo
                        currency={currencyItem}
                        ieo={ieo}
                    />
                </div>
                <div className="pg-ieo-page__details">
                    <IEODetails />
                </div>
                <div className="pg-ieo-page__product-intiduction">
                    <IEOProjectIntroduction />
                </div>
            </React.Fragment>
        );
    }
}

const mapStateToProps = (state: RootState): ReduxProps => ({
    currentIEO: selectCurrentIEO(state),
    ieo: selectIEOItem(state),
    ieoSuccess: selectIEOSuccess(state),
    currencies: selectCurrencies(state),
    loading: selectIEOLoading(state),
});

const mapDispatchToProps: MapDispatchToProps<DispatchProps, {}> = dispatch => ({
    fetchItemIEO: payload => dispatch(fetchItemIEO(payload)),
    fetchCurrencies: () => dispatch(currenciesFetch()),
    setCurrentIEO: payload => dispatch(setCurrentIEO(payload)),
});

// tslint:disable-next-line:no-any
export const IEODetailsScreen = withRouter(connect(mapStateToProps, mapDispatchToProps)(IEODetailsContainer) as any);

