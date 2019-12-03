import classnames from 'classnames';
import * as React from 'react';
import iconDown = require('./chevron-down.svg');
import iconUp = require('./chevron-up.svg');

type DropdownElem = number | string | React.ReactNode;

interface DropdownProps {
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
     * Value for height of Dropdown list elements
     * @default 30px
     */
    elemHeight?: number;
    /**
     * Value for height of Dropdown list
     * @default 90px
     */
    listHeight?: number;
    /**
     * Value for disabling contentEditable property
     * @default false
     */
    disableContentEditable?: boolean;
}

const defaultElemHeight = 30;
const defaultListHeight = 90;

interface DropdownState {
    isOpen: boolean;
    selected: string;
    searchValue: string;
    isTimerRunning: boolean;
    topElem: number;
    isFocused: boolean;
}

/**
 *  Cryptobase Dropdown that overrides default dropdown with list of options.
 */
class Dropdown extends React.Component<DropdownProps & {}, DropdownState> {

    constructor(props: DropdownProps) {
        super(props);
        const selectedValue = this.props.placeholder || this.convertToString(this.props.list[0]);
        this.state = {
            isOpen: false,
            selected: selectedValue,
            searchValue:  '',
            isTimerRunning: false,
            topElem: 0,
            isFocused: false,
        };
    }

    private myRef = React.createRef<HTMLInputElement>();
    private scrollAnchorRef = React.createRef<HTMLLIElement>();

    public render() {
        const { isOpen, isFocused } = this.state;
        const { disableContentEditable } = this.props;
        const cx = classnames('cr-dropdown', this.props.className);

        return (
            <div className={cx}>
                <div
                    className={`cr-dropdown__input${isFocused ? '--open' : ''}`}
                    onClick={this.handleClick}
                    onFocus={this.handleFocus}
                    onBlur={this.handleBlur}
                >
                    <span
                        ref={this.myRef}
                        className="cr-dropdown__input-label"
                        onKeyDown={this.handleKeyPress}
                        contentEditable={disableContentEditable ? false : true}
                        suppressContentEditableWarning={true}
                    >
                        {this.state.selected}
                    </span>
                    <span className="cr-dropdown__input-icon">
                        <img src={isOpen ? iconUp : iconDown} />
                    </span>
                </div>
                {this.renderList(isOpen, this.props.list)}
            </div>
        );
    }

    /**
     * function that handles input value
     * @param e - KeyDown event
     */
    //tslint:disable-next-line
    private handleKeyPress = (e: any) => {
        if (e.type === 'keydown') {
            e.persist();
        }
        const selectedElementIndex = this.props.list.indexOf(this.state.selected);
        const time = 2000;
        const arrowUpButton = 38;
        const arrowDownButton = 40;
        const enterButton = 13;
        const newValue = `${this.state.searchValue}${e.key}`;

        switch (e.keyCode) {
            case arrowDownButton:
                if (selectedElementIndex < this.props.list.length - 1) {
                    this.setState({
                        selected: this.convertToString(this.props.list[selectedElementIndex + 1]),
                    }, () => this.calculateListShift('down'));
                }
                break;
            case arrowUpButton:
                if (selectedElementIndex > 0) {
                    this.setState({
                        selected: this.convertToString(this.props.list[selectedElementIndex - 1]),
                    }, () => this.calculateListShift('up'));
                }
                break;
            case enterButton:
                if (this.state.isOpen) {
                    this.handleSelect(selectedElementIndex);
                    document.removeEventListener('click', this.handleOutsideClick, false);
                    const element = this.myRef.current;
                    element && element.blur();
                    this.setState({
                        isOpen: false,
                        isFocused: false,
                    });
                } else {
                    document.addEventListener('click', this.handleOutsideClick, false);
                    this.setState({
                        isOpen: true,
                    });
                }
                break;
            default:
                const selectedElem = this.convertToString(this.props.list[this.findOption(newValue, this.props.list)]);
                this.setState({
                    searchValue: newValue,
                    selected: selectedElem,
                }, () => this.calculateListShift());
        }
        this.startTimer(time);
        if (e.type === 'keydown') {
            e.preventDefault();
        }
    };

    /**
     * function that handles the selection
     * @param index - number of selected element
     */
    private handleSelect = (index: number) => {
        if (this.props.onSelect) {
            this.props.onSelect(index);
        }
        this.setState({
            selected: this.convertToString(this.props.list[index]),
        });
    };

    private handleFocus = () => {
        this.setState(prevState => ({
            isFocused: true,
        }));
    }

    private handleBlur = () => {
      this.setState(prevState => ({
          isFocused: false,
      }));
    }

