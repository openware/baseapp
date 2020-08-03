import * as React from 'react';
import {
    FormattedMessage,
    injectIntl,
} from 'react-intl';
import { connect, MapDispatchToProps } from 'react-redux';
import { CopyableTextField } from '../../components';
import { IntlProps } from '../../index';
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
        (window.getSelection() as any).removeAllRanges(); // tslint:disable-line
    }
};

type Props = ReduxProps & DispatchProps & IntlProps;

class ReferralProgramClass extends React.Component<Props> {
    public translate = (e: string) => {
        return this.props.intl.formatMessage({id: e});
    };

    public doCopy = () => {
        copy('referral-id');
        this.props.fetchSuccess({message: ['page.body.wallets.tabs.deposit.ccy.message.success'], type: 'success'});
    };

    public render() {
        const { user } = this.props;
        const referralLink = `${window.document.location.origin}/signup?refid=${user.uid}`;

        return (
            <div className="pg-profile-page__referral mb-3">
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
export const ReferralProgram = injectIntl(connect(mapStateToProps, mapDispatchToProps)(ReferralProgramClass) as any) as any;
