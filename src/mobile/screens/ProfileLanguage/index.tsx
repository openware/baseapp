import classnames from 'classnames';
import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { languages } from '../../../api/config';
import { getLanguageName } from '../../../helpers';
import {
    changeLanguage,
    changeUserDataFetch,
    selectCurrentLanguage,
    selectUserInfo,
    selectUserLoggedIn,
} from '../../../modules';
import { CheckIcon } from '../../assets/images/CheckIcon';

const ProfileLanguageMobileScreenComponent = () => {
    const dispatch = useDispatch();
    const user = useSelector(selectUserInfo);
    const isLoggedIn = useSelector(selectUserLoggedIn);
    const currentLanguage = useSelector(selectCurrentLanguage);

    const handleChangeLanguage = (language: string) => {
        if (isLoggedIn) {
            const data = user.data && JSON.parse(user.data);

            if (data && data.language && data.language !== language) {
                const payload = {
                    ...user,
                    data: JSON.stringify({
                        ...data,
                        language,
                    }),
                };

                dispatch(changeUserDataFetch({ user: payload }));
            }
        }

        dispatch(changeLanguage(language));
    };

    const renderLanguageListItem = (language, index) => {
        const listItemClassName = classnames('pg-mobile-profile-language-screen__list__item', {
            'pg-mobile-profile-language-screen__list__item--active': language === currentLanguage,
        });

        return (
            <div
                key={index}
                className={listItemClassName}
                onClick={() => handleChangeLanguage(language)}
            >
                <span>{getLanguageName(language)}</span>
                <CheckIcon />
            </div>
        );
    };

    return (
        <div className="pg-mobile-profile-language-screen">
            <div className="pg-mobile-profile-language-screen__list">
                {languages.map(renderLanguageListItem)}
            </div>
        </div>
    );
};

export const ProfileLanguageMobileScreen = React.memo(ProfileLanguageMobileScreenComponent);
