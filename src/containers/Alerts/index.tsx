import * as React from 'react';
import { Alert } from 'react-bootstrap';
import FadeIn from 'react-fade-in';
import {
    InjectedIntlProps,
    injectIntl,
} from 'react-intl';
import { connect, MapDispatchToPropsFunction } from 'react-redux';
import {
    alertDelete,
    alertDeleteByIndex,
    AlertState,
    RootState,
    selectAlertState,
} from '../../modules';

interface ReduxProps {
    alerts: AlertState;
}

interface DispatchProps {
    alertDelete: typeof alertDelete;
    alertDeleteByIndex: typeof alertDeleteByIndex;
}

type Props = ReduxProps & DispatchProps & InjectedIntlProps;

class AlertComponent extends React.Component<Props> {
    public deleteAlertByIndex = (key: number) => {
        this.props.alertDeleteByIndex(key);
    };

    public translate = (id: string) => {
        return id ? this.props.intl.formatMessage({ id }) : '';
    };

    // tslint:disable:jsx-no-lambda
    public render() {
        return (
            <div className="pg-alerts">
                {this.props.alerts.alerts.map(w => w.message.map((msg, index) => (
                    <FadeIn key={index}>
                        <div onClick={() => this.deleteAlertByIndex(index)}>
                            <Alert
                                variant={w.type === 'error' ? 'danger' : w.type}
                            >
                                {this.translate(msg)}
                                {w.code && ` ${w.code.toString(10)}`}
                            </Alert>
                        </div>
                    </FadeIn>
                )))}
            </div>
        );
    }
}

const mapStateToProps = (state: RootState): ReduxProps => ({
    alerts: selectAlertState(state),
});

const mapDispatchToProps: MapDispatchToPropsFunction<DispatchProps, {}> =
    dispatch => ({
        alertDelete: () => dispatch(alertDelete()),
        alertDeleteByIndex: payload => dispatch(alertDeleteByIndex(payload)),
    });

export const Alerts = injectIntl(connect(mapStateToProps, mapDispatchToProps)(AlertComponent));
