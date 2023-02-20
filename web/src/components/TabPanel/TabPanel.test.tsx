import { fireEvent, render } from '@testing-library/react';
import React from 'react';
import { HideMode, TabPanel, TabPanelProps } from './';

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
    onCurrentTabChange: jest.fn(),
    currentTabIndex: 0,
};

const renderComponent = (props: Partial<TabPanelProps> = {}) => render(<TabPanel {...{ ...defaultProps, ...props }} />);

describe('TabPanel', () => {
    let component;

    beforeEach(() => {
        component = renderComponent();
    });

    it('should render', () => {
        expect(component.container).toMatchSnapshot();
    });

    it('should have correct className', () => {
        expect(component.container.querySelector('.cr-tab-panel')).toBeInTheDocument();
    });

    it('should have correct fixed className', () => {
        const { rerender } = component;
        rerender(<TabPanel {...{ ...defaultProps, fixed: true }} />);
        expect(component.container.querySelector('.cr-tab-panel__fixed')).toBeInTheDocument();
    });

    it('should render tabs', () => {
        expect(component.container.querySelectorAll('.cr-tab')).toHaveLength(3);
    });

    it('should mount all passed content when hideMode is `hide`', () => {
        expect(component.container.querySelectorAll('.cr-tab-content')).toHaveLength(3);
    });

    it('should mount only active content when hideMode is `unmount`', () => {
        const { rerender } = component;
        rerender(<TabPanel {...{ ...defaultProps, hideMode: 'unmount' as HideMode.unmount }} />);
        expect(component.container.querySelectorAll('.cr-tab-content')).toHaveLength(1);
    });

    it('should render correct class for active tab', () => {
        expect(component.container.querySelector('.cr-tab')).toBeInTheDocument();
        expect(component.container.querySelector('.cr-tab__active')).toBeInTheDocument();
    });

    it('should render disabled tab', () => {
        const { rerender } = component;
        rerender(
            <TabPanel
                {...{
                    ...defaultProps,
                    panels: [
                        {
                            content: <p>Deposit</p>,
                            disabled: true,
                            label: 'Deposit',
                        },
                    ],
                }}
            />,
        );

        expect(component.container.querySelector('.cr-tab')).toBeInTheDocument();
        expect(component.container.querySelector('.cr-tab__disabled')).toBeInTheDocument();
    });

    it('should render hidden tab', () => {
        const { rerender } = component;
        rerender(
            <TabPanel
                {...{
                    ...defaultProps,
                    panels: [
                        {
                            content: <p>Deposit</p>,
                            hidden: true,
                            label: 'Deposit',
                        },
                    ],
                }}
            />,
        );

        expect(component.container.querySelector('.cr-tab')).toBeInTheDocument();
        expect(component.container.querySelector('.cr-tab__hidden')).toBeInTheDocument();
    });

    it('should handle onTabChange callback when a tab is pressed', () => {
        const onTabChange = jest.fn();
        const { rerender } = component;

        rerender(<TabPanel {...{ ...defaultProps, onTabChange }} />);

        fireEvent.click(component.container.querySelectorAll('.cr-tab')[1]);
        expect(onTabChange).toHaveBeenCalled();
        expect(onTabChange).toHaveBeenCalledTimes(1);
    });

    it('should handle onTabChange callback when a disable tab is pressed', () => {
        const onCurrentTabChange = jest.fn();
        const { rerender } = component;

        rerender(<TabPanel {...{ ...defaultProps, onCurrentTabChange }} />);

        fireEvent.click(component.container.querySelectorAll('.cr-tab')[0]);
        expect(onCurrentTabChange).toHaveBeenCalledTimes(1);
        fireEvent.click(component.container.querySelector('.cr-tab__disabled'));
        expect(onCurrentTabChange).toHaveBeenCalledTimes(1);
    });
});
