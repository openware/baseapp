import * as React from 'react';
import { JsxElement } from 'typescript';

export interface SetupFormBlockProps {
    title: string;
    subtitle: string;
    children: React.ReactElement;
}

export class SetupFormBlock extends React.Component<SetupFormBlockProps> {
    public render() {
        const { title, subtitle, children } = this.props;

        return (
            <div className="setup-form-block">
                <div className="setup-form-block__title">
                    {title}
                </div>
                <div className="setup-form-block__subtitle">
                    {subtitle}
                </div>
                <div className="setup-form-block__children">
                    {children}
                </div>
            </div>
        );
    }
}