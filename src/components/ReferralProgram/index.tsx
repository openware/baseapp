import { CopyableTextField } from '@openware/components';
import * as React from 'react';

import { connect } from 'react-redux';

import {
    RootState,
    selectUserInfo,
    User,
} from '../../modules';

interface ReduxProps {
    user: User;
}

type CopyTypes = HTMLInputElement | null;

const copy = (id: string) => {
    const copyText: CopyTypes = document.querySelector(`#${id}`);

    if (copyText) {
        copyText.select();

        document.execCommand('copy');
        window.getSelection().removeAllRanges();
    }
};

class ReferralProgramClass extends React.Component<ReduxProps> {
    public render() {
        const { user } = this.props;
        const referralLink = `${window.document.location.origin}/signup?ref_id=${user.uid}`;
        const doCopy = () => copy('referral-id');
        return (
            <div className="pg-profile-page__activity">
                <div className="pg-profile-page-header">
                    <h3><span className="pg-profile-page__text-purple">Referral Program</span></h3>
                </div>
                <div className="pg-copyable-text__section">
                    <CopyableTextField className="pg-copyable-text-field__input" value={referralLink} fieldId="referral-id"/>
                    <div className="pg-copyable-text-field__button" onClick={doCopy}>Copy link</div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state: RootState): ReduxProps => ({
    user: selectUserInfo(state),
});

const ReferralProgram = connect(mapStateToProps)(ReferralProgramClass);

export {
    ReferralProgram,
};
