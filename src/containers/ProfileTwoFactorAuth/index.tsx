/* tslint:disable jsx-no-lambda  jsx-no-multiline-js */
import { Checkbox } from '@openware/components';
import * as React from 'react';
import { FormattedMessage } from 'react-intl';

interface ProfileTwoFactorAuthProps {
    is2faEnabled?: boolean;
    navigateTo2fa?: (enable2fa: boolean) => void;
    openModal?: () => void;
}

interface ProfileTwoFactorAuthState {
    is2faEnabled: boolean;
}

type Props = ProfileTwoFactorAuthProps;

class ProfileTwoFactorAuthComponent extends React.Component<Props, ProfileTwoFactorAuthState> {
    constructor(props: ProfileTwoFactorAuthProps) {
        super(props);

        this.state = {
          is2faEnabled: props.is2faEnabled || false,
        };
    }

    public render() {
        const { is2faEnabled } = this.state;
        const className = is2faEnabled ? 'pg-profile-page__label-value__enabled'
                                       : 'pg-profile-page__label-value__disabled';

        return (
            <React.Fragment>
                <label className="pg-profile-page__label">
                    <div>
                        <FormattedMessage id="page.body.profile.header.account.content.twoFactorAuthentication" />
                    </div>
                    <span className={className}>
                    {is2faEnabled ? <FormattedMessage id="page.body.profile.header.account.content.twoFactorAuthentication.message.enable" />
                                  : <FormattedMessage id="page.body.profile.header.account.content.twoFactorAuthentication.message.disable" />}
                    </span>
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

    private handleToggle2fa = () => {
        if (this.props.navigateTo2fa) {
            this.props.navigateTo2fa(!this.state.is2faEnabled);
        }
    };
}

export const ProfileTwoFactorAuth = ProfileTwoFactorAuthComponent;
