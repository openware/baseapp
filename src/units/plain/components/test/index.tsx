import React from 'react';

export interface JestTestComponentProps {
    title?: string;
    text: string;
}

export const JestTestComponent: React.FC<JestTestComponentProps> = ({ title, text }) => {
    return <div title={title}>{text}</div>;
};
