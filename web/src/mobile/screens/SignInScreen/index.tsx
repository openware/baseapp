import classnames from 'classnames';
import * as React from 'react';
import { useIntl } from 'react-intl';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import { selectSignInRequire2FA } from '../../../modules/user/auth';
import { SignInScreen } from '../../../screens/SignInScreen';
import { Modal } from '../../components';


const SignInMobileScreen: React.FC = () => {
    const require2FA = useSelector(selectSignInRequire2FA);
    const history = useHistory();
    const intl = useIntl();
    const title = require2FA ? { id: 'page.mobile.signin.kyc.header' } : { id: 'page.body.landing.header.button2' };
    const className = classnames({
        'cr-mobile-signin': !require2FA,
        'cr-mobile-kyc': require2FA,
    });

    return <div className={className}>
        <Modal
            isOpen={true}
            onClose={() => history.push('/trading')}
            onBack={() => !require2FA && history.push('/signup')}
            backTitle={intl.formatMessage({ id: 'page.body.landing.header.button3' })}
            title={intl.formatMessage(title)}>
            <SignInScreen/>
        </Modal>
    </div>;
};

export {
    SignInMobileScreen,
};
