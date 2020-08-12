import * as React from 'react';
import { Button } from 'react-bootstrap';
import { useIntl } from 'react-intl';

const AddressGeneratingComponent = props  => {
    const intl = useIntl();

    return (
        <div className="cr-deposit-crypto__create">
            <div className="cr-deposit-crypto__create-btn">
                <Button
                    block={true}
                    type="button"
                    onClick={props.handleGenerateAddress}
                    size="lg"
                    variant="primary"
                >
                    {intl.formatMessage({ id: 'page.mobile.wallet.deposit.generate' })}
                </Button>
            </div>
        </div>
    );
};

const AddressGenerating = React.memo(AddressGeneratingComponent);

export {
    AddressGenerating,
};
