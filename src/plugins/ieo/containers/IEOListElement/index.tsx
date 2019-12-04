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
    setCurrentIEO,
} from '../../modules';

interface OwnProps {
    state: string[];
    ieo: DataIEOInterface[];
    handleFetchIEO: () => void;
    currencies: Currency[];
}

interface DispatchProps {
    setCurrentIEO: typeof setCurrentIEO;
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

        return ieo.length ? ieo.map((item, index) => (
            <IEOCard
                ieo={item}
                onIEOSelect={this.handleSelectIEO}
                key={index}
                handleFetchIEO={this.props.handleFetchIEO}
                onClick={this.handleSelectIEO}
                currencies={currencies}
            />)) : null;
    }

    private handleSelectIEO = (ieo: DataIEOInterface) => {
        this.props.setCurrentIEO(ieo);
        ieo && this.props.history.push(`/ieo/${ieo.id}`);
    };
}

const mapDispatchToProps: MapDispatchToProps<DispatchProps, {}> = dispatch => ({
    setCurrentIEO: payload => dispatch(setCurrentIEO(payload)),
});

// tslint:disable-next-line:no-any
export const IEOListElement = injectIntl(withRouter(connect(null, mapDispatchToProps)(IEOListContainer) as any));
