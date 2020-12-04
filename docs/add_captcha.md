### Add captcha to Baseapp screen

By default there is configurable captcha protection for:
- SignUp Screen
- Email Verification Screen
- Forgot Password Screen

But you can add captcha to every screen you want following next steps. (Be aware that captcha_response should be expected parametr for Backend endpoint to which Baseapp sending payload, you can it here - [Barong API](https://github.com/openware/barong/blob/master/docs/api/rest_api.md) )

#### Edit Screen

First of all you need to add `Captcha` component, captcha selectors from /modules, `CommonError` type, `ReduxProps` variables and `resetCaptchaState`

```javascript
import { Captcha } from '../../components';
import {
    Configs,
    GeetestCaptchaResponse,
    resetCaptchaState,
    selectCaptchaResponse,
    selectConfigs,
    selectGeetestCaptchaSuccess,
    selectRecaptchaSuccess,
} from '../../modules';
import { CommonError } from '../../modules/types';

interface ReduxProps {
    success: boolean;
    error?: CommonError;
    configs: Configs;
    captcha_response?: string | GeetestCaptchaResponse;
    reCaptchaSuccess: boolean;
    geetestCaptchaSuccess: boolean;
}

interface DispatchProps {
    resetCaptchaState: typeof resetCaptchaState;
}
```


You have to reset you Captcha state, so need to place `resetCaptchaState` when your component unmount or Captcha is passed (This logic can change depending on flow and Logic of your screen and component).


```javascript
    public componentWillReceiveProps(nextProps: Props) {
        if (!this.props.isSomeMethod && nextProps.isSomeMethod) {
            this.props.resetCaptchaState();
        }
    }

    public componentWillUnmount() {
        this.props.resetCaptchaState();
    }
```

Add public method `renderCaptcha` wich can have error and/or success parametrs (both optional) which identify conditions for reCaptcha reset.

```javascript
    public renderCaptcha = () => {
        const { error, success } = this.props;

        return (
            <Captcha
                error={error}
                success={success}
            />
        );
    };
```
If screen includes component inside which captcha should be rendered - pass next parametrs to the component's props:

```javascript
    const {
        configs,
        loading,
        captcha_response,
        reCaptchaSuccess,
        geetestCaptchaSuccess,
    } = this.props;

    <Component
        onSubmit={this.handleSubmit}
        captchaType={configs.captcha_type}
        renderCaptcha={this.renderCaptcha()}
        reCaptchaSuccess={reCaptchaSuccess}
        geetestCaptchaSuccess={geetestCaptchaSuccess}
        captcha_response={captcha_response}
    />

    private handleSubmit = () => {
        const { configs: { captcha_type }, captcha_response } = this.props;

        if (captcha_type === 'recaptcha' || captcha_type === 'geetest') {
                this.props.Submit({ payload, captcha_response });
        } else {
            this.props.Submit({ payload });
        }
    };
```

Pass ReduxProps to the `mapStateToProps` and `resetCaptchaState` to the `mapDispatchToProps`

```javascript
    const mapStateToProps: MapStateToProps<ReduxProps, {}, RootState> = state => ({
        success: selectSuccess(state), //Selector for success states
        error: selectError(state), //Selector for error states
        configs: selectConfigs(state),
        captcha_response: selectCaptchaResponse(state),
        reCaptchaSuccess: selectRecaptchaSuccess(state),
        geetestCaptchaSuccess: selectGeetestCaptchaSuccess(state),
    });

    const mapDispatchToProps: MapDispatchToPropsFunction<DispatchProps, {}> = dispatch => ({
        resetCaptchaState: () => dispatch(resetCaptchaState()),
    });
```
#### Edit Component

If captcha rendered inside component - add all props inside interface and add logic. Here is example - `isButtonDisabled` method which applied to the `<Button />` and make it dissabled if captcha enabled and user haven't passed it yet. Also, you should render captcha here (`renderCaptcha` in this example, right above the `<Button />`)

```javascript
import { GeetestCaptchaResponse } from '../../modules';

export interface SignInProps {
    captchaType?: 'recaptcha' | 'geetest' | 'none';
    renderCaptcha?: JSX.Element | null;
    reCaptchaSuccess?: boolean;
    geetestCaptchaSuccess?: boolean;
    captcha_response?: string | GeetestCaptchaResponse;
}
    const {
        captchaType,
        geetestCaptchaSuccess,
        reCaptchaSuccess,
        renderCaptcha,
    } = this.props;

    const isButtonDisabled = (): boolean => {
        return (((captchaType === 'recaptcha' && !reCaptchaSuccess) ||
        (captchaType === 'geetest' && !geetestCaptchaSuccess)) && captchaLogin()) ? true : false;
    };

    {renderCaptcha}
    <Button
        ...
        disabled={ isButtonDisabled() }
    </Button>
```

### Add Slectors and edit Actions

Once again, pay attention if Barong expecting captcha_response for this endpoint.

```javascript
export interface ActionFetch {
    type: typeof ACTION_FETCH;
    payload: {
        ...
        captcha_response?: string | GeetestCaptchaResponse;
    };
}
```

You need to write selectors which you will use as success and error props for `<Captcha />` component
