import * as React from 'react';
import {
    InjectedIntlProps,
    injectIntl,
} from 'react-intl';
import { connect, MapDispatchToProps } from 'react-redux';
import { RouterProps } from 'react-router';
import { withRouter } from 'react-router-dom';
import { RootState } from '../../../../modules';
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
}

interface DispatchProps {
    ieoFetch: typeof fetchIEO;
}

type Props = ReduxProps & DispatchProps & RouterProps & InjectedIntlProps;

class IEOListContainer extends React.Component<Props> {
    public translate = (e: string) => {
        return this.props.intl.formatMessage({id: e});
    };

    public render() {
        return (
            <div className="pg-ieo-page container">
                <span className="pg-ieo-page__header">
                    {this.translate('page.body.trade.header.upcoming')}
                </span>
                <IEOListElement state={[ 'preparing' ]} />
                <span className="pg-ieo-page__header">
                    {this.translate('page.body.trade.header.inProgress')}
                </span>
                <IEOListElement state={[ 'ongoing', 'distributing' ]} />
                <span className="pg-ieo-page__header">
                    {this.translate('page.body.trade.header.past')}
                </span>
                <IEOListElement state={[ 'finished' ]} />
            </div>
        );
    }
}

const mapStateToProps = (state: RootState): ReduxProps => ({
    currentIEO: selectCurrentIEO(state),
    ieo: selectIEO(state),
    ieoSuccess: selectIEOSuccess(state),
});

const mapDispatchToProps: MapDispatchToProps<DispatchProps, {}> = dispatch => ({
    ieoFetch: payload => dispatch(fetchIEO(payload)),
});

// tslint:disable-next-line:no-any
export const IEOListScreen = injectIntl(withRouter(connect(mapStateToProps, mapDispatchToProps)(IEOListContainer) as any));
