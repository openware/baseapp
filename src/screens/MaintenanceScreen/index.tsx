import * as React from 'react';
import { InjectedIntlProps, injectIntl } from 'react-intl';
import { RouterProps } from 'react-router';
import { withRouter } from 'react-router-dom';
import { compose } from 'redux';
import { BackgroundMaintenance } from '../../assets/images/BackgroundMaintenance';
import { LogoIcon } from '../../assets/images/LogoIcon';

type Props = RouterProps & InjectedIntlProps;

class Maintenance extends React.Component<Props> {
    constructor(props: Props) {
        super(props);

        const isUnderMaintenance = localStorage.getItem('maintenance');
        if (!isUnderMaintenance) {
            props.history.replace('/');
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

    private translate = (key: string) => this.props.intl.formatMessage({id: key});
}

export const MaintenanceScreen = compose(
    injectIntl,
    withRouter,
)(Maintenance) as React.ComponentClass;
