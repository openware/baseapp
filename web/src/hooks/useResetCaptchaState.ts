import * as React from 'react';
import { useDispatch } from 'react-redux';
import { resetCaptchaState } from '../modules';

export const useResetCaptchaState = () => {
    const dispatch = useDispatch();

    React.useEffect(() => {
        dispatch(resetCaptchaState());
    }, [dispatch]);
};
