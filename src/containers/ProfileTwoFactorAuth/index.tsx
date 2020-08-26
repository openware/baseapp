/* tslint:disable jsx-no-multiline-js */
import * as React from 'react';
import { Form } from 'react-bootstrap';
import { FormattedMessage } from 'react-intl';

export const ProfileTwoFactorAuth = props => {
    const { is2faEnabled = false } = props;
    const className = is2faEnabled ? 'pg-profile-page__label-value__enabled'
                                    : 'pg-profile-page__label-value__disabled';

    const handleToggle2fa = () => {
        if (props.navigateTo2fa) {
            props.navigateTo2fa(!is2faEnabled);
        }
    };

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
            <Form>
                <Form.Check
                    type="switch"
                    id="2fa-switch"
                    label=""
                    onChange={handleToggle2fa}
                    checked={is2faEnabled}
                />
            </Form>
        </React.Fragment>
    );
};
