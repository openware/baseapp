import { shallow } from 'enzyme';
import * as React from 'react';
import { Pagination } from '.';


describe('Pagination', () => {
    const props = {
        firstElemIndex: 1,
        lastElemIndex: 6,
        total: 30,
        page: 0,
        nextPageExists: true,
        onClickPrevPage: jest.fn(),
        onClickNextPage: jest.fn(),
    };

    it('renders without crashing', () => {
        const wrapper = shallow(<Pagination {...props}/>);
        expect(wrapper).toBeDefined();
    });

    it('should have correct className', () => {
        const wrapper = shallow(<Pagination {...props}/>);
        expect(wrapper.hasClass('pg-history-elem__pagination'));
    });

    it('has pagination info with right text', () => {
        const wrapper = shallow(<Pagination {...props}/>);
        expect(wrapper.find('p').text()).toEqual('1 - 6 of 30');
    });

    it('should test click on prev page', () => {
        const spyClickPrev = jest.fn();
        const wrapper = shallow(<Pagination {...{...props, ...{ onClickPrevPage: spyClickPrev }}}/>);
        const prevButton = wrapper.find('.pg-history__pagination-prev');

        prevButton.simulate('click');
        expect(spyClickPrev).toHaveBeenCalledTimes(0);

        wrapper.setProps({ page: 1 });
        prevButton.simulate('click');
        expect(spyClickPrev).toHaveBeenCalledTimes(1);
    });

    it('should test click on next page', () => {
        const spyClickNext = jest.fn();
        const wrapper = shallow(<Pagination {...{...props, ...{ onClickNextPage: spyClickNext }}}/>);
        const prevButton = wrapper.find('.pg-history__pagination-next');

        prevButton.simulate('click');
        expect(spyClickNext).toHaveBeenCalledTimes(1);

        wrapper.setProps({ nextPageExists: false });
        prevButton.simulate('click');
        expect(spyClickNext).toHaveBeenCalledTimes(1);
    });

    it('should matches snapshot', () => {
        const wrapper = shallow(<Pagination {...props}/>);
        expect(wrapper).toMatchSnapshot();
    });
});
