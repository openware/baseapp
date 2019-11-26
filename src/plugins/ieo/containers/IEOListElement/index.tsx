import * as React from 'react';
import {
    InjectedIntlProps,
    injectIntl,
} from 'react-intl';
import { connect, MapDispatchToProps } from 'react-redux';
import { RouterProps } from 'react-router';
import { withRouter } from 'react-router-dom';
import { Currency } from '../../../../modules';
import { IEOCard } from '../../components';
import {
    DataIEOInterface,
    resetIEOList,
    setCurrentIEO,
} from '../../modules';

interface OwnProps {
    state: string[];
    ieo: DataIEOInterface[];
    currencies: Currency[];
    handleFetchIEO: () => void;
}

interface DispatchProps {
    setCurrentIEO: typeof setCurrentIEO;
    resetIEOList: typeof resetIEOList;
}

type Props = DispatchProps & RouterProps & InjectedIntlProps & OwnProps;

class IEOListContainer extends React.Component<Props> {
    public render() {
        return (
            <div className="pg-ieo-page__list">
                {this.getIEOList()}
            </div>
        );
    }

    private getIEOList = () => {
        const { ieo, currencies } = this.props;

        return ieo.length ? ieo.map((item, index) => {
            const currencyItem = item && currencies.length && currencies.find(cur => cur.id === item.currency_id);

            return item ? (
                <IEOCard
                    ieo={item}
                    onIEOSelect={this.handleSelectIEO}
                    key={index}
                    currency={currencyItem}
                    handleFetchIEO={this.props.handleFetchIEO}
                    onClick={this.handleSelectIEO}
                />
            ) : null;
        }) : null;
    }

    private handleSelectIEO = (ieo: DataIEOInterface) => {
        this.props.setCurrentIEO(ieo);
        this.props.resetIEOList();
        ieo && this.props.history.push(`/ieo/${ieo.id}`);
    };
}

const mapDispatchToProps: MapDispatchToProps<DispatchProps, {}> = dispatch => ({
    setCurrentIEO: payload => dispatch(setCurrentIEO(payload)),
    resetIEOList: () => dispatch(resetIEOList()),
});

// tslint:disable-next-line:no-any
export const IEOListElement = injectIntl(withRouter(connect(null, mapDispatchToProps)(IEOListContainer) as any));
