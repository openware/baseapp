import * as React from 'react';
import { InjectedIntlProps, injectIntl } from 'react-intl';
import { BackgroundMaintenance } from '../../assets/images/BackgroundMaintenance';
import { LogoIcon } from '../../assets/images/LogoIcon';

type Props = InjectedIntlProps;

class Maintenance extends React.Component<Props> {
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

export const MaintenanceScreen = injectIntl(Maintenance);
