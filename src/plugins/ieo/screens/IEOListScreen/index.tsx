import * as React from 'react';
import {
    InjectedIntlProps,
    injectIntl,
} from 'react-intl';
import { connect, MapDispatchToProps, MapStateToProps } from 'react-redux';
import { RouterProps } from 'react-router';
import { withRouter } from 'react-router-dom';
import { setDocumentTitle } from '../../../../helpers';
import {
    currenciesFetch,
    Currency,
    RootState,
    selectCurrencies,
    selectUserLoggedIn,
} from '../../../../modules';
import { rangerConnectFetch } from '../../../../modules/public/ranger';
import { RangerState } from '../../../../modules/public/ranger/reducer';
import { selectRanger } from '../../../../modules/public/ranger/selectors';
import { IEOListElement } from '../../containers';
import {
    DataIEOInterface,
    fetchIEO,
    selectIEO,
    selectIEOLoading,
    selectIEOSuccess,
} from '../../modules';

interface ReduxProps {
    ieo: DataIEOInterface[];
    ieoSuccess?: boolean;
    currencies: Currency[];
    rangerState: RangerState;
    userLoggedIn: boolean;
    loading: boolean;
}

interface DispatchProps {
    ieoFetch: typeof fetchIEO;
    fetchCurrencies: typeof currenciesFetch;
    rangerConnect: typeof rangerConnectFetch;
}

type Props = ReduxProps & DispatchProps & RouterProps & InjectedIntlProps;

class IEOListContainer extends React.Component<Props> {
    public componentDidMount() {
        setDocumentTitle('IEO');
        const { ieo, currencies, userLoggedIn, rangerState: { connected, withAuth } } = this.props;

        if (!ieo.length) {
            this.handleFetchIEO();
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
        const { currencies, ieo, userLoggedIn } = this.props;

        if (userLoggedIn !== nextProps.userLoggedIn) {
            this.props.rangerConnect({ withAuth: nextProps.userLoggedIn });
        }

        if (nextProps.currencies.length && JSON.stringify(nextProps.currencies) !== JSON.stringify(currencies)) {
            this.props.fetchCurrencies();
        }

        if (!nextProps.ieo.length && JSON.stringify(nextProps.ieo) !== JSON.stringify(ieo)) {
            this.handleFetchIEO();
        }
    }

    public translate = (e: string) => {
        return this.props.intl.formatMessage({id: e});
    };

    public render() {
        const { loading, ieo} = this.props;

        return (
            <div className="pg-ieo-page container">
                {!loading && ieo.length ? this.renderContent() : null}
            </div>

        );
    }

    private renderContent = () =>  {
        const { currencies } = this.props;

        return (
            <React.Fragment>
                <span className="pg-ieo-page__header">
                    {this.translate('page.body.trade.header.upcoming')}
                </span>
                <IEOListElement
                    state={[ 'preparing' ]}
                    currencies={currencies}
                    ieo={this.handleFilterIEO(['preparing'])}
                    handleFetchIEO={this.handleFetchIEO}
                />
                <span className="pg-ieo-page__header">
                    {this.translate('page.body.trade.header.inProgress')}
                </span>
                <IEOListElement
                    state={['ongoing', 'distributing']}
                    currencies={currencies}
                    ieo={this.handleFilterIEO(['ongoing', 'distributing'])}
                    handleFetchIEO={this.handleFetchIEO}
                />
                <span className="pg-ieo-page__header">
                    {this.translate('page.body.trade.header.past')}
                </span>
                <IEOListElement
                    state={[ 'finished' ]}
                    currencies={currencies}
                    ieo={this.handleFilterIEO(['finished'])}
                    handleFetchIEO={this.handleFetchIEO}
                />
            </React.Fragment>
        );
    }

    private handleFilterIEO = (state: string[]) => {
        const { ieo } = this.props;

        return state.map(st => {
            return ieo.length && ieo.filter(item => item.state === st)[0];
        });
    };

    private handleFetchIEO = () => {
        this.props.ieoFetch([ 'preparing', 'ongoing', 'distributing', 'finished' ]);
    };
}

const mapStateToProps: MapStateToProps<ReduxProps, {}, RootState> = state => ({
    ieo: selectIEO(state),
    ieoSuccess: selectIEOSuccess(state),
    currencies: selectCurrencies(state),
    rangerState: selectRanger(state),
    userLoggedIn: selectUserLoggedIn(state),
    loading: selectIEOLoading(state),
});

const mapDispatchToProps: MapDispatchToProps<DispatchProps, {}> = dispatch => ({
    ieoFetch: payload => dispatch(fetchIEO(payload)),
    fetchCurrencies: () => dispatch(currenciesFetch()),
    rangerConnect: payload => dispatch(rangerConnectFetch(payload)),
});

// tslint:disable-next-line:no-any
export const IEOListScreen = injectIntl(withRouter(connect(mapStateToProps, mapDispatchToProps)(IEOListContainer) as any));
