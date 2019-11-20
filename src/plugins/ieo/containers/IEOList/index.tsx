import * as React from 'react';
import {
    InjectedIntlProps,
    injectIntl,
} from 'react-intl';
import { connect, MapDispatchToProps } from 'react-redux';
import { RouterProps } from 'react-router';
import { withRouter } from 'react-router-dom';
import { RootState } from '../../../../modules';
import { IEOCard } from '../../components';
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

class IEOListContainer extends React.Component<Props> {

    public componentDidMount() {
        const {
            ieo,
        } = this.props;

        if (!ieo.length) {
            this.props.ieoFetch(['preparing', 'ongoing', 'distributing']);
        }
    }

    public render() {
        const { ieo } = this.props;

        return ieo.map((item, index) => {
            return (
                <IEOCard
                    ieo={item}
                    onIEOSelect={this.handleSelectIEO}
                    translations={this.props.translation}
                    key={index}
                />
            );
        });
    }

    private handleSelectIEO = (ieo: DataIEOInterface) => {
        window.console.log(ieo);
    };
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
export const IEOList = injectIntl(withRouter(connect(mapStateToProps, mapDispatchToProps)(IEOListContainer) as any));


type Props = ReduxProps & DispatchProps & RouterProps & InjectedIntlProps;
