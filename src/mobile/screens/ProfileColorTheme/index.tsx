import classnames from 'classnames';
import * as React from 'react';
import { useIntl } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import {
    changeColorTheme,
    selectCurrentColorTheme,
} from '../../../modules';
import { CheckIcon } from '../../assets/images/CheckIcon';

const COLOR_THEMES = ['basic', 'light'];

const ProfileThemeMobileScreenComponent = () => {
    const intl = useIntl();
    const dispatch = useDispatch();
    const currentColorTheme = useSelector(selectCurrentColorTheme);

    const handleChangeColorTheme = (colorTheme: string) => {
        if (colorTheme !== currentColorTheme) {
            dispatch(changeColorTheme(colorTheme));
        }
    };

    const renderThemeListItem = (colorTheme, index) => {
        const listItemClassName = classnames('pg-mobile-profile-theme-screen__list__item', {
            'pg-mobile-profile-theme-screen__list__item--active': colorTheme === currentColorTheme,
        });

        return (
            <div
                key={index}
                className={listItemClassName}
                onClick={() => handleChangeColorTheme(colorTheme)}
            >
                <span>{intl.formatMessage({id: `page.mobile.profileColorTheme.theme.${colorTheme}`})}</span>
                <CheckIcon />
            </div>
        );
    };

    return (
        <div className="pg-mobile-profile-theme-screen">
            <div className="pg-mobile-profile-theme-screen__list">
                {COLOR_THEMES.map(renderThemeListItem)}
            </div>
        </div>
    );
};

export const ProfileThemeMobileScreen = React.memo(ProfileThemeMobileScreenComponent);
