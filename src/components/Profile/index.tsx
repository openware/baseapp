import * as React from 'react';
import { withRouter } from 'react-router-dom';
import { ProfileAccountActivity } from '../ProfileAccountActivity';
import { ProfileAuthDetails } from '../ProfileAuthDetails';
// import { ProfileReferralProgram } from '../ProfileReferralProgram';
// import { ProfileTiers } from '../ProfileTiers';
import { ProfileVerification } from '../ProfileVerification';

// tslint:disable-next-line
class Prof extends React.Component<any, {}, {}> {
    public goBack = () => {
      this.props.history.goBack();
    }
    public render() {
        return(
              <div className="pg-container pg-profile-page">
                <div className="pg-profile-page__details">
                  <div className="pg-profile-page-header">
                    <h3 className="pg-profile-page__text-purple">Account</h3>
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

// tslint:disable-next-line
const Profile = withRouter(Prof as any);

export {
    Profile,
};
