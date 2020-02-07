export interface Configs {
    captcha_type: 'recaptcha' | 'geetest' | 'none';
    captcha_id?: string;
    password_min_entropy: number;
}
