import * as React from 'react';
import {
    InjectedIntlProps,
    injectIntl,
} from 'react-intl';
import { connect, MapDispatchToProps } from 'react-redux';
import { RouterProps } from 'react-router';
import { withRouter } from 'react-router-dom';
import {
    currenciesFetch,
    Currency,
    RootState,
    selectCurrencies,
} from '../../../../modules';
import { IEOListElement } from '../../containers';
import {
    DataIEOInterface,
    fetchIEO,
    selectCurrentIEO,
    selectIEO,
    selectIEOSuccess,
} from '../../modules';

interface ReduxProps {
    currentIEO?: DataIEOInterface;
    ieo: DataIEOInterface[];
    ieoSuccess?: boolean;
    currencies: Currency[];
}

interface DispatchProps {
    ieoFetch: typeof fetchIEO;
    fetchCurrencies: typeof currenciesFetch;
}

type Props = ReduxProps & DispatchProps & RouterProps & InjectedIntlProps;

class IEOListContainer extends React.Component<Props> {
    public componentDidMount() {
        const { ieo, currencies } = this.props;

        if (!ieo.length) {
            this.handleFetchIEO();
        }

        if (!currencies.length) {
            this.props.fetchCurrencies();
        }
    }

    public componentWillReceiveProps(nextProps) {
        const { currencies, ieo } = this.props;

        if (!nextProps.currencies.length && JSON.stringify(nextProps.currencies) !== JSON.stringify(currencies)) {
            this.props.fetchCurrencies();
        }

        if (!nextProps.ieo.length && JSON.stringify(nextProps.ieo) !== JSON.stringify(ieo)) {
            this.props.handleFetchIEO();
        }
    }

    public translate = (e: string) => {
        return this.props.intl.formatMessage({id: e});
    };

    public render() {
        const { currencies } = this.props;

        return (
            <div className="pg-ieo-page container">
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
            </div>
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

const mapStateToProps = (state: RootState): ReduxProps => ({
    currentIEO: selectCurrentIEO(state),
    ieo: selectIEO(state),
    ieoSuccess: selectIEOSuccess(state),
    currencies: selectCurrencies(state),
});

const mapDispatchToProps: MapDispatchToProps<DispatchProps, {}> = dispatch => ({
    ieoFetch: payload => dispatch(fetchIEO(payload)),
    fetchCurrencies: () => dispatch(currenciesFetch()),
});

// tslint:disable-next-line:no-any
export const IEOListScreen = injectIntl(withRouter(connect(mapStateToProps, mapDispatchToProps)(IEOListContainer) as any));
