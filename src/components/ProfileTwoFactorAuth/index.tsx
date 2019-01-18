/* tslint:disable jsx-no-lambda  jsx-no-multiline-js */
import { Checkbox } from '@openware/components';
import * as React from 'react';

interface ProfileTwoFactorAuthProps {
    is2faEnabled: boolean;
    navigateTo2fa: (enable2fa: boolean) => void;
}

interface ProfileTwoFactorAuthState {
    is2faEnabled: boolean;
}

class ProfileTwoFactorAuth extends React.Component<ProfileTwoFactorAuthProps, ProfileTwoFactorAuthState> {
    constructor(props: ProfileTwoFactorAuthProps) {
        super(props);

        this.state = {
          is2faEnabled: props.is2faEnabled,
        };
    }

    public render() {
        const { is2faEnabled } = this.state;
        return (
            <React.Fragment>
                <label>
                  <p>Two-factor authentication</p>
                  <span>2FA - {is2faEnabled ? 'Enable' : 'Disable'}</span>
                </label>
                <Checkbox
                    checked={is2faEnabled}
                    className={'pg-profile-page__switch'}
                    onChange={() => this.handleToggle2fa()}
                    label={''}
                    slider={true}
                />
            </React.Fragment>
        );
    }

    private handleToggle2fa() {
        this.props.navigateTo2fa(!this.state.is2faEnabled);
        this.setState(prev => ({
            is2faEnabled: !prev.is2faEnabled,
        }));
    }
}

export {
    ProfileTwoFactorAuth,
};
