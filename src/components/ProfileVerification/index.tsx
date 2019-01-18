import cn from 'classnames';
import * as React from 'react';
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
                      <h1>Profile Verification</h1>
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
                      <p>Email verified</p>
                      <p>Deposit and Withdrawal not allowed</p>
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
                      <p>Phone verification</p>
                      <p>Deposit and trade allowed</p>
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
                      <p>Identity verified</p>
                      <p>Withdrawal allowed</p>
                    </div>
            </div>
        );
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
