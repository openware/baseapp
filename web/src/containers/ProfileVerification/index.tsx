import * as React from 'react';
import { OverlayTrigger } from 'react-bootstrap';
import { FormattedMessage } from 'react-intl';
import { connect, MapDispatchToPropsFunction } from 'react-redux';
import { kycSteps } from '../../api';
import { Tooltip } from '../../components';
import { Label, labelFetch, selectLabelData, selectUserInfo, User } from '../../modules';

/* Icons */
import { CheckIcon } from '../../assets/images/kyc/CheckIcon';
import { ClocksIcon } from '../../assets/images/kyc/ClocksIcon';
import { CrossIcon } from '../../assets/images/kyc/CrossIcon';

interface ReduxProps {
    labels: Label[];
}

interface DispatchProps {
    labelFetch: typeof labelFetch;
}

interface ProfileVerificationProps {
    user: User;
}

type Props = DispatchProps & ProfileVerificationProps & ReduxProps;

class ProfileVerificationComponent extends React.Component<Props> {
    public componentDidMount() {
        this.props.labelFetch();
    }

    public renderProgressBarStep = (step: string, index: number, labels: Label[]) => {
        const targetLabelStatus = this.handleCheckLabel(labels, step);

        switch (targetLabelStatus) {
            case 'verified':
                return (
                    <div className="pg-profile-page-verification__progress-bar__step pg-profile-page-verification__progress-bar__step--verified">
                        <FormattedMessage id={`page.body.profile.verification.progress.level`} />
                        <span>&nbsp;{index + 1}</span>
                        <CheckIcon />
                    </div>
                );
            case 'drafted':
            case 'pending':
            case 'submitted':
                return (
                    <OverlayTrigger
                        placement="bottom"
                        delay={{ show: 250, hide: 400 }}
                        overlay={<Tooltip title={`page.body.profile.verification.progress.tooltip.${step}.pending`} />}>
                        <div className="pg-profile-page-verification__progress-bar__step pg-profile-page-verification__progress-bar__step--pending">
                            <FormattedMessage id={`page.body.profile.verification.progress.level`} />
                            <span>&nbsp;{index + 1}</span>
                            <ClocksIcon />
                        </div>
                    </OverlayTrigger>
                );
            case 'rejected':
                return (
                    <OverlayTrigger
                        placement="bottom"
                        delay={{ show: 250, hide: 400 }}
                        overlay={
                            <Tooltip title={`page.body.profile.verification.progress.tooltip.${step}.rejected`} />
                        }>
                        <div className="pg-profile-page-verification__progress-bar__step pg-profile-page-verification__progress-bar__step--rejected">
                            <FormattedMessage id={`page.body.profile.verification.progress.level`} />
                            <span>&nbsp;{index + 1}</span>
                            <CrossIcon />
                        </div>
                    </OverlayTrigger>
                );
            case 'blocked':
                return (
                    <div className="pg-profile-page-verification__progress-bar__step pg-profile-page-verification__progress-bar__step--blocked">
                        <FormattedMessage id={`page.body.profile.verification.progress.level`} />
                        <span>&nbsp;{index + 1}</span>
                    </div>
                );
            default:
                return (
                    <OverlayTrigger
                        placement="bottom"
                        delay={{ show: 250, hide: 400 }}
                        overlay={<Tooltip title={`page.body.profile.verification.progress.tooltip.${step}.default`} />}>
                        <div className="pg-profile-page-verification__progress-bar__step pg-profile-page-verification__progress-bar__step--active">
                            <FormattedMessage id={`page.body.profile.verification.progress.level`} />
                            <span>&nbsp;{index + 1}</span>
                        </div>
                    </OverlayTrigger>
                );
        }
    };

    public renderProgressBar(labels: Label[]) {
        return (
            <div className="pg-profile-page-verification__progress-bar">
                {kycSteps().map((step, index) => this.renderProgressBarStep(step, index, labels))}
            </div>
        );
    }

    public render() {
        const { labels } = this.props;

        return (
            <div className="pg-profile-page__box pg-profile-page-verification">
                <h3 className="pg-profile-page-verification__title">
                    <FormattedMessage id="page.body.profile.header.account.profile" />
                </h3>
                {this.renderProgressBar(labels)}
            </div>
        );
    }

    private handleCheckLabel = (labels: Label[], labelToCheck: string) => {
        const targetLabel =
            labels.length && labels.find((label: Label) => label.key === labelToCheck && label.scope === 'private');
        let targetLabelStatus = targetLabel ? targetLabel.value : '';
        const indexOfPrevStep = kycSteps().indexOf(labelToCheck) - 1;

        if (indexOfPrevStep !== -1) {
            const prevStepPassed = Boolean(
                labels.find(
                    (label: Label) =>
                        label.key === kycSteps()[indexOfPrevStep] &&
                        label.value === 'verified' &&
                        label.scope === 'private'
                )
            );

            if (!prevStepPassed) {
                targetLabelStatus = 'blocked';
            }
        }

        return targetLabelStatus;
    };
}

const mapStateToProps = (state) => ({
    user: selectUserInfo(state),
    labels: selectLabelData(state),
});

const mapDispatchProps: MapDispatchToPropsFunction<DispatchProps, {}> = (dispatch) => ({
    labelFetch: () => dispatch(labelFetch()),
});

export const ProfileVerification = connect(mapStateToProps, mapDispatchProps)(ProfileVerificationComponent);
