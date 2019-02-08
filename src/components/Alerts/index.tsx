import { Alert } from '@openware/components';
import * as React from 'react';
import FadeIn from 'react-fade-in';
import { connect, MapDispatchToPropsFunction } from 'react-redux';
import { AlertState, deleteError, deleteErrorByIndex, RootState, selectAlertState } from '../../modules';

interface ReduxProps {
    alert: AlertState;
}

interface DispatchProps {
    deleteError: typeof deleteError;
    deleteErrorByIndex: typeof deleteErrorByIndex;
}

type Props = ReduxProps & DispatchProps;

class AlertComponent extends React.Component<Props> {

    public deleteByIndex = (key: number) => {
        this.props.deleteErrorByIndex(key);
    };

    //tslint:disable:jsx-no-lambda
    public render() {
        return (
        <div className="pg-alerts">
            {this.props.alert.error.map((w, k) => <FadeIn key={k}><div onClick={() => this.deleteByIndex(k)}><Alert description={w.code.toString(10)} title={w.message} type="error" /></div></FadeIn>)}
        </div>
      );
    }
}

const mapStateToProps = (state: RootState): ReduxProps => ({
    alert: selectAlertState(state),
});
const mapDispatchToProps: MapDispatchToPropsFunction<DispatchProps, {}> =
    dispatch => ({
        deleteError: () => dispatch(deleteError()),
        deleteErrorByIndex: payload => dispatch(deleteErrorByIndex(payload)),
    });
// tslint:disable-next-line:no-any
export const Alerts = connect(mapStateToProps, mapDispatchToProps)(AlertComponent);
