import React from 'react';
import { MessageDescriptor } from 'react-intl';

import { languageMap } from '../src/translations';

function injectIntl(component: React.ReactNode): React.ReactNode {
    return component;
}

function formatMessage({ id }: MessageDescriptor): string {
    return languageMap.en[`${id}`];
}

export const useIntl = jest.fn(() => {
    return { formatMessage, injectIntl };
});
