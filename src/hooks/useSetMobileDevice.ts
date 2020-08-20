import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectMobileDeviceState, setMobileDevice } from '../modules';

export const useSetMobileDevice = () => {
    const isMobileDevice = useSelector(selectMobileDeviceState);
    const dispatch = useDispatch();

    React.useEffect(() => {
        const handleResize = () => {
            const isMobileDeviceCurrent = (window.innerWidth < 768) || (window.innerHeight < 600);

            window.console.log('here');

            if (isMobileDevice !== isMobileDeviceCurrent) {
                dispatch(setMobileDevice(isMobileDeviceCurrent));
            }
        };

        window.addEventListener('resize', handleResize);
        handleResize();

        return () => window.removeEventListener('resize', handleResize);
    }, [dispatch, isMobileDevice]);
};
