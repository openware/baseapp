import React, { memo, useEffect, useRef } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';
import { useDispatch, useSelector } from 'react-redux';

import { GeetestCaptcha } from '../../containers';
import { useSetShouldGeetestReset } from '../../hooks';
import {
    GeetestCaptchaResponse,
    selectConfigs,
    selectShouldGeetestReset,
    setGeetestCaptchaSuccess,
    setRecaptchaSuccess,
} from '../../modules';

export const CaptchaComponent = (props) => {
    const dispatch = useDispatch();
    const configs = useSelector(selectConfigs);
    const shouldGeetestReset = useSelector(selectShouldGeetestReset);

    const reCaptchaRef = useRef<any>();
    const geetestCaptchaRef = useRef<any>(null);

    useEffect(() => {
        if (props.error || props.success) {
            if (reCaptchaRef.current) {
                reCaptchaRef.current.reset();
            }
        }
    }, [props.error, props.success, reCaptchaRef]);

    useSetShouldGeetestReset(props.error, props.success, geetestCaptchaRef);

    const handleRecaptchaChange = (value: string) => {
        dispatch(setRecaptchaSuccess({ captcha_response: value }));
    };

    const handleGeetestCaptchaChange = (value?: GeetestCaptchaResponse) => {
        dispatch(setGeetestCaptchaSuccess({ captcha_response: value }));
    };

    const renderCaptcha = () => {
        switch (configs.captcha_type) {
            case 'recaptcha':
                return (
                    <div className="pg-captcha--recaptcha">
                        <ReCAPTCHA ref={reCaptchaRef} sitekey={configs.captcha_id} onChange={handleRecaptchaChange} />
                    </div>
                );
            case 'geetest':
                return (
                    <div className="pg-captcha--geetest">
                        <GeetestCaptcha
                            ref={geetestCaptchaRef}
                            shouldCaptchaReset={shouldGeetestReset}
                            onSuccess={handleGeetestCaptchaChange}
                        />
                    </div>
                );
            default:
                return null;
        }
    };

    return renderCaptcha();
};

export const Captcha = memo(CaptchaComponent);
