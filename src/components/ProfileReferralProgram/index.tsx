import { CopyableTextField } from '@openware/components';
import * as React from 'react';

class ProfileReferralProgram extends React.Component {
    public render() {
        return (
            <div className="pg-profile-page__box pg-profile-page__right-col__referral-program">
                <div className="pg-profile-page__box-header">
                    <h3>Cryptobase <span className="pg-profile-page__text-purple">Referral Program</span></h3>
                </div>
                <div className="pg-profile-page__row">
                    <div className="pg-profile-page__col">
                        <h3 className="pg-profile-page__text-purple">20 &#37;</h3>
                        <p className="pg-profile-page__ml-gap">Your commision rate
                            <br/>
                            <span><a href="#" className="pg-profile-page__text-muted">More details</a></span>
                        </p>
                    </div>
                    <div className="pg-profile-page__col"/>
                </div>
                <div className="pg-profile-page__row">
                    <label>Referral link</label>
                    <CopyableTextField
                        fieldId={'copy_id-profile'}
                        value="1F1tAaz5x1HUXrCNLbtMDqcw6o5GNn4dfE"
                    />
                </div>
            </div>
        );
    }
}

export {
    ProfileReferralProgram,
};
