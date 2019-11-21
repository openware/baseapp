import * as React from 'react';
import {
    InjectedIntlProps,
    injectIntl,
} from 'react-intl';
import { RouterProps } from 'react-router';
import { withRouter } from 'react-router-dom';
import { Currency } from '../../../../modules';
import { IEOCard } from '../../components';
import { DataIEOInterface } from '../../modules';

interface OwnProps {
    state: string[];
    ieo: DataIEOInterface[];
    currencies: Currency[];
    handleFetchIEO: () => void;
}

type Props = RouterProps & InjectedIntlProps & OwnProps;

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
            const currencyItem = currencies.length && currencies.find(cur => cur.id === item.currency_id);

            return (
                <IEOCard
                    ieo={item}
                    onIEOSelect={this.handleSelectIEO}
                    translations={this.props.translation}
                    key={index}
                    currency={currencyItem}
                    handleFetchIEO={this.props.handleFetchIEO}
                />
            );
        }) : null;
    }

    private handleSelectIEO = (ieo: DataIEOInterface) => {
        window.console.log(ieo);
    };
}
// tslint:disable-next-line:no-any
export const IEOListElement = injectIntl(withRouter(IEOListContainer as any));
