import * as React from 'react';
import {
    InjectedIntlProps,
    injectIntl,
} from 'react-intl';
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
import { IEODetails, IEOProjectIntroduction, OrderExecuteSuccessModal } from '../../components';
import { IEOInfo } from '../../containers';
import {
    DataIEOInterface,
    fetchItemIEO,
    OrderIEOData,
    selectCurrentIEO,
    selectIEOLoading,
} from '../../modules';
const backIcon = require('../../assets/images/back-icon.svg');

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
    rangerConnect: typeof rangerConnectFetch;
}

interface State {
    showOrderExecuteModal: boolean;
    orderExecuteModalData?: OrderIEOData;
}

type Props = ReduxProps & DispatchProps & RouterProps & InjectedIntlProps;

class IEODetailsContainer extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            showOrderExecuteModal: false,
        };
    }

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
        const { currencies, currentIEO, userLoggedIn } = this.props;
        const { orderExecuteModalData, showOrderExecuteModal } = this.state;
        const quoteCurrency = currencies.length && currentIEO && currencies.find(currency => currency.id && currency.id.toLowerCase() === currentIEO.pairs[0].quote_currency_id && currentIEO.pairs[0].quote_currency_id.toLowerCase());

        return (
            <React.Fragment>
                <div className="pg-currentIEO-page__back" onClick={this.handleClickBack}>
                    <img src={backIcon} className="back-icon" alt="back" />&nbsp;&nbsp;
                    <span className="pg-currentIEO-page__back-text">
                        {this.translate('page.body.ieo.details.header.backToList')}
                    </span>
                </div>
                <div className="pg-currentIEO-page__info">
                    <IEOInfo
                        currency={quoteCurrency}
                        ieo={currentIEO}
                        isLoggedIn={userLoggedIn}
                        handleFetchIEO={this.props.fetchItemIEO}
                        toggleOrderExecuteModal={this.handleToggleOrderExecuteModal}
                    />
                </div>
                <div className="pg-currentIEO-page__details">
                    <IEODetails currentIEO={currentIEO} currencies={currencies} />
                </div>
                <div className="pg-currentIEO-page__product-intiduction">
                    <IEOProjectIntroduction introduction={currentIEO.metadata && currentIEO.metadata.introduction} />
                </div>
                {showOrderExecuteModal && orderExecuteModalData ? this.renderOrderExecuteSuccessModal(orderExecuteModalData) : null}
            </React.Fragment>
        );
    };

    private renderOrderExecuteSuccessModal = (orderExecuteModalData: OrderIEOData) => {
        return (
            <OrderExecuteSuccessModal
                data={orderExecuteModalData}
                translate={this.translate}
                toggleModal={() => this.handleToggleOrderExecuteModal()}
            />
        );
    };

    private handleClickBack = () => {
        this.props.history.push('/ieo');
    };

    private handleToggleOrderExecuteModal = (data?: OrderIEOData) => {
        this.setState({ orderExecuteModalData: data });
        this.setState(prevState => ({ showOrderExecuteModal: !prevState.showOrderExecuteModal }));
    };

    private translate = (e: string) => {
        return this.props.intl.formatMessage({ id: e });
    };
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
    rangerConnect: (payload: RangerConnectFetch['payload']) => dispatch(rangerConnectFetch(payload)),
});

// tslint:disable-next-line:no-any
export const IEODetailsScreen = injectIntl(withRouter(connect(mapStateToProps, mapDispatchToProps)(IEODetailsContainer) as any));

