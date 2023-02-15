import classnames from 'classnames';
import * as React from 'react';
import { useIntl } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import { changeColorTheme, selectCurrentColorTheme } from '../../../modules';
import { CheckIcon } from '../../assets/images/CheckIcon';
import { Subheader } from '../../components/Subheader';

const COLOR_THEMES = ['dark', 'light'];

const ProfileThemeMobileScreenComponent: React.FC = () => {
    const intl = useIntl();
    const history = useHistory();
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
            <div key={index} className={listItemClassName} onClick={() => handleChangeColorTheme(colorTheme)}>
                <span>
                    {intl.formatMessage({
                        id: `page.mobile.profileColorTheme.theme.${colorTheme}`,
                    })}
                </span>
                <CheckIcon />
            </div>
        );
    };

    return (
        <React.Fragment>
            <Subheader
                title={intl.formatMessage({ id: 'page.mobile.profile.theme.title' })}
                backTitle={intl.formatMessage({ id: 'page.body.profile.header.account' })}
                onGoBack={() => history.push('/profile')}
            />
            <div className="pg-mobile-profile-theme-screen">
                <div className="pg-mobile-profile-theme-screen__list">{COLOR_THEMES.map(renderThemeListItem)}</div>
            </div>
        </React.Fragment>
    );
};

export const ProfileThemeMobileScreen = React.memo(ProfileThemeMobileScreenComponent);
