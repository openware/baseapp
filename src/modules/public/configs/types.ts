export interface Configs {
    captcha_type: 'recaptcha' | 'geetest' | 'none';
    captcha_id?: string;
    min_password_length?: number;
    min_password_score?: number;
}
