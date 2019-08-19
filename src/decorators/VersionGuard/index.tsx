import * as React from 'react';
import {connect, MapDispatchToPropsFunction} from 'react-redux';
import {
    openGuardModal,
    RootState,
    selectAppVersion,
} from '../../modules';


export const VersionGuardWrapper = (EnterpriseComponent, LiteComponent?, locked=true) => {
    interface ReduxProps {
        version: string;
    }

    interface DispatchProps {
        openGuardModal: typeof openGuardModal;
    }

    type Props = ReduxProps & DispatchProps;

    class VersionGuard extends React.Component<Props> {
        public render() {
            const { version } = this.props;

            if (version === 'lite') {
                return (
                    <div className="guard-version">
                        {LiteComponent  && locked && this.renderLocker()}
                        {LiteComponent && <LiteComponent {...this.props} openModal={this.props.openGuardModal}/>}
                    </div>
                );
            }

            return <EnterpriseComponent {...this.props}/>;
        }

        public renderLocker = () => {
            return (
                <div className="guard-version-locked">
                    <img
                        className="guard-version-locked-img"
                        src={require('../../assets/images/locked.svg')}
                        alt="locked"
                    />
                    <p className="guard-version-locked-text">This feature is unavailable</p>
                    <p className="guard-version-locked-text">
                        For unlocking please visit&nbsp;
                        <a href="https://www.openware.com/" className="guard-version-locked-text">openware.com</a>
                    </p>
                </div>
            );
        };
    }

    const mapStateToProps = (state: RootState): ReduxProps => ({
        version: selectAppVersion(state),
    });

    const mapDispatchToProps: MapDispatchToPropsFunction<DispatchProps, {}> =
        dispatch => ({
            openGuardModal: () => dispatch(openGuardModal()),
        });

    // tslint:disable-next-line no-any
    const Guard =  connect(mapStateToProps, mapDispatchToProps)(VersionGuard) as any;

    return <Guard/>;
};
