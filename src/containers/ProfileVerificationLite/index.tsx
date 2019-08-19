import cn from 'classnames';
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { connect, MapDispatchToPropsFunction } from 'react-redux';
import { Label, labelFetch, selectLabelData } from '../../modules';

interface ReduxProps {
    label: Label[];
}

interface DispatchProps {
    labelFetch: typeof labelFetch;
}

interface ProfileVerificationProps {
    openModal: () => void;
}

type Props =  DispatchProps & ProfileVerificationProps & ReduxProps;

class ProfileVerificationLiteComponent extends React.Component<Props> {
    public componentDidMount() {
        this.props.labelFetch();
    }

    public render() {
        return (
            <div className="pg-profile-page__box pg-profile-page__left-col__verification">
                <div className="pg-profile-page__box-header">
                    <div className="pg-profile-page__row">
                        <div className="pg-profile-page__verification-header">
                            <FormattedMessage id="page.body.profile.header.account.profile" />
                        </div>
                    </div>
                </div>
                {this.renderFirstLevel(1)}
                {this.renderSecondLevel(1)}
                {this.renderThirdLevel(1)}
            </div>
        );
    }

    private renderFirstLevel(userLevel: number) {
        const targetLevel = 1;
        const { titleClassName } = this.getLevelsClassNames(userLevel, targetLevel);
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
        const { titleClassName } = this.getLevelsClassNames(userLevel, targetLevel);
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
        const documentLabel = this.props.label.find((label: Label) => label.key === 'document');
        const isPending = documentLabel && documentLabel.value === 'pending' ? this.renderPendingIcon() : '';

        const { titleClassName } = this.getLevelsClassNames(userLevel, targetLevel);

        return (
            <div className="pg-profile-page__row pg-profile-page__level-verification">
                <div className={titleClassName}>
                    {this.renderIdentityVerification('page.body.profile.header.account.profile.identity', userLevel, targetLevel, documentLabel)}
                    <p><FormattedMessage id="page.body.profile.header.account.profile.identity.message" /></p>
                </div>
                {isPending}
            </div>
        );
    }

    private renderPendingIcon() {
        return (
            <div className="pg-profile-page__level-verification__pending">
                <p><FormattedMessage id="page.body.wallets.table.pending" /></p>
                <img src={require('../../assets/images/pending.svg')} />
            </div>
        );
    }

    private renderVerificationLevel(text: string, userLevel, targetLevel) {
        if (userLevel === (targetLevel - 1)) {
            return (
                <a onClick={this.props.openModal}  className="pg-profile-page__level-verification__url">
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

    private renderIdentityVerification(text: string, userLevel, targetLevel, documentLabel) {
      const isLabelExist = this.props.label;

      if (isLabelExist.length > 0) {
        switch (userLevel) {
          case targetLevel - 1: {
            if (documentLabel) {
              return (
                <p className="pg-profile-page__level-verification__name">
                  <FormattedMessage id={`${text}.unverified.title`}/>
                </p>
              );
            } else {
              return (
                <a onClick={this.props.openModal} className="pg-profile-page__level-verification__url">
                  <FormattedMessage id={`${text}.unverified.title`}/>
                </a>
              );
            }
          }
          case targetLevel: return (
            <p className="pg-profile-page__level-verification__name">
              <FormattedMessage id={`${text}.title`}/>
            </p>
          );
          default: return(
            <p className="pg-profile-page__level-verification__name">
              <FormattedMessage id={`${text}.unverified.title`}/>
            </p>
          );
        }
      } else {
        return (
          <p className="pg-profile-page__level-verification__name">
            <FormattedMessage id={`${text}.unverified.title`}/>
          </p>
        );
      }
    }

    private getLevelsClassNames(currentLevel: number, targetLevel: number) {
        const levelSatisfied = currentLevel >= targetLevel;

        const levelClassName = cn({ 'pg-profile-page__text-purple': levelSatisfied });
        const titleClassName = cn('pg-profile-page__ml-gap', { 'pg-profile-page__text-success': levelSatisfied });

        return { levelClassName, titleClassName };
    }
}

const mapStateToProps = state => ({
    label: selectLabelData(state),
});

const mapDispatchProps: MapDispatchToPropsFunction<DispatchProps, {}> =
    dispatch => ({
        labelFetch: () => dispatch(labelFetch()),
    });

const ProfileVerificationLite = connect(mapStateToProps, mapDispatchProps)(ProfileVerificationLiteComponent);

export {
    ProfileVerificationLite,
};
