import * as React from 'react';
import {
    connect,
    MapStateToProps,
} from 'react-redux';
import {
    geetestCaptchaFetch,
    GeetestCaptchaKeys,
    GeetestCaptchaResponse,
    RootState,
    selectCaptchaKeys,
    selectCurrentLanguage,
} from '../../modules';

import initGeetest = require("../../helpers/geetest.js")

interface OwnProps {
    shouldCaptchaReset?: boolean;
    onSuccess?: (value?: GeetestCaptchaResponse) => void;
}

interface ReduxProps {
    lang: string;
    geetestCaptchaKeys?: GeetestCaptchaKeys;
}

interface DispatchProps {
    geetestCaptchaFetch: typeof geetestCaptchaFetch;
}

type Props = ReduxProps & DispatchProps & OwnProps;

class GeetestCaptchaComponent extends React.Component<Props> {

    public constructor(props) {
        super(props);
        this.captchaContainerRef = React.createRef();
    }

    private captchaContainerRef;
    private captcha;

    public componentDidMount() {
        this.props.geetestCaptchaFetch();
    }

    public componentWillReceiveProps(next: Props) {
        if (this.props.geetestCaptchaKeys !== next.geetestCaptchaKeys && next.geetestCaptchaKeys !== undefined) {
            const {
                geetestCaptchaKeys,
                lang,
            } = next;
            initGeetest({
                gt: geetestCaptchaKeys.gt,
                challenge: geetestCaptchaKeys.challenge,
                offline: 0,
                new_captcha: false,
                product: 'popup',
                width: '100%',
                lang: lang,
                https: true,
            }, this.captchaComingHandler);
        }

        if (!this.props.shouldCaptchaReset && next.shouldCaptchaReset) {
            this.reset();
        }
    }

    public validate = () => {
        return this.captcha && this.captcha.getValidate();
    };

    public reset = () => {
        return this.captcha && this.captcha.reset();
    };

    public render() {
        return <div ref={this.captchaContainerRef} />;
    }

    private captchaComingHandler = captcha => {
        this.captcha = captcha;
        this.captcha.appendTo(this.captchaContainerRef.current);
        this.captcha.onSuccess(this.captchaSuccessHandler);
    };

    private captchaSuccessHandler = () => {
        if (this.props.onSuccess) {
            this.props.onSuccess(this.validate());
        }
    };
}

const mapDispatchProps = {
    geetestCaptchaFetch,
};

const mapStateToProps: MapStateToProps<ReduxProps, {}, RootState> =
    (state: RootState): ReduxProps => ({
        lang: selectCurrentLanguage(state),
        geetestCaptchaKeys: selectCaptchaKeys(state),
    });

export const GeetestCaptcha = connect(mapStateToProps, mapDispatchProps)(GeetestCaptchaComponent);
