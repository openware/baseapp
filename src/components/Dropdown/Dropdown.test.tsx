import { shallow } from 'enzyme';
import * as React from 'react';
import { DropdownComponent, DropdownComponentProps } from '.';
import { ChevronIcon } from '../../assets/images/ChevronIcon';

const defaults: DropdownComponentProps = {
    list: ['Limit', 'Market'],
};

const setup = (props: Partial<DropdownComponentProps> = {}) =>
    shallow(<DropdownComponent{...{ ...defaults, ...props }} />);

describe('Dropdown', () => {
    let wrapper = setup();

    beforeEach(() => {
       wrapper = setup();
    });

    describe('#render', () => {
        it('should render dropdown', () => {
            expect(wrapper).toMatchSnapshot();
        });

        it('should have default className', () => {
            const className = wrapper.find('div').first().props().className;
            expect(className).toContain('cr-dropdown');
        });

        it('should open dropdown on click', () => {
            const input = wrapper.find('div.cr-dropdown').first();
            input.simulate('click');
            const list = wrapper.find('div').first().props();
            expect(list.className).toContain('cr-dropdown');
        });

        it('should close dropdown without choose value', () => {
            const input = wrapper.find('div.cr-dropdown').first();
            input.simulate('click');
            input.simulate('click');
            expect(wrapper.state('open')).toBeFalsy();
        });

        it('should close dropdown after choose value', () => {
            const input = wrapper.find('div.cr-dropdown').first();
            input.simulate('click');
            const item = wrapper.find('div').last();
            item.simulate('click');
            expect(wrapper.state('open')).toBeFalsy();
        });

        it('should change dropdown value', () => {
            const input = wrapper.find('div.cr-dropdown').first();
            input.simulate('click');
            // @ts-ignore
            const item = wrapper.find('div').first().props().children.props.children[0].props.children;
            expect(item).toStrictEqual([defaults.list[0], <ChevronIcon className="cr-dropdown__arrow" />]);
        });

        it('should handle keyPress char', () => {
            expect(wrapper.state('selected')).toEqual('Limit');

            const input = wrapper.find('div.cr-dropdown').first().children().first();
            input.simulate('keyDown', { keyCode: 77, key: 'm', type: 'test' });

            wrapper.setState({ searchValue: '' });
            input.simulate('keyDown', { keyCode: 77, key: 'L', type: 'test' });

            wrapper.setState({ searchValue: '' });
            input.simulate('keyDown', { keyCode: 65, key: 'a', type: 'test' });
        });

        it('should handle keyPress arrows', () => {
            expect(wrapper.state('selected')).toEqual('Limit');

            const input = wrapper.find('div.cr-dropdown').first().children().first();
            input.simulate('keyDown', { keyCode: 40, type: 'test' });
            expect(wrapper.state('selected')).toEqual('Limit');

            input.simulate('keyDown', { keyCode: 38, type: 'test' });
            expect(wrapper.state('selected')).toEqual('Limit');
        });

        it('should handle enter keyPress', () => {
            const input = wrapper.find('div.cr-dropdown').first();
            input.simulate('click');
            expect(wrapper.state('selected')).toEqual('Limit');

            const item = input.first().children().first();
            item.simulate('keyDown', { keyCode: 40, type: 'test' });
            item.simulate('keyDown', { keyCode: 13, type: 'test' });
            expect(wrapper.state('selected')).toEqual('Limit');
        });
    });
});
