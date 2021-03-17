import * as React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { RouterProps } from 'react-router';
import { withRouter } from 'react-router-dom';
import { compose } from 'redux';
import { IntlProps } from '../../';
import { TabPanel } from '../../components';
import { ProfileApiKeys, ProfileVerification } from '../../containers';
import { ProfileAccountActivity } from '../../containers/ProfileAccountActivity';
import { ProfileAuthDetails } from '../../containers/ProfileAuthDetails';
import { ProfileSecurity } from '../../containers/ProfileSecurity';
import { ReferralProgram } from '../../containers/ReferralProgram';
import { setDocumentTitle } from '../../helpers';

type Props = RouterProps & IntlProps;

interface State {
    tab: string;
    currentTabIndex: number;
}

class ProfileComponent extends React.Component<Props, State> {
    public state = {
        tab: 'security',
        currentTabIndex: 0,
    };

    public tabMapping = ['security', 'api_keys', 'payment', 'referral'];

    public componentDidMount() {
        setDocumentTitle('Profile');
    }

    public goBack = () => {
        this.props.history.goBack();
    };

    public render() {
        return (
            <div className="container pg-profile-page">
                <div className="pg-profile-page__details">
                    <div className="pg-profile-top">
                        <div className="row">
                            <div className="col-12 col-md-6 mx-0">
                                <div className="row col-12 mx-0">
                                    <ProfileAuthDetails/>
                                </div>
                            </div>
                            <div className="col-12 col-md-6">
                                <ProfileVerification/>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-12">
                            <TabPanel
                                panels={this.renderTabs()}
                                onTabChange={this.handleMakeRequest}
                                currentTabIndex={this.state.currentTabIndex}
                                onCurrentTabChange={this.onCurrentTabChange}
                            />
                        </div>
                    </div>
                </div>
                
                {
                    this.state.tab === 'security' ? (
                        <div className="row">
                            <div className="col-12">
                                <ProfileAccountActivity/>
                            </div>
                        </div>
                    ) : null
                }
            </div>
        );
    }

    private onCurrentTabChange = index => this.setState({ currentTabIndex: index });

    private handleMakeRequest = (index: number) => {
        if (this.state.tab === this.tabMapping[index]) {
            return;
        }

        this.setState({ tab: this.tabMapping[index] });
    };

    private renderTabs = () => {
        const { tab } = this.state;

        return [
            {
                content: tab === 'security' ? <ProfileSecurity/> : null,
                label: this.props.intl.formatMessage({id: 'page.body.profile.tabs.security'}),
            },
            {
                content: tab === 'api_keys' ? <ProfileApiKeys/> : null,
                label: this.props.intl.formatMessage({id: 'page.body.profile.tabs.api_keys'}),
            },
            {
                content: tab === 'payment' ? <div>Payment</div> : null,
                label: this.props.intl.formatMessage({id: 'page.body.profile.tabs.payment'}),
            },
            {
                content: tab === 'referral' ? <ReferralProgram/> : null,
                label: this.props.intl.formatMessage({id: 'page.body.profile.tabs.referral'}),
            },
        ];
    };
}

export const ProfileScreen = compose(
    injectIntl,
    withRouter,
)(ProfileComponent as any) as React.ComponentClass;
