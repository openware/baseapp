import cr from 'classnames';
import * as React from 'react';

interface LoaderProps {
    /**
     * Additional classname
     */
    className?: string;
}

// tslint:disable-next-line
const Loader: React.SFC<LoaderProps> = ({className}) => {
    const classNames = cr('cr-loader', className);
    return (
        <div className={classNames}>
            <span className="loader-block"/>
            <span className="loader-block"/>
            <span className="loader-block"/>
            <span className="loader-block"/>
            <span className="loader-block"/>
            <span className="loader-block"/>
            <span className="loader-block"/>
            <span className="loader-block"/>
            <span className="loader-block"/>
        </div>
    );
};

export {
    Loader,
    LoaderProps,
};
