import React from 'react';
import { reduxForm, Form, InjectedFormProps, Field } from 'redux-form';
import classNames from 'classnames';
import { Button } from 'react-bootstrap';

import './index.scss';

import { FormNames } from '../../constants/form';
import { FormText, FieldFormTextProps, FormError, requiredValidator } from '../form';

export interface SignInParams {
    email: string;
    password: string;
}

export interface Props extends InjectedFormProps<SignInParams> {}

const FormComponent: React.FC<Props> = ({ handleSubmit, error, submitting }) => {
    // const { formatMessage } = useIntl();
    return (
        <Form onSubmit={handleSubmit} className={classNames('sign-in-form')}>
            <Field<FieldFormTextProps>
                name="amount"
                placeholder="Email"
                component={FormText}
                validate={requiredValidator('Required')}
            />
            <Field<FieldFormTextProps>
                name="price"
                placeholder="Password"
                component={FormText}
                validate={requiredValidator('Required')}
            />
            <FormError errorText={error} />
            <Button type="submit" disabled={submitting}>
                Sign In
            </Button>
        </Form>
    );
};

export const NewSignIn = reduxForm<SignInParams>({
    form: FormNames.SING_IN,
})(FormComponent);
