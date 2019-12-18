import { shallow } from 'enzyme';
import * as React from 'react';
import { QRCode } from '.';

describe('QRCode', () => {
    it('has qr-code className', () => {
        // tslint:disable-next-line:no-magic-numbers
        const wrapper = shallow(<QRCode data="sevaerverv343" dimensions={118} />);
        expect(wrapper.hasClass('qr-code'));
    });

    it('renders correctly', () => {
        // tslint:disable-next-line:no-magic-numbers
        const wrapper = shallow(<QRCode data="sevaerverv343" dimensions={118} />);
        expect(wrapper).toMatchSnapshot();
    });
});
