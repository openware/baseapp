import cn from 'classnames';
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { selectUserInfo, User } from '../../modules';

interface ProfileVerificationProps {
    user: User;
}

class ProfileVerificationComponent extends React.Component<ProfileVerificationProps> {
    public render() {
        const { user } = this.props;
        const userLevel = user.level;
        return (
            <div className="pg-profile-page__box pg-profile-page__left-col__verification">
                <div className="pg-profile-page__box-header">
                    <div className="pg-profile-page__row">
                      <div className="pg-profile-page__verification-header">
                        <FormattedMessage id="page.body.profile.header.account.profile" />
                      </div>
                    </div>
                </div>
                {this.renderFirstLevel(userLevel)}
                {this.renderSecondLevel(userLevel)}
                {this.renderThirdLevel(userLevel)}
            </div>
        );
    }

    private renderFirstLevel(userLevel: number) {
        const targetLevel = 1;
        const {
            titleClassName,
        } = this.getLevelsClassNames(userLevel, targetLevel);
        return (
            <div className="pg-profile-page__row pg-profile-page__level-verification">
                <div className={titleClassName}>
                    {this.renderVerificationLevel('page.body.profile.header.account.profile.email', userLevel, targetLevel)}
                    <p><FormattedMessage id="page.body.profile.header.account.profile.email.message" /></p>
                </div>
            </div>
        );
    }

    private renderSecondLevel(userLevel: number) {
        const targetLevel = 2;
        const {
            titleClassName,
        } = this.getLevelsClassNames(userLevel, targetLevel);
        return (
            <div className="pg-profile-page__row pg-profile-page__level-verification">
                <div className={titleClassName}>
                    {this.renderVerificationLevel('page.body.profile.header.account.profile.phone', userLevel, targetLevel)}
                    <p><FormattedMessage id="page.body.profile.header.account.profile.phone.message" /></p>
                </div>
            </div>
        );
    }

    private renderThirdLevel(userLevel: number) {
        const targetLevel = 3;
        const {
            titleClassName,
        } = this.getLevelsClassNames(userLevel, targetLevel);
        return (
            <div className="pg-profile-page__row pg-profile-page__level-verification">
                <div className={titleClassName}>
                    {this.renderVerificationLevel('page.body.profile.header.account.profile.identity', userLevel, targetLevel)}
                    <p><FormattedMessage id="page.body.profile.header.account.profile.identity.message" /></p>
                </div>
            </div>
        );
    }

    private renderVerificationLevel(text: string, userLevel, targetLevel) {
        if (userLevel === (targetLevel - 1)) {
            return (
                <a href="/confirm" className="pg-profile-page__level-verification__url">
                    <FormattedMessage id={`${text}.unverified.title`}/>
                </a>
            );
        } else {
            if (userLevel < targetLevel) {
                return (
                    <p className="pg-profile-page__level-verification__name">
                        <FormattedMessage id={`${text}.unverified.title`}/>
                    </p>
                );
            } else {
                return (
                    <p className="pg-profile-page__level-verification__name">
                        <FormattedMessage id={`${text}.title`}/>
                    </p>
                );
            }
        }
    }

    private getLevelsClassNames(currentLevel: number, targetLevel: number) {
        const levelSatisfied = currentLevel >= targetLevel;

        const levelClassName = cn({
            'pg-profile-page__text-purple': levelSatisfied,
        });
        const titleClassName = cn('pg-profile-page__ml-gap', {
            'pg-profile-page__text-success': levelSatisfied,
        });

        return { levelClassName, titleClassName };
    }
}

const mapStateToProps = state => ({
    user: selectUserInfo(state),
});

const ProfileVerification = connect(mapStateToProps)(ProfileVerificationComponent);

export {
    ProfileVerification,
};
