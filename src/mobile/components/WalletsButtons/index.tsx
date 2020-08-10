import * as React from 'react';
import { Button } from 'react-bootstrap';
import { useIntl } from 'react-intl';
import { useHistory } from 'react-router';

const WalletsButtonsComponent = () => {
    const intl = useIntl();
    const history = useHistory();

    return (
        <div className="cr-mobile-wallets-buttons">
            <Button
                onClick={() => history.push('/wallets/history/deposit')}
                size="lg"
                variant="success"
            >
                {intl.formatMessage({ id: 'page.body.wallets.tabs.deposit' })}
            </Button>
            <Button
                onClick={() => history.push('/wallets/history/withdraw')}
                size="lg"
                variant="danger"
            >
                {intl.formatMessage({ id: 'page.body.wallets.tabs.withdraw' })}
            </Button>
        </div>
    );
};

const WalletsButtons = React.memo(WalletsButtonsComponent);

export {
    WalletsButtons,
};

