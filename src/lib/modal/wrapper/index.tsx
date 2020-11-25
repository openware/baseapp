import React from 'react';

import { useReduxSelector } from 'src/hooks';

interface Props {
    name: string;
    children: (options: any) => React.ReactElement;
}

export const ModalWrapper: React.FC<Props> = ({ name, children }) => {
    const options = useReduxSelector((x) => x.general.dialog[name]);
    return options ? children(options) : null;
};