    /**
     * function that toggles dropdown list
     */
    private handleClick = () => {
        if (!this.state.isOpen) {
            document.addEventListener('click', this.handleOutsideClick, false);
            this.setState(prevState => ({
                isFocused: true,
            }));
        } else {
            document.removeEventListener('click', this.handleOutsideClick, false);
            const element = this.myRef.current;
            element && element.blur();
            this.setState(prevState => ({
                isFocused: false,
            }));
        }
        this.setState(prevState => ({
            isOpen: !prevState.isOpen,
        }));
    };

    private handleOutsideClick = () => {
        this.handleClick();
    };

    /**
     * function that render one element of dropdown list
     * @param option - element
     * @param index - number of element
     */
    private renderOptions = (option: DropdownElem, index: number) => {
        const minOptions = 2;
        const elemHeight = this.props.elemHeight || defaultElemHeight;
        const fullListHeight = elemHeight * this.props.list.length;
        const displayedListHeight = this.props.listHeight || (fullListHeight < defaultListHeight ? fullListHeight : defaultListHeight);
        const shift = this.state.topElem === 0 ? 0 : displayedListHeight % elemHeight - this.state.topElem * elemHeight;
        const style = { top: shift, height: elemHeight };
        const cx = classnames('cr-dropdown__list-item', {
            'cr-dropdown__list-item-selected': this.convertToString(option) === this.state.selected && this.props.list.length > minOptions,
        });

        return (
            <li
                ref={cx.includes('selected') ? this.scrollAnchorRef : null}
                className={cx}
                key={index}
                onClick={this.handleSelect.bind(this, index)}
                style={style}
            >
                <span className="cr-dropdown__list-item-label">
                    {option}
                </span>
            </li>
        );
    };

    /**
     * function that render all dropdown list
     * @param listIsOpen - true, if dropdown list is open
     * @param list - list of elements
     */
    private renderList = (listIsOpen: boolean, list: DropdownElem[]) => {
        const elemHeight = this.props.elemHeight || defaultElemHeight;
        const fullListHeight = elemHeight * this.props.list.length;
        const height = { height: this.props.listHeight || (fullListHeight < defaultListHeight ? fullListHeight : defaultListHeight) };

        return listIsOpen ? (
            <ul
                className="cr-dropdown__list"
                style={height}
            >
                {list.map(this.renderOptions)}
            </ul>
        ) : '';
    };

    /**
     * function that find option in dropdown list
     * @param value - value for search in list
     * @param list - list of elements
     */
    private findOption = (value: string, list: DropdownElem[]) => {
        for (let i = 0; i < list.length; i++) {
            if (this.convertToString(list[i]).toLowerCase().indexOf(value.toLowerCase()) === 0) {
                return i;
            }
        }
        this.setState({
            searchValue: '',
            isTimerRunning: false,
        });
        return 0;
    };

    /**
     * function that convert element of dropdown list to string
     * @param elem - element
     */
    private convertToString = (elem: DropdownElem) => {
        if (elem !== undefined && elem !== null) {
            return elem.toString();
        }
        return '';
    };

    /**
     * function that start the timer for search value
     */
    private startTimer = (time: number) => {
        if (!this.state.isTimerRunning) {
            this.setState({ isTimerRunning: true });
            setTimeout(() => {
                this.setState({
                    searchValue: '',
                    isTimerRunning: false,
                });
            }, time);
        }
    };

    /**
     * function that calculate shift for dropdown list
     * @param action - arrowUp or arrowDown keypress
     */
    private calculateListShift = (action?: string) => {
        const elemHeight = this.props.elemHeight || defaultElemHeight;
        const fullListHeight = elemHeight * this.props.list.length;
        const displayedListHeight = this.props.listHeight || (fullListHeight < defaultListHeight ? fullListHeight : defaultListHeight);
        const elementsInDisplayedList = Math.floor(displayedListHeight / elemHeight);
        const selectedElem = this.props.list.indexOf(this.state.selected);
        const topElem = this.state.topElem;

        switch (action) {
            case 'down':
                if (selectedElem - topElem >= elementsInDisplayedList && topElem < this.props.list.length - elementsInDisplayedList) {
                    this.setState({
                        topElem: selectedElem - (elementsInDisplayedList - 1),
                    });
                }
                break;
            case 'up':
                if (selectedElem < topElem && selectedElem >= 0) {
                    this.setState({
                        topElem: selectedElem,
                    });
                }
                break;
            default:
                if (this.scrollAnchorRef.current) {
                    this.scrollAnchorRef.current.scrollIntoView({ block: 'center', behavior: 'auto' });
                }
        }
    }
}

export {
    Dropdown,
    DropdownProps,
};
