import { shallow } from 'enzyme';
import * as React from 'react';
import { Grid, GridProps } from './index';

const defaultProps: GridProps = {
  breakpoints: {
    lg: 1200,
    md: 996,
    sm: 768,
    xs: 480,
    xxs: 0,
  },
  children: [
    {
      i: 0,
      render: () => 'Child Body 0',
    },
    {
      i: 1,
      render: () => 'Child Body 1',
    },
    {
      i: 2,
      render: () => 'Child Body 2',
    },
    {
      i: 3,
      render: () => 'Child Body 3',
    },
  ],
  cols: {
    lg: 12,
    md: 10,
    sm: 768,
    xs: 480,
    xxs: 0,
  },
  layouts: {
    lg: [
      { x: 0, y: 0, w: 3, h: 9, i: '0' },
      { x: 3, y: 0, w: 3, h: 5, i: '1' },
      { x: 7, y: 0, w: 3, h: 5, i: '2' },
      { x: 0, y: 7, w: 3, h: 4, i: '3' },
    ],
    md: [
      { x: 0, y: 0, w: 3, h: 9, i: '0' },
      { x: 3, y: 0, w: 3, h: 5, i: '1' },
      { x: 7, y: 0, w: 3, h: 5, i: '2' },
      { x: 0, y: 7, w: 3, h: 4, i: '3' },
    ],
    sm: [
      { x: 0, y: 0, w: 3, h: 9, i: '0' },
      { x: 3, y: 0, w: 3, h: 5, i: '1' },
      { x: 7, y: 0, w: 3, h: 5, i: '2' },
      { x: 0, y: 7, w: 3, h: 4, i: '3' },
    ],
  },
  onLayoutChange: () => { return; },
  rowHeight: 30,
};

const setup = (props: Partial<GridProps> = {}) =>
  shallow(<Grid {...{ ...defaultProps, ...props }} />);

describe('Grid', () => {
  it('should render', () => {
    const wrapper = setup();
    expect(wrapper).toMatchSnapshot();
  });

  it('should have correct className', () => {
    const wrapper = setup();
    expect(wrapper.hasClass('cr-grid')).toBeTruthy();
  });

  it('should pass along supplied className', () => {
    const className = 'some-class';
    const wrapper = setup({ className });
    expect(wrapper.hasClass(className)).toBeTruthy();
  });
});
