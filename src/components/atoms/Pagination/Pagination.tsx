import * as React from 'react';

interface PaginationProps {
    /**
     * Number shows first element index in pagination
     */
    firstElemIndex: number;
    /**
     * Number shows last element index in pagination
     */
    lastElemIndex: number;
    /**
     * Number shows total amount of elements
     */
    total: number;
    /**
     * Previous page click handler
     */
    onClickPrevPage: () => void;
    /**
     * Next page click handler
     */
    onClickNextPage: () => void;
    /**
     * Number shows current page index
     */
    page: number;
    /**
     * Value for defining if next page exist or not
     */
    nextPageExists: boolean;
}


interface PreviousIconProps {
    /**
     * Value for defining if previous page disabled
     */
    disabled: boolean;
}
/**
 * PreviousIcon functional component
 */
const PreviousIcon: React.FunctionComponent<PreviousIconProps> = ({ disabled }) => {
    return (
        <svg width="22" height="24" viewBox="0 0 22 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M14.0545 7.4L12.7782 6L7.30853 12L12.7782 18L14.0545 16.6L9.86105 12L14.0545 7.4Z"
                fill={`${disabled ? 'var(--pagination-disabled)' : 'var(--pagination-active)'}`}
                fillOpacity={`${disabled ? '0.5' : ''}`}
            />
        </svg>
    );
};

interface NextPageIconProps {
    /**
     * Value for defining if previous page disabled
     */
    disabled: boolean;
}
/**
 * NextPageIcon functional component
 */
const NextPageIcon: React.FunctionComponent<NextPageIconProps> = ({ disabled }) => {
    return (
        <svg width="23" height="24" viewBox="0 0 23 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M8.61279 7.4L9.88905 6L15.3587 12L9.88905 18L8.61279 16.6L12.8062 12L8.61279 7.4Z"
                fill={`${disabled ? 'var(--pagination-disabled)' : 'var(--pagination-active)'}`}
                fillOpacity={`${disabled ? '0.5' : ''}`}
            />
        </svg>
    );
};

/**
 * Pagination component helper for tables
 */
class Pagination extends React.Component<PaginationProps> {
    public render() {
        const { firstElemIndex, lastElemIndex, total, page, nextPageExists } = this.props;
        const prevDisabled = page === 0;
        const nextDisabled = !nextPageExists;
        return (
            <div className="pg-history-elem__pagination">
                <p>{firstElemIndex} - {lastElemIndex} of {total}</p>
                <button
                    className="pg-history__pagination-prev"
                    onClick={this.onClickPrevPage}
                    disabled={prevDisabled}
                >
                    <PreviousIcon disabled={prevDisabled}/>
                </button>
                <button
                    className="pg-history__pagination-next"
                    onClick={this.onClickNextPage}
                    disabled={nextDisabled}
                >
                    <NextPageIcon disabled={nextDisabled}/>
                </button>
            </div>
        );
    }

    private onClickPrevPage = () => {
        if (this.props.page === 0) {
            return;
        }
        this.props.onClickPrevPage();
    };

    private onClickNextPage = () => {
        if (!this.props.nextPageExists) {
            return;
        }
        this.props.onClickNextPage();
    };
}

export {
    Pagination,
    PaginationProps,
};
