import * as React from 'react';

import classnames from 'classnames';

interface CheckboxProps {
  /**
   * Property for setting or getting status of Checkbox component
   */
  checked?: boolean;
  /**
   * Additional class name. By default element receives `cr-checkbox` class
   * @default empty
   */
  className?: string;
  /**
   * Property for disabling Checkbox component
   */
  disabled?: boolean;
  /**
   * Property for label of Checkbox component
   */
  label: string;
  /**
   * Function for getting event of changing status of checkbox
   */
  onChange?: () => void;
  /**
   * Function for getting event of changing status of checkbox
   */
  slider?: boolean;
}

const Checkbox: React.FunctionComponent<CheckboxProps> = props => {
  const {
    checked,
    className,
    disabled,
    label,
    onChange,
    slider,
  } = props;
  const cx = classnames('cr-checkbox', {
    'cr-checkbox__disabled': disabled,
  }, className);
  return (
    <label className={cx}>
      <input
        checked={checked}
        className="cr-checkbox__input"
        onChange={onChange}
        type="checkbox"
      />
      <span className={slider ? 'slider' : 'cr-checkbox__checkitem'} />
      <span className="cr-checkbox__label">{label}</span>
    </label>
  );
};

export {
  Checkbox,
  CheckboxProps,
};
