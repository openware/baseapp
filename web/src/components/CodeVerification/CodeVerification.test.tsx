import { shallow } from 'enzyme';
import * as React from 'react';
import { TestComponentWrapper } from 'lib/test';
import { CodeVerification, CodeVerificationProps } from '../';

const defaultProps: CodeVerificationProps = {
    placeholder: '',
    type: '',
    codeLength: 6,
    code: '',
    onChange: jest.fn(),
    onSubmit: jest.fn(),
};

const setup = (props: Partial<CodeVerificationProps> = {}) =>
    shallow(<TestComponentWrapper><CodeVerification {...{ ...defaultProps, ...props }} /></TestComponentWrapper>);

describe('CodeVerification test', () => {
    it('should render', () => {
        const wrapper = setup();
        expect(wrapper).toMatchSnapshot();
        expect(wrapper).toBeDefined();
    });
});
