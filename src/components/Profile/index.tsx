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
          <div>
            <div className="pg-profile-page__head">
              <div onClick={this.goBack} className="pg-profile-page__head-back">
                <span/>
                <h1>Profile</h1>
              </div>
            </div>
            <div className="pg-container pg-profile-page">
              <div className="pg-profile-page__details">
                  <div className="pg-profile-page__left-col">
                      <ProfileAuthDetails />
                  </div>
                  <div className="pg-profile-page__right-col">
                      <ProfileVerification />
                  </div>
              </div>
                <ProfileAccountActivity />
            </div>
            </div>
        );
    }
}

// tslint:disable-next-line
const Profile = withRouter(Prof as any);

export {
    Profile,
};
