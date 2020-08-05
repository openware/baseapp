import * as React from 'react';
import { useIntl } from 'react-intl';
import { useHistory } from 'react-router';
import { SignInScreen } from '../../../screens/SignInScreen';
import { Modal } from '../../components/Modal/Modal';


const SignInMobileScreen = () => {
    const history = useHistory();
    const intl = useIntl();

    return <div>
        <Modal
            isOpen={true}
            onBack={() => history.push('/signup')}
            backTitle={intl.formatMessage({ id: 'page.body.landing.header.button3' })}
            title={intl.formatMessage({ id: 'page.body.landing.header.button2' })}>
            <SignInScreen/>
        </Modal>
    </div>;
};

export {
    SignInMobileScreen,
};
