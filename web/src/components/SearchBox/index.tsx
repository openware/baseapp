import cr from 'classnames';
import * as React from 'react';
import { useCallback, useMemo, useState } from 'react';
import { SearchIcon } from 'src/assets/images/SearchIcon';

export interface SearchBoxProps {
    className?: string;
    placeholder?: string;
    searchDelay?: number;
    searchMethod: (baseString: string) => void;
}

export const SearchBoxComponent: React.FC<SearchBoxProps> = ({
    className,
    placeholder,
    searchDelay,
    searchMethod,
}) => {
    const [value, setValue] = useState<string>('');
    const [timeoutID, setTimeoutID] = useState<number>(0);

    const cx = cr('cr-searchbox', {
        className: className,
    });

    const handeSearchBoxInput = useCallback( event => {
        if (timeoutID) {
            clearTimeout(timeoutID);
        }
        const currentTimeoutID = window.setTimeout(searchMethod, searchDelay ? searchDelay : 500, event.target.value);

        setValue(event.target.value);
        setTimeoutID(currentTimeoutID);
    }, [searchMethod, searchDelay, timeoutID, value]);

    return (
        <div className={cx}>
            <SearchIcon />
            <input
                className="cr-searchbox__input"
                onChange={handeSearchBoxInput}
                value={value}
                type="text"
                placeholder={placeholder || 'Search'}
            />
        </div>
    );
};

export const SearchBox = React.memo(SearchBoxComponent);
