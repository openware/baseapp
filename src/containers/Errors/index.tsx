import * as React from 'react';

class ErrorWrapper extends React.Component {
    public componentDidCatch(error, info) {
        // tslint:disable-next-line
        console.error(error);
    }

    public render() {
        return this.props.children;
    }
}

export {
    ErrorWrapper,
};
