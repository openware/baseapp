import { shallow } from 'enzyme';
import * as React from 'react';
import { CodeVerification, CodeVerificationProps } from '../';

const defaultProps: CodeVerificationProps = {
    placeholder: '',
    type: '',
    codeLength: 6,
    code: '',
    onChange: jest.fn(),
    onSubmit: jest.fn(),
};

const setup = (props: Partial<CodeVerificationProps> = {}) => shallow(<CodeVerification {...{...props, ...defaultProps}} />);

describe('CodeVerification test', () => {
    it('should render', () => {
        const wrapper = setup();
        expect(wrapper).toMatchSnapshot();
        expect(wrapper).toBeDefined();
    });
});
