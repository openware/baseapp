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
import { IEOCard } from '../../components';
import {
    DataIEOInterface,
    fetchIEO,
    selectCurrentIEO,
    selectIEO,
    selectIEOSuccess,
} from '../../modules';

interface OwnProps {
    state: string[];
}

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

type Props = ReduxProps & DispatchProps & RouterProps & InjectedIntlProps & OwnProps;

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

    public render() {
        return (
            <div className="pg-ieo-page__list">
                {this.getIEOList()}
            </div>
        );
    }

    private getIEOList = () => {
        const { ieo, currencies } = this.props;

        return ieo.map((item, index) => {
            const currencyItem = currencies.length && currencies.find(cur => cur.id === item.currency_id);

            return (
                <IEOCard
                    ieo={item}
                    onIEOSelect={this.handleSelectIEO}
                    translations={this.props.translation}
                    key={index}
                    iconUrl={currencyItem && currencyItem.icon_url}
                    handleFetchIEO={this.handleFetchIEO}
                />
            );
        });
    }

    private handleSelectIEO = (ieo: DataIEOInterface) => {
        window.console.log(ieo);
    };

    private handleFetchIEO = () => {
        const { state } = this.props;
        this.props.ieoFetch(state);
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
export const IEOListElement = injectIntl(withRouter(connect(mapStateToProps, mapDispatchToProps)(IEOListContainer) as any));
