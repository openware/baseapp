import * as Sentry from '@sentry/browser';
import * as React from 'react';

interface ErrorWrapperState {
    eventId: any; // tslint:disable-line
    hasError: boolean;
}

interface ErrorWrapperProps {
    children: React.ReactNode;
}

class ErrorWrapper extends React.Component<ErrorWrapperProps, ErrorWrapperState> {
    constructor(props) {
        super(props);

        this.state = {
            eventId: null,
            hasError: false,
        };
    }

    public static getDerivedStateFromError() {
        return { hasError: true };
    }

    public componentDidCatch(error, info) {
        Sentry.withScope(scope => {
            scope.setExtras(info);
            const eventId = Sentry.captureException(error);
            this.setState({eventId});
        });
    }

    public render() {
        if (this.state.hasError) {
            return (
                <button onClick={() => Sentry.showReportDialog({ eventId: this.state.eventId })}>Report feedback</button>
            );
        }

        return this.props.children;
    }
}

export {
    ErrorWrapper,
};
