
import * as React from 'react';
import { pluginsList } from '../../api/config';

export const ieoPlugin = pluginsList && pluginsList().find(item => item.name === 'ieo');

export const ieoTypesList = ieoPlugin ? ieoPlugin.config.types : [];
export const ieoTitle = ieoPlugin ? ieoPlugin.config.fields.name : 'IEO';
export const ieoFields = ieoPlugin ? ieoPlugin.config.fields : {};

export const ieoMenuItem = (isLoggedIn: boolean, isLight?: boolean) => [
    ['page.header.navbar.ieo', `/${ieoTitle.toLowerCase()}`,`${ieoTitle.toLowerCase()}${isLight ? 'Light' : ''}`],
];

export const ieoTranslations = (lang: string) => {
    const file = require(`./translations/${lang}`);

    return file[lang];
};

export const ieoMenuIcons = (name: string, className?: string) => {
    switch (name) {
        case `${ieoTitle.toLowerCase()}`:
            return (
                <svg width="22" height="17" viewBox="0 0 22 17" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" clipRule="evenodd" d="M12 8H19V9.5H12V8ZM12 5.5H19V7H12V5.5ZM12 10.5H19V12H12V10.5ZM20 0H2C1.46957 0 0.960859 0.210714 0.585786 0.585786C0.210714 0.960859 0 1.46957 0 2V15C0 15.5304 0.210714 16.0391 0.585786 16.4142C0.960859 16.7893 1.46957 17 2 17H20C20.5304 17 21.0391 16.7893 21.4142 16.4142C21.7893 16.0391 22 15.5304 22 15V2C22 1.46957 21.7893 0.960859 21.4142 0.585786C21.0391 0.210714 20.5304 0 20 0ZM20 15H11V2H20" fill="#979797"/>
                </svg>
            );
        default: return null;
    }
};
