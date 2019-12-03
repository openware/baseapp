import { shallow, ShallowWrapper } from 'enzyme';
import * as React from 'react';
import { SinonSpy, spy } from 'sinon';
import { HideMode, TabPanel, TabPanelProps } from './TabPanel';

const defaultProps: TabPanelProps = {
    panels: [
        {
            content: (
                <div>
                    <h4>Deposit</h4>
                    <p>Some deposit tab content</p>
                </div>
            ),
            label: 'Deposit',
        },
        {
            content: (
                <div>
                    <h4>Withdraw</h4>
                    <p>Some withdraw tab content</p>
                </div>
            ),
            label: 'Withdraw',
        },
        {
            content: (
                <div>
                    <h4>Disabled</h4>
                    <p>Disabled lorem ipsum dolor sit amet.</p>
                </div>
            ),
            label: 'Disabled',
            disabled: true,
        },
    ],
};

const setup = (props: Partial<TabPanelProps> = {}) =>
    shallow(<TabPanel {...{ ...defaultProps, ...props }} />);

describe('TabPanel', () => {
    let wrapper: ShallowWrapper;

    beforeEach(() => {
        wrapper = setup();
    });

    it('should render', () => {
        expect(wrapper).toMatchSnapshot();
    });

    it('should have correct className', () => {
        expect(wrapper.hasClass('cr-tab-panel')).toBeTruthy();
    });

    it('should have correct fixed className', () => {
        wrapper = setup({ fixed: true });
        expect(wrapper.hasClass('cr-tab-panel__fixed')).toBeTruthy();
    });

    it('should render tabs', () => {
        // tslint:disable-next-line:no-magic-numbers
        expect(wrapper.find('.cr-tab')).toHaveLength(3);
    });

    it('should mount all passed content when hideMode is `hide`', () => {
        // tslint:disable-next-line:no-magic-numbers
        expect(wrapper.find('.cr-tab-content')).toHaveLength(3);
    });

    it('should mount only active content when hideMode is `unmount`', () => {
        wrapper = setup({ hideMode: 'unmount' as HideMode.unmount });
        expect(wrapper.find('.cr-tab-content')).toHaveLength(1);
    });

    it('should render correct class for active tab', () => {
        wrapper.setState({ currentTabIndex: 1 });

        const activeTab = wrapper.find('.cr-tab').at(1);
        expect(activeTab.hasClass('cr-tab__active')).toBeTruthy();
    });

    it('should render disabled tab', () => {
        wrapper = setup({
            panels: [
                {
                    content: (
                        <p>Deposit</p>
                    ),
                    disabled: true,
                    label: 'Deposit',
                },
            ],
        });

        const disabledTab = wrapper.find('.cr-tab').at(0);
        expect(disabledTab.hasClass('cr-tab__disabled')).toBeTruthy();
    });

    it('should render hidden tab', () => {
        wrapper = setup({
            panels: [
                {
                    content: (
                        <p>Deposit</p>
                    ),
                    hidden: true,
                    label: 'Deposit',
                },
            ],
        });

        const hiddenTab = wrapper.find('.cr-tab').at(0);
        expect(hiddenTab.hasClass('cr-tab__hidden')).toBeTruthy();
    });

    it('should handle onTabChange callback when a tab is pressed', () => {
        const onTabChange = spy();
        wrapper = setup({ onTabChange });

        const tab = wrapper.find('.cr-tab').at(1);
        tab.simulate('click');

        expect((onTabChange as SinonSpy).calledOnceWith(1, 'Withdraw')).toBeTruthy();
    });

    it('should handle onTabChange callback when a disable tab is pressed', () => {
        wrapper = setup();
        const secondTab = wrapper.find('.cr-tab').at(1);
        const disabledTab = wrapper.find('.cr-tab').last();

        disabledTab.simulate('click');
        expect(wrapper.state()).toEqual({ currentTabIndex: 0 });

        secondTab.simulate('click');
        expect(wrapper.state()).toEqual({ currentTabIndex: 1 });
    });
});
