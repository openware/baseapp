import { shallow } from 'enzyme';
import * as React from 'react';
import { SinonSpy, spy } from 'sinon';
import { Dropdown, DropdownProps } from '.';

const defaults: DropdownProps = {
    list: ['Limit', 'Market'],
};

const setup = (props: Partial<DropdownProps> = {}) =>
    shallow(<Dropdown{...{ ...defaults, ...props }} />);

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
            const input = wrapper.find('div.cr-dropdown__input').first();
            input.simulate('click');
            const list = wrapper.find('ul').first().props();
            expect(list.className).toContain('cr-dropdown__list');
        });

        it('should close dropdown without choose value', () => {
            const input = wrapper.find('div.cr-dropdown__input').first();
            input.simulate('click');
            input.simulate('click');
            expect(wrapper.state('open')).toBeFalsy();
        });

        it('should close dropdown after choose value', () => {
            const input = wrapper.find('div.cr-dropdown__input').first();
            input.simulate('click');
            const item = wrapper.find('li').last();
            item.simulate('click');
            expect(wrapper.state('open')).toBeFalsy();
        });

        it('should change dropdown value', () => {
            const input = wrapper.find('div.cr-dropdown__input').first();
            input.simulate('click');
            // @ts-ignore
            const item = wrapper.find('li').first().props().children.props.children;
            expect(item).toBe(defaults.list[0]);
        });

        it('should handle onSelect callback', () => {
            const onClick = spy();
            wrapper = setup({ onSelect: onClick });
            const input = wrapper.find('div.cr-dropdown__input').first();
            input.simulate('click');
            const item = wrapper.find('li').last();
            item.simulate('click');
            expect((onClick as SinonSpy).calledOnceWith(1)).toBeTruthy();
        });

        it('should handle keyPress char', () => {
            expect(wrapper.state('selected')).toEqual('Limit');

            const input = wrapper.find('div.cr-dropdown__input').first().children().first();
            input.simulate('keyDown', { keyCode: 77, key: 'm', type: 'test' });

            expect(wrapper.state('searchValue')).toEqual('m');
            expect(wrapper.state('selected')).toEqual('Market');

            wrapper.setState({ searchValue: '' });
            input.simulate('keyDown', { keyCode: 77, key: 'L', type: 'test' });

            expect(wrapper.state('searchValue')).toEqual('L');
            expect(wrapper.state('selected')).toEqual('Limit');

            wrapper.setState({ searchValue: '' });
            input.simulate('keyDown', { keyCode: 65, key: 'a', type: 'test' });

            expect(wrapper.state('searchValue')).toEqual('a');
            expect(wrapper.state('selected')).toEqual('Limit');
        });

        it('should handle keyPress arrows', () => {
            expect(wrapper.state('selected')).toEqual('Limit');

            const input = wrapper.find('div.cr-dropdown__input').first().children().first();
            input.simulate('keyDown', { keyCode: 40, type: 'test' });
            expect(wrapper.state('selected')).toEqual('Market');

            input.simulate('keyDown', { keyCode: 38, type: 'test' });
            expect(wrapper.state('selected')).toEqual('Limit');
        });

        it('should shift dropdown list', () => {
            //tslint:disable:no-magic-numbers
            const newList = ['0', '1', '2', '3', '4', '5'];
            wrapper = setup({ list: newList });
            expect(wrapper.state('selected')).toEqual('0');

            const input = wrapper.find('div.cr-dropdown__input').first().children().first();
            input.simulate('keyDown', { keyCode: 40, type: 'test' });
            expect(wrapper.state('selected')).toEqual('1');

            input.simulate('keyDown', { keyCode: 40, type: 'test' });
            expect(wrapper.state('selected')).toEqual('2');
            expect(wrapper.state('topElem')).toEqual(0);

            input.simulate('keyDown', { keyCode: 40, type: 'test' });
            expect(wrapper.state('selected')).toEqual('3');
            expect(wrapper.state('topElem')).toEqual(1);

            input.simulate('keyDown', { keyCode: 40, type: 'test' });
            expect(wrapper.state('selected')).toEqual('4');
            expect(wrapper.state('topElem')).toEqual(2);

            input.simulate('keyDown', { keyCode: 40, type: 'test' });
            expect(wrapper.state('selected')).toEqual('5');
            expect(wrapper.state('topElem')).toEqual(3);

            input.simulate('keyDown', { keyCode: 40, type: 'test' });
            expect(wrapper.state('selected')).toEqual('5');
            expect(wrapper.state('topElem')).toEqual(3);

            input.simulate('keyDown', { keyCode: 38, type: 'test' });
            expect(wrapper.state('selected')).toEqual('4');
            expect(wrapper.state('topElem')).toEqual(3);

            input.simulate('keyDown', { keyCode: 38, type: 'test' });
            expect(wrapper.state('selected')).toEqual('3');
            expect(wrapper.state('topElem')).toEqual(3);

            input.simulate('keyDown', { keyCode: 38, type: 'test' });
            expect(wrapper.state('selected')).toEqual('2');
            expect(wrapper.state('topElem')).toEqual(2);

            input.simulate('keyDown', { keyCode: 38, type: 'test' });
            expect(wrapper.state('selected')).toEqual('1');
            expect(wrapper.state('topElem')).toEqual(1);

            input.simulate('keyDown', { keyCode: 38, type: 'test' });
            expect(wrapper.state('selected')).toEqual('0');
            expect(wrapper.state('topElem')).toEqual(0);

            input.simulate('keyDown', { keyCode: 38, type: 'test' });
            expect(wrapper.state('selected')).toEqual('0');
            expect(wrapper.state('topElem')).toEqual(0);
        });

        it('should handle enter keyPress', () => {
            const input = wrapper.find('div.cr-dropdown__input').first();
            input.simulate('click');
            expect(wrapper.state('isOpen')).toEqual(true);
            expect(wrapper.state('selected')).toEqual('Limit');

            const item = input.first().children().first();
            item.simulate('keyDown', { keyCode: 40, type: 'test' });
            item.simulate('keyDown', { keyCode: 13, type: 'test' });
            expect(wrapper.state('selected')).toEqual('Market');
            expect(wrapper.state('isOpen')).toEqual(false);
        });

        it('should start timer', () => {
            expect(wrapper.state('isTimerRunning')).toEqual(false);

            const input = wrapper.find('div.cr-dropdown__input').first().children().first();
            input.simulate('keyDown', { keyCode: 77, key: 'm', type: 'test' });

            expect(wrapper.state('isTimerRunning')).toEqual(true);
        });

        it('should handle null and undefined values of dropdown list', () => {
            const nullList = [null, undefined];
            wrapper = setup({ list: nullList });
            expect(wrapper.state('selected')).toEqual(''); // null

            const input = wrapper.find('div.cr-dropdown__input').first();
            input.simulate('click');
            const item = wrapper.find('li').last();
            item.simulate('click');
            expect(wrapper.state('selected')).toEqual(''); // undefined
        });
    });
});
