import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import 'jest-enzyme';
import React from 'react';
import { MessageDescriptor } from 'react-intl';
import { languageMap } from '../src/translations';
import { TEST_STATE } from './state';

Enzyme.configure({ adapter: new Adapter() });

//-------------------------------------------------------------------------------------------------
// react-redux

const useSelector = jest.fn((selector: (state: any) => any) => {
    return selector(TEST_STATE);
});

jest.mock('react-redux', () => {
    const all = jest.requireActual('react-redux');
    return {
        ...all,
        useSelector,
    };
});

//-------------------------------------------------------------------------------------------------
// react-intl

function injectIntl(component: React.ReactNode): React.ReactNode {
    return component;
}

function formatMessage({ id }: MessageDescriptor): string {
    return languageMap.en[`${id}`];
}

const useIntl = jest.fn(() => {
    return { formatMessage, injectIntl };
});

jest.mock('react-intl', () => {
    const all = jest.requireActual('react-intl');
    return {
        ...all,
        useIntl,
    };
});