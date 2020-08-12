import * as React from 'react';
import { Button } from 'react-bootstrap';

const AddressGeneratingComponent = props  => {
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
                    Generate deposit address
                </Button>
            </div>
        </div>
    );
};

const AddressGenerating = React.memo(AddressGeneratingComponent);

export {
    AddressGenerating,
};
