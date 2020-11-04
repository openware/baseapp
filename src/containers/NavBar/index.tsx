import * as React from 'react';
import { connect, MapDispatchToPropsFunction, MapStateToProps } from 'react-redux';
import { compose } from 'redux';

import { Moon } from '../../assets/images/Moon';
import { Sun } from '../../assets/images/Sun';
import { colors } from '../../constants';
import { changeColorTheme, RootState, selectCurrentColorTheme } from '../../modules';

export interface ReduxProps {
    colorTheme: string;
}

interface DispatchProps {
    changeColorTheme: typeof changeColorTheme;
}

export interface OwnProps {
    onLinkChange?: () => void;
}

type Props = OwnProps & ReduxProps & DispatchProps;

class NavBarComponent extends React.Component<Props> {
    public render() {
        const { colorTheme } = this.props;

        return (
            <div className={'pg-navbar'}>
                <div className="pg-navbar__header-settings">
                    <div className="pg-navbar__header-settings__switcher">
                        <div
                            className="pg-navbar__header-settings__switcher__items"
                            onClick={() =>
                                this.handleChangeCurrentStyleMode(colorTheme === 'light' ? 'dark' : 'light')
                            }>
                            {this.getLightDarkMode()}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    private getLightDarkMode = () => {
        const { colorTheme } = this.props;

        if (colorTheme === 'dark') {
            return (
                <React.Fragment>
                    <div className="switcher-item">
                        <Sun fillColor={colors.light.navbar.sun} />
                    </div>
                    <div className="switcher-item switcher-item--active">
                        <Moon fillColor={colors.light.navbar.moon} />
                    </div>
                </React.Fragment>
            );
        }

        return (
            <React.Fragment>
                <div className="switcher-item switcher-item--active">
                    <Sun fillColor={colors.dark.navbar.sun} />
                </div>
                <div className="switcher-item">
                    <Moon fillColor={colors.dark.navbar.moon} />
                </div>
            </React.Fragment>
        );
    };

    private handleChangeCurrentStyleMode = (value: string) => {
        this.props.changeColorTheme(value);
    };
}

const mapStateToProps: MapStateToProps<ReduxProps, unknown, RootState> = (state: RootState): ReduxProps => ({
    colorTheme: selectCurrentColorTheme(state),
});

const mapDispatchToProps: MapDispatchToPropsFunction<DispatchProps, unknown> = (dispatch) => ({
    changeColorTheme: (payload) => dispatch(changeColorTheme(payload)),
});

export const NavBar = compose(connect(mapStateToProps, mapDispatchToProps))(NavBarComponent) as any; // tslint:disable-line
