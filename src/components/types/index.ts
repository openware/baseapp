import * as React from 'react';

interface KeyValuePair {
    key: string;
    value: string | number | React.ReactNode;
}

interface OnChangeEvent {
    target: {
        value: string;
    };
}

export {
    KeyValuePair,
    OnChangeEvent,
};
