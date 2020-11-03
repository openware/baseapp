import * as React from 'react';
import { injectIntl } from 'react-intl';
import { connect, MapStateToProps } from 'react-redux';
import { RouterProps } from 'react-router';
import { withRouter } from 'react-router-dom';
import { compose } from 'redux';

import { IntlProps } from '../../';
import { BackgroundMaintenance } from '../../assets/images/BackgroundMaintenance';
import { LogoIcon } from '../../assets/images/LogoIcon';
import { setDocumentTitle } from '../../helpers';
import { RootState, selectPlatformAccessStatus } from '../../modules';

interface ReduxProps {
    status: string;
}

type Props = RouterProps & IntlProps & ReduxProps;

class Maintenance extends React.Component<Props> {
    public componentDidMount() {
        setDocumentTitle('500');
        if (this.props.status.length && this.props.status !== 'maintenance') {
            this.props.history.replace('/');
        }
    }

    public componentWillReceiveProps(nextProps: Props) {
        if (!this.props.status.length && nextProps.status.length && nextProps.status !== 'maintenance') {
            this.props.history.replace('/');
        }
    }

    public render() {
        return (
            <div className="pg-maintenance-screen">
                <div className="pg-maintenance-screen__container">
                    <div className="pg-maintenance-screen__container-header">
                        <LogoIcon />
                    </div>
                    <div className="pg-maintenance-screen__container-body">
                        <div className="pg-maintenance-screen__container-body-title">
                            {this.translate('page.body.500.maintenance')}
                        </div>
                        <div className="pg-maintenance-screen__container-body-subtitle">
                            {this.translate('page.body.500.availableSoon')}
                        </div>
                    </div>
                </div>
                <div className="pg-maintenance-screen__background">
                    <BackgroundMaintenance />
                </div>
            </div>
        );
    }

    private translate = (key: string) => this.props.intl.formatMessage({ id: key });
}

const mapStateToProps: MapStateToProps<ReduxProps, {}, RootState> = (state) => ({
    status: selectPlatformAccessStatus(state),
});

export const MaintenanceScreen = compose(
    injectIntl,
    withRouter,
    connect(mapStateToProps)
)(Maintenance) as React.ComponentClass;
