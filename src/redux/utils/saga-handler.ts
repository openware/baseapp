import { ActionWith } from 'lib/interfaces';
import { ApiException } from '../interfaces';

export const SagaHandler = {
    handleException: (exception: ApiException): any[] => {
        const actions: ActionWith[] = [];
        // unauthorized
        try {
            if (exception.statusCode === 401) {
                // actions.push(put(AuthActions.signOutRequest()));
                // actions.push(put(CommonActions.dialog(DialogNames.SIGN_IN, {})));
            } else {
                // actions.push(
                //     put(
                //         CommonActions.showToast({
                //             message: exception.message,
                //             icon: 'error',
                //             intent: 'danger'
                //         })
                //     )
                // );
            }
            return actions;
        } catch (e) {
            console.error(e);
        }
    },
};
