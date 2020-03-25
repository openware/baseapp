import * as React from 'react';

interface Props {
    color?: string;
}

export class ArrowIcon extends React.Component<Props> {
    public render() {
        const {
            color = '#737F92',
        } = this.props;

        return (
            <svg width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1.41 0.590027L6 5.17003L10.59 0.590027L12 2.00003L6 8.00003L0 2.00003L1.41 0.590027Z" fill={color}/>
            </svg>
        );
    }
}
