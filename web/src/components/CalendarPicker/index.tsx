import * as React from 'react';
import { forwardRef, useState } from 'react';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { ChevronDownIcon } from 'src/assets/images/ChevronDownIcon';

export interface CalendarPickerProps {
    selectedDate: Date,
    placeholder?: string;
    label?: string;
    handleChangeDate: (date: Date) => void;
}

const CalendarPickerComponent: React.FC<CalendarPickerProps> = ({
    selectedDate,
    placeholder,
    label,
    handleChangeDate,
}) => {
    const CustomPickerInput = forwardRef<any, any>(({ value, onClick }, ref) => (
            <React.Fragment>
                <label>{label}</label>
                <button className="custom-picker-input" onClick={onClick} ref={ref}>
                    {value || placeholder}
                    <ChevronDownIcon />
                </button>
            </React.Fragment>
            
        ),
    );

    return (
        <div className="cr-calendar-picker">
            <DatePicker
                selected={selectedDate}
                placeholderText={placeholder}
                onChange={handleChangeDate}
                customInput={<CustomPickerInput />}
            />
        </div>
    );
};

export const CalendarPicker = React.memo(CalendarPickerComponent);
