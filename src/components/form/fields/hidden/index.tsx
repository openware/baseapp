import React from 'react';
import { WrappedFieldProps } from 'redux-form';

export const FormHidden: React.FC<WrappedFieldProps> = ({ input }) => {
    return <input type="hidden" {...input} />;
};
