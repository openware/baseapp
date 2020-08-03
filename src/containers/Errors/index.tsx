import * as Sentry from '@sentry/browser';
import * as React from 'react';
import { injectIntl } from 'react-intl';
import { IntlProps } from '../../index';

interface ErrorWrapperState {
    eventId: any; // tslint:disable-line
    hasError: boolean;
}

interface ErrorWrapperProps {
    children: React.ReactNode;
}

class Errors extends React.Component<ErrorWrapperProps & IntlProps, ErrorWrapperState> {
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
                <button onClick={() => Sentry.showReportDialog({ eventId: this.state.eventId })}>
                    {this.props.intl.formatMessage({ id: 'sentry.report_feedback' })}
                </button>
            );
        }

        return this.props.children;
    }
}

export const ErrorWrapper = injectIntl(Errors) as any;
