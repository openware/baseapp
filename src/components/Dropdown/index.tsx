import classnames from 'classnames';
import * as React from 'react';
import { Dropdown } from 'react-bootstrap';

type DropdownElem = number | string | React.ReactNode;

export interface DropdownComponentProps {
    /**
     * List of options
     */
    list: DropdownElem[];
    /**
     * Selection callback function
     * @default empty
     */
    onSelect?: (index: number) => void;
    /**
     *  By default class name 'cr-dropwdown'
     *  This property gives an additional class name
     *  @default empty
     */
    className?: string;
    /**
     * Value for placeholder of Dropdown components
     * @default empty
     */
    placeholder?: string;
    /**
     * Value for disabling contentEditable property
     * @default false
     */
    disableContentEditable?: boolean;
}

interface DropdownComponentState {
    selected: string;
    selectedIndex: string;
}

/**
 *  Cryptobase Dropdown that overrides default dropdown with list of options.
 */
class DropdownComponent extends React.Component<DropdownComponentProps & {}, DropdownComponentState> {

    constructor(props: DropdownComponentProps) {
        super(props);
        const selectedValue = this.props.placeholder || this.convertToString(this.props.list[0]);
        this.state = {
            selected: selectedValue,
            selectedIndex: '0',
        };
    }

    public render() {
        const { selected } = this.state;
        const { list } = this.props;
        const cx = classnames('cr-dropdown', this.props.className);

        return (
            <div className={cx}>
                <Dropdown>
                    <Dropdown.Toggle variant="primary" id="dropdown-basic">
                        {selected}
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                        {list.map((elem, index) => this.renderElem(elem, index))}
                    </Dropdown.Menu>
                </Dropdown>
            </div>
        );
    }

    private renderElem = (elem: DropdownElem, index: number) => {
        return  (<Dropdown.Item
                    onSelect={ (eventKey: any, e?: React.SyntheticEvent<unknown>) => this.handleSelect(elem, index)}
                >
                    {elem}
                </Dropdown.Item>);
    }

    private handleSelect = (elem: DropdownElem, index: number) => {
        this.props.onSelect && this.props.onSelect(index);
        this.setState({
            selected: this.convertToString(elem),
            selectedIndex: index.toString(),
        });
        window.console.log(this.state.selectedIndex);
    };

    private convertToString = (elem: DropdownElem) => {
        if (elem !== undefined && elem !== null) {
            return elem.toString();
        }
        return '';
    };
}

export {
    DropdownComponent,
};
