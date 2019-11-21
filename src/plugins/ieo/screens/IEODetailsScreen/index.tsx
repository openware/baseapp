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
import { IEODetails } from '../../components/IEODetails';
import { IEOInfo } from '../../components/IEOInfo';
import { IEOProjectIntroduction } from '../../components/IEOProjectIntroduction';
import {
    DataIEOInterface,
    fetchItemIEO,
    selectCurrentIEO,
    selectIEOItem,
    selectIEOSuccess,
    setCurrentIEO,
} from '../../modules';

interface ReduxProps {
    currentIEO?: DataIEOInterface;
    ieo?: DataIEOInterface;
    ieoSuccess?: boolean;
    currencies: Currency[];
}

interface DispatchProps {
    fetchItemIEO: typeof fetchItemIEO;
    fetchCurrencies: typeof currenciesFetch;
    setCurrentIEO: typeof setCurrentIEO;
}

type Props = ReduxProps & DispatchProps & RouterProps;

class IEODetailsContainer extends React.Component<Props> {
    public componentDidMount() {
        const { history } = this.props;
        if (history.location.pathname) {
            const urlIEOId = getUrlPart(2, this.props.history.location.pathname);
            this.props.fetchItemIEO(urlIEOId);
        }
    }

    public componentWillReceiveProps(nextProps) {
        const { history } = this.props;

        if (history.location.pathname !== nextProps.history.location.pathname) {
            const urlIEOId = getUrlPart(2, nextProps.history.location.pathname);
            this.props.fetchItemIEO(urlIEOId);
        }
    }

    public render() {
        return (
            <div className="container pg-ieo-page">
                <div className="pg-ieo-page__info">
                    <IEOInfo />
                </div>
                <div className="pg-ieo-page__details">
                    <IEODetails />
                </div>
                <div className="pg-ieo-page__product-intiduction">
                    <IEOProjectIntroduction />
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state: RootState): ReduxProps => ({
    currentIEO: selectCurrentIEO(state),
    ieo: selectIEOItem(state),
    ieoSuccess: selectIEOSuccess(state),
    currencies: selectCurrencies(state),
});

const mapDispatchToProps: MapDispatchToProps<DispatchProps, {}> = dispatch => ({
    fetchItemIEO: payload => dispatch(fetchItemIEO(payload)),
    fetchCurrencies: () => dispatch(currenciesFetch()),
    setCurrentIEO: payload => dispatch(setCurrentIEO(payload)),
});

// tslint:disable-next-line:no-any
export const IEODetailsScreen = withRouter(connect(mapStateToProps, mapDispatchToProps)(IEODetailsContainer) as any);

