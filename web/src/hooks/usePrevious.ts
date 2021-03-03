import * as React from 'react';

export const usePrevious = value => {
    const ref = React.useRef();
    React.useEffect(() => {
        ref.current = value;
    });

    return ref.current;
};
