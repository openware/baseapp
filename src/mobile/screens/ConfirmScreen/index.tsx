import * as React from 'react';
import { useIntl } from 'react-intl';
import { useSelector } from 'react-redux';
import { selectUserInfo } from '../../../modules/user/profile';
import { ConfirmScreen } from '../../../screens/ConfirmScreen';
import { Modal } from '../../components/Modal';

const ConfirmMobileScreen = () => {
    const intl = useIntl();
    const user = useSelector(selectUserInfo) || { level: 1 };

    return (
        <div className="cr-mobile-confirm">
            {
                user.level === 1 ?
                    <div className="cr-mobile-confirm__phone">
                        <Modal
                            isOpen
                            title={intl.formatMessage({id: 'page.body.profile.header.account.profile.phone.unverified.title'})}>
                            <ConfirmScreen/>
                        </Modal>
                    </div>
                    :
                    <div className="cr-mobile-confirm__identity">
                        <ConfirmScreen/>
                    </div>
            }
        </div>
    );
};

export {
    ConfirmMobileScreen,
};
