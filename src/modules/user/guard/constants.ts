export const OPEN_GUARD_MODAL = 'guard/OPEN_GUARD_MODAL';
export const CLOSE_GUARD_MODAL = 'guard/CLOSE_GUARD_MODAL';
export const LICENSE_FETCH = 'guard/LICENSE_FETCH';
export const LICENSE_DATA = 'guard/LICENSE_DATA';
export const LICENSE_ERROR = 'guard/LICENSE_ERROR';
export const SET_LICENSE_EXPIRATION = 'guard/SET_LICENSE_EXPIRATION';

export const BUILD_TYPE = process.env.REACT_APP_BUILD_VERSION || 'Lite';
export const BUILD_EXPIRE = process.env.REACT_APP_BUILD_EXPIRE || '';
export const TENKO_PUBLIC_KEY = process.env.REACT_APP_TENKO_PUBLIC_KEY || '';
