import { ToastParams } from './params';

export interface CommonState {
    dialog: {
        [key: string]: any;
    };
    loading: {
        [key: string]: boolean;
    };
    toast: ToastParams | undefined;
    initialized: boolean;
}
