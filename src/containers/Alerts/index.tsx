import { Alert } from '@openware/components';
import * as React from 'react';
import FadeIn from 'react-fade-in';
import {
    InjectedIntlProps,
    injectIntl,
    intlShape,
} from 'react-intl';
import { connect, MapDispatchToPropsFunction } from 'react-redux';
import {
    AlertState,
    deleteError,
    deleteErrorByIndex,
    deleteSuccessByIndex,
    RootState,
    selectAlertState,
} from '../../modules';

interface ReduxProps {
    alert: AlertState;
}

interface DispatchProps {
    deleteError: typeof deleteError;
    deleteErrorByIndex: typeof deleteErrorByIndex;
    deleteSuccessByIndex: typeof deleteSuccessByIndex;
}

type Props = ReduxProps & DispatchProps & InjectedIntlProps;

class AlertComponent extends React.Component<Props> {
    //tslint:disable-next-line:no-any
    public static propTypes: React.ValidationMap<any> = {
        intl: intlShape.isRequired,
    };

    public deleteErrorByIndex = (key: number) => {
        this.props.deleteErrorByIndex(key);
    };

    public deleteSuccessByIndex = (key: number) => {
        this.props.deleteSuccessByIndex(key);
    };

    public translate = (id: string) => {
        return this.props.intl.formatMessage({ id });
    };

    //tslint:disable:jsx-no-lambda
    public render() {
        return (
        <div className="pg-alerts">
            {this.props.alert.error.map((w, k) => <FadeIn key={k}><div onClick={() => this.deleteErrorByIndex(k)}><Alert description={w.code.toString(10)} title={w.message} type="error" /></div></FadeIn>)}
            {this.props.alert.success.map((w, k) => <FadeIn key={k}><div onClick={() => this.deleteSuccessByIndex(k)}><Alert description="" title={this.translate(w)} type="success" /></div></FadeIn>)}
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
        deleteSuccessByIndex: payload => dispatch(deleteSuccessByIndex(payload)),
    });

export const Alerts = injectIntl(connect(mapStateToProps, mapDispatchToProps)(AlertComponent));
