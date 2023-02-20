import { render } from '@testing-library/react';
import React from 'react';
import { Button } from 'react-bootstrap';
import { Modal, ModalProps } from './';

const defaults: ModalProps = {
    show: true,
    header: <div>Title</div>,
    content: <div>Some content</div>,
    footer: <Button onClick={jest.fn()} />,
};

const renderComponent = (props: Partial<ModalProps> = {}) => render(<Modal {...{ ...defaults, ...props }} />);

describe('Basic Modal', () => {
    it('should render', () => {
        expect(renderComponent().container).toMatchSnapshot();
    });

    it('should have correct className', () => {
        expect(renderComponent().container.querySelector('.cr-modal')).toBeInTheDocument();
    });

    it('should pass along supplied className', () => {
        expect(renderComponent({ className: 'new-class' }).container.querySelector('.new-class')).toBeInTheDocument();
    });
});
