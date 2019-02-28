import { CopyableTextField } from '@openware/components';
import * as React from 'react';
import {
    FormattedMessage,
    InjectedIntlProps,
    injectIntl,
    intlShape,
} from 'react-intl';
import { connect, MapDispatchToProps } from 'react-redux';

import {
    alertPush,
    RootState,
    selectUserInfo,
    User,
} from '../../modules';

interface ReduxProps {
    user: User;
}

interface DispatchProps {
    fetchSuccess: typeof alertPush;
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

type Props = ReduxProps & DispatchProps & InjectedIntlProps;

class ReferralProgramClass extends React.Component<Props> {
    //tslint:disable-next-line:no-any
    public static propsTypes: React.ValidationMap<any> = {
        intl: intlShape.isRequired,
    };

    public translate = (e: string) => {
        return this.props.intl.formatMessage({id: e});
    };

    public doCopy = () => {
        copy('referral-id');
        this.props.fetchSuccess({message: this.translate('page.body.wallets.tabs.deposit.ccy.message.success'), type: 'success'});
    };

    public render() {
        const { user } = this.props;
        const referralLink = `${window.document.location.origin}/signup?refid=${user.uid}`;
        return (
            <div className="pg-profile-page__referral">
                <fieldset className="pg-copyable-text__section" onClick={this.doCopy}>
                    <legend className="cr-deposit-crypto__copyable-title">
                        <FormattedMessage id="page.body.profile.header.referralProgram"/>
                    </legend>
                    <CopyableTextField
                        className="pg-copyable-text-field__input"
                        value={referralLink}
                        fieldId="referral-id"
                        copyButtonText={this.translate('page.body.profile.content.copyLink')}

                    />
                </fieldset>
            </div>
        );
    }
}

const mapStateToProps = (state: RootState): ReduxProps => ({
    user: selectUserInfo(state),
});

const mapDispatchToProps: MapDispatchToProps<DispatchProps, {}> = dispatch => ({
    fetchSuccess: payload => dispatch(alertPush(payload)),
});

// tslint:disable-next-line
export const ReferralProgram = injectIntl(connect(mapStateToProps, mapDispatchToProps)(ReferralProgramClass) as any);
