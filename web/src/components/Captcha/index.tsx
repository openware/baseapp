import * as React from 'react';
import ReCAPTCHA from 'react-google-recaptcha';
import { useDispatch, useSelector } from 'react-redux';
import { captchaId, captchaType } from '../../api/config';
import { GeetestCaptcha } from '../../containers';
import { useSetShouldGeetestReset } from '../../hooks';
import {
    GeetestCaptchaResponse,
    selectShouldGeetestReset,
    setGeetestCaptchaSuccess,
    setRecaptchaSuccess,
} from '../../modules';

export const CaptchaComponent = (props) => {
    const dispatch = useDispatch();
    const shouldGeetestReset = useSelector(selectShouldGeetestReset);

    let reCaptchaRef;

    reCaptchaRef = React.useRef();
    const geetestCaptchaRef = React.useRef(null);

    React.useEffect(() => {
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
        switch (captchaType()) {
            case 'recaptcha':
                return (
                    <div className="pg-captcha--recaptcha">
                        {captchaId() && (
                            <ReCAPTCHA ref={reCaptchaRef} sitekey={captchaId()} onChange={handleRecaptchaChange} />
                        )}
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

export const Captcha = React.memo(CaptchaComponent);
