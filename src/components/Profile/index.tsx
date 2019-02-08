import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { RouterProps } from 'react-router';
import { withRouter } from 'react-router-dom';
import { ProfileAccountActivity } from '../ProfileAccountActivity';
import { ProfileAuthDetails } from '../ProfileAuthDetails';
import { ProfileVerification } from '../ProfileVerification';

class ProfileComponent extends React.Component<RouterProps> {
    public goBack = () => {
      this.props.history.goBack();
    }

    public render() {
        return(
              <div className="pg-container pg-profile-page">
                <div className="pg-profile-page__details">
                  <div className="pg-profile-page-header">
                    <h3 className="pg-profile-page__text-purple">
                        <FormattedMessage id="page.body.profile.header.account" />
                    </h3>
                  </div>
                  <div className="pg-profile-page__details-box">
                      <div className="pg-profile-page__left-col">
                          <ProfileAuthDetails />
                      </div>
                      <div className="pg-profile-page__right-col">
                          <ProfileVerification />
                      </div>
                  </div>
                </div>
                  <ProfileAccountActivity />
              </div>
        );
    }
}

// tslint:disable-next-line:no-any
const Profile = withRouter(ProfileComponent as any);

export {
    Profile,
};
