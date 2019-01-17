import {
    SEND_EMAIL_DATA,
    SEND_EMAIL_ERROR,
    SEND_EMAIL_FETCH,
} from './constants';

export interface ContactError {
    code?: number;
    message?: string;
}

export interface SendEmailFetch {
    type: typeof SEND_EMAIL_FETCH;
    payload: {
      sender_email: string;
      description: string;
      name: string;
      subject: string;
      recaptcha_response: string;
    };
}

export interface SendEmailData {
    type: typeof SEND_EMAIL_DATA;
}

export interface SendEmailError {
    type: typeof SEND_EMAIL_ERROR;
    payload: ContactError;
}

export type ContactActions = SendEmailFetch | SendEmailData | SendEmailError;

export const sendEmail = (payload: SendEmailFetch['payload']): SendEmailFetch => ({
    type: SEND_EMAIL_FETCH,
    payload,
});

export const sendEmailData = (): SendEmailData => ({
    type: SEND_EMAIL_DATA,
});

export const sendEmailError = (payload: SendEmailError['payload']): SendEmailError => ({
    type: SEND_EMAIL_ERROR,
    payload,
});
