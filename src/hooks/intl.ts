import { useCallback } from 'react';
import { useIntl } from 'react-intl';

export function useLocalization(): (id: string, values?: any) => string {
    const { formatMessage } = useIntl();

    const getText = useCallback(
        (id: string, values?: any) => {
            return formatMessage({ id }, values);
        },
        [formatMessage]
    );

    return getText;
}
