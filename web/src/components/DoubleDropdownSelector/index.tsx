import * as React from 'react';
import { useIntl } from 'react-intl';
import { ChangeIcon } from 'src/assets/images/ChangeIcon';
import { DropdownComponent } from '..';

interface ParentProps {
    from: string;
    to: string;
    typesArray: string[];
    labelFrom?: string;
    labelTo?: string;
    handleSelectFrom: (value: string) => void;
    handleSelectTo: (value: string) => void;
}

type Props = ParentProps;

/**
 * Component for displaying two dropdowns with ability to swap value. Value of dp #1 and dp #2 are disjoint sets.
 */
export const DoubleDropdownSelector: React.FunctionComponent<Props> = (props: Props) => {
    const [arrayFrom, setArrayFrom] = React.useState<string[]>([]);
    const [arrayTo, setArrayTo] = React.useState<string[]>([]);

    const { typesArray, from, to, labelFrom, labelTo } = props;
    const intl = useIntl();

    React.useEffect(() => {
        setArrayTo(typesArray.filter(i => i !== to));
    }, [to, typesArray]);

    React.useEffect(() => {
        setArrayFrom(typesArray.filter(i => i !== from));
    }, [from, typesArray]);

    const handleClickSwap = React.useCallback(() => {
        props.handleSelectFrom(to);
        props.handleSelectTo(from);
    }, [from, to, props.handleSelectFrom, props.handleSelectTo]);

    const handleSelectFrom = React.useCallback((index: number) => {
        props.handleSelectFrom(arrayFrom[index]);

        if (arrayFrom[index] === to) {
            props.handleSelectTo(arrayTo[0]);
        }
    }, [arrayFrom, arrayTo, to, props.handleSelectFrom, props.handleSelectTo]);

    const handleSelectTo = React.useCallback((index: number) => {
        props.handleSelectTo(arrayTo[index]);

        if (arrayTo[index] === from) {
            props.handleSelectFrom(arrayFrom[0]);
        }
    }, [arrayFrom, arrayTo, to, props.handleSelectFrom, props.handleSelectTo]);

    return (
        <div className="cr-double-dp-selector">
            <div className="cr-double-dp-selector__group">
                <div className="cr-double-dp-selector__group-label">{labelFrom || intl.formatMessage({ id: 'page.body.wallets.transfers.from' })}</div>
                <DropdownComponent
                    className="cr-double-dp-selector__group-dropdown"
                    list={arrayFrom}
                    onSelect={handleSelectFrom}
                    placeholder={from}
                />
            </div>
            <div className="cr-double-dp-selector__swap" onClick={handleClickSwap}>
                <ChangeIcon className="icon"/>
            </div>
            <div className="cr-double-dp-selector__group">
                <div className="cr-double-dp-selector__group-label">{labelTo || intl.formatMessage({ id: 'page.body.wallets.transfers.to' })}</div>
                <DropdownComponent
                    className="cr-double-dp-selector__group-dropdown"
                    list={arrayTo}
                    onSelect={handleSelectTo}
                    placeholder={to}
                />
            </div>
        </div>
    );
};
