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
    RootState,
    selectUserLoggedIn,
} from '../../../../modules';
import { rangerConnectFetch } from '../../../../modules/public/ranger';
import { RangerState } from '../../../../modules/public/ranger/reducer';
import { selectRanger } from '../../../../modules/public/ranger/selectors';
import { IEOListElement } from '../../containers';
import {
    DataIEOInterface,
    fetchIEO,
    ieoFetchMetadata,
    selectIEO,
    selectIEOListNewId,
    selectIEOLoading,
    selectIEOSuccess,
} from '../../modules';

interface ReduxProps {
    ieo: DataIEOInterface[];
    ieoSuccess?: boolean;
    rangerState: RangerState;
    userLoggedIn: boolean;
    loading: boolean;
    newId?: string | number;
}

interface DispatchProps {
    ieoFetch: typeof fetchIEO;
    rangerConnect: typeof rangerConnectFetch;
    ieoFetchMetadata: typeof ieoFetchMetadata;
}

type Props = ReduxProps & DispatchProps & RouterProps & InjectedIntlProps;

class IEOListContainer extends React.Component<Props> {
    public componentDidMount() {
        setDocumentTitle('IEO');
        const { userLoggedIn, rangerState: { connected, withAuth } } = this.props;

        this.handleFetchIEO();

        if (!connected) {
            this.props.rangerConnect({ withAuth: userLoggedIn });
        }

        if (userLoggedIn && !withAuth) {
            this.props.rangerConnect({ withAuth: userLoggedIn });
        }
    }

    public componentWillReceiveProps(nextProps) {
        const { ieo, userLoggedIn, newId } = this.props;

        if (userLoggedIn !== nextProps.userLoggedIn) {
            this.props.rangerConnect({ withAuth: nextProps.userLoggedIn });
        }

        if (!nextProps.ieo.length && JSON.stringify(nextProps.ieo) !== JSON.stringify(ieo)) {
            this.handleFetchIEO();
        }

        if (nextProps.newId && nextProps.newId !== newId) {
            const index = nextProps.ieo.findIndex(el => String(el.id) === String(newId));
            if (index !== -1) {
                this.props.ieoFetchMetadata({ id: nextProps.ieo[index].id, currency_id: nextProps[index].currency_id });
            }
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
        const listPreparing = this.handleFilterIEO(['preparing']);
        const listInProgress = this.handleFilterIEO(['ongoing', 'distributing']);
        const listPast = this.handleFilterIEO(['finished']);

        return (
            <React.Fragment>
                {this.renderPreparing(listPreparing)}
                {this.renderInProgress(listInProgress)}
                {this.renderFinished(listPast)}
            </React.Fragment>
        );
    }

    private renderPreparing = listPreparing => (
        listPreparing.length ? (
            <React.Fragment>
                <span className="pg-ieo-page__header">{this.translate('page.body.trade.header.upcoming')}</span>
                <IEOListElement
                    state={[ 'preparing' ]}
                    ieo={listPreparing}
                    handleFetchIEO={this.handleFetchIEO}
                />
            </React.Fragment>
        ) : null
    );

    private renderInProgress = listInProgress => (
        listInProgress.length ? (
            <React.Fragment>
                <span className="pg-ieo-page__header">{this.translate('page.body.trade.header.inProgress')}</span>
                <IEOListElement
                    state={['ongoing', 'distributing']}
                    ieo={listInProgress}
                    handleFetchIEO={this.handleFetchIEO}
                />
            </React.Fragment>
        ) : null
    );

    private renderFinished = listPast => (
        listPast.length ? (
            <React.Fragment>
                <span className="pg-ieo-page__header">{this.translate('page.body.trade.header.past')}</span>
                <IEOListElement
                    state={[ 'finished' ]}
                    ieo={listPast}
                    handleFetchIEO={this.handleFetchIEO}
                />
            </React.Fragment>
        ) : null
    );

    private handleFilterIEO = (state: string[]) => {
        const { ieo } = this.props;

        return state.map(st => {
            return ieo.length && ieo.filter(item => state.includes(item.state));
        })[0];
    };

    private handleFetchIEO = () => {
        this.props.ieoFetch([ 'preparing', 'ongoing', 'distributing', 'finished' ]);
    };
}

const mapStateToProps: MapStateToProps<ReduxProps, {}, RootState> = state => ({
    ieo: selectIEO(state),
    ieoSuccess: selectIEOSuccess(state),
    rangerState: selectRanger(state),
    userLoggedIn: selectUserLoggedIn(state),
    loading: selectIEOLoading(state),
    newId: selectIEOListNewId(state),
});

const mapDispatchToProps: MapDispatchToProps<DispatchProps, {}> = dispatch => ({
    ieoFetch: payload => dispatch(fetchIEO(payload)),
    rangerConnect: payload => dispatch(rangerConnectFetch(payload)),
    ieoFetchMetadata: payload => dispatch(ieoFetchMetadata(payload)),
});

// tslint:disable-next-line:no-any
export const IEOListScreen = injectIntl(withRouter(connect(mapStateToProps, mapDispatchToProps)(IEOListContainer) as any));
