import * as React from 'react';
import { useIntl } from 'react-intl';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import { getVerificationStep } from '../../../helpers';
import { selectLabelData } from '../../../modules/user/kyc/label';
import { ConfirmScreen } from '../../../screens/ConfirmScreen';
import { Modal } from '../../components/Modal';
import { Subheader } from '../../components/Subheader';

const ConfirmMobileScreen: React.FC = () => {
    const intl = useIntl();
    const history = useHistory();
    const labels = useSelector(selectLabelData);
    const step = getVerificationStep(labels);

    if (step === 'phone') {
        return (
            <div className="cr-mobile-confirm">
                <div className="cr-mobile-confirm__phone">
                    <Modal
                        isOpen
                        onClose={() => history.goBack()}
                        title={intl.formatMessage({
                            id: 'page.body.profile.header.account.profile.phone.unverified.title',
                        })}>
                        <ConfirmScreen />
                    </Modal>
                </div>
            </div>
        );
    }

    return (
        <div className="cr-mobile-confirm">
            <div className="cr-mobile-confirm__identity">
                <Subheader
                    title={intl.formatMessage({ id: `page.mobile.confirm.${step}` })}
                    backTitle={intl.formatMessage({ id: 'page.mobile.confirm.back' })}
                    onGoBack={() => history.goBack()}
                />
                <ConfirmScreen />
            </div>
        </div>
    );
};

export { ConfirmMobileScreen };
