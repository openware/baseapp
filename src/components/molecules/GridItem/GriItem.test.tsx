import { shallow } from 'enzyme';
import * as React from 'react';
import { GridItem, GridItemProps } from './GridItem';

const defaultProps: GridItemProps = {
  children: 'Children',
};

const setup = (props: Partial<GridItemProps> = {}) =>
  shallow(<GridItem {...{ ...defaultProps, ...props }} />);

describe('GridItem', () => {
  it('should render', () => {
    const wrapper = setup();
    expect(wrapper).toMatchSnapshot();
  });

  it('should have correct className', () => {
    const wrapper = setup();
    expect(wrapper.hasClass('cr-grid-item')).toBeTruthy();
  });

  it('should pass along supplied className', () => {
    const className = 'some-class';
    const wrapper = setup({ className });
    expect(wrapper.hasClass(className)).toBeTruthy();
  });
});
