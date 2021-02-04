import React, { useCallback } from 'react';
import classNames from 'classnames';
import { OwIcon, ThemeName } from '@openware/react-components';
import { useDispatch } from 'react-redux';
import { changeColorTheme, selectCurrentColorTheme } from '../../modules';
import { useReduxSelector } from 'src/hooks';

import './index.scss';

export const NavBar: React.FC = () => {
    const dispatch = useDispatch();
    const colorTheme: ThemeName = useReduxSelector(selectCurrentColorTheme) as any;

    const handleClick = useCallback(() => {
        const newTheme = colorTheme === 'light' ? 'dark' : 'light';
        dispatch(changeColorTheme(newTheme));
    }, [colorTheme]);

    return (
        <div
            className={classNames('nav-bar-component', {
                'nav-bar-component__light': colorTheme === 'light',
                'nav-bar-component__dark': colorTheme === 'dark',
            })}
            onClick={handleClick}>
            <OwIcon name={colorTheme === 'light' ? 'moon' : 'sun'} />
        </div>
    );
};
