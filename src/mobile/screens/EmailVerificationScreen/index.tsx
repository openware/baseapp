import * as React from 'react';
import { useIntl } from 'react-intl';
import { useHistory } from 'react-router';
import { EmailVerificationScreen } from '../../../screens/EmailVerification';
import { Modal } from '../../components/Modal/Modal';

const EmailVerificationMobileScreen = () => {
    const history = useHistory();
    const intl = useIntl();

    return <div className="cr-mobile-email-verification">
        <Modal
            isOpen={true}
            onClose={() => history.push('/trading')}
            title={intl.formatMessage({ id: 'page.header.signUp.modal.header' })}>
            <EmailVerificationScreen/>
        </Modal>
    </div>;
};

export {
    EmailVerificationMobileScreen,
};
