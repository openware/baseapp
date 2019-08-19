/* tslint:disable jsx-no-lambda  jsx-no-multiline-js */
import { Checkbox } from '@openware/components';
import * as React from 'react';
import { FormattedMessage } from 'react-intl';

interface Props {
    openModal: () => void;
}

class ProfileTwoFactorAuthLiteComponent extends React.Component<Props> {
    public render() {
        return (
            <React.Fragment>
                <label className="pg-profile-page__label">
                    <div>
                        <FormattedMessage id="page.body.profile.header.account.content.twoFactorAuthentication" />
                    </div>
                    <span className={'pg-profile-page__label-value__enabled'}>
                        <FormattedMessage id="page.body.profile.header.account.content.twoFactorAuthentication.message.enable" />
                    </span>
                </label>
                <Checkbox
                    checked={true}
                    className={'pg-profile-page__switch'}
                    onChange={() => this.handleToggle2fa()}
                    label={''}
                    slider={true}
                />
            </React.Fragment>
        );
    }

    private handleToggle2fa = () => {
        this.props.openModal();
    }
}

export const ProfileTwoFactorAuthLite = ProfileTwoFactorAuthLiteComponent;
