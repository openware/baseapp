import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { RouterProps } from 'react-router';
import { withRouter } from 'react-router-dom';
import { ProfileAccountActivity } from '../../containers/ProfileAccountActivity';
import { ProfileApiKeys } from '../../containers/ProfileApiKeys';
import { ProfileAuthDetails } from '../../containers/ProfileAuthDetails';
import { ProfileVerification } from '../../containers/ProfileVerification';
import { ReferralProgram } from '../../containers/ReferralProgram';
import { setDocumentTitle } from '../../helpers';

class ProfileComponent extends React.Component<RouterProps> {

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
                    <div className="row pg-profile-page-header pg-profile-page-header-first">
                        <h3 className="col-12">
                            <FormattedMessage id="page.body.profile.header.account"/>
                        </h3>
                    </div>
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
                    <div className="row px-4">
                        <div className="col-12 mx-0">
                            <ReferralProgram/>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-12">
                        <ProfileApiKeys/>
                    </div>
                    <div className="col-12">
                        <ProfileAccountActivity/>
                    </div>
                </div>
            </div>
        );
    }
}

// tslint:disable-next-line:no-any
const ProfileScreen = withRouter(ProfileComponent as any);

export {
    ProfileScreen,
};
