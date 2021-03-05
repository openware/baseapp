import React, { FC, ReactElement } from 'react';

interface OwnProps {
    translate: (key: string) => string;
}

type Props = OwnProps;

export const ThemesSpacing: FC<Props> = ({
    translate,
}): ReactElement => (
    <div className="pg-themes-spacing">
        <span className="pg-themes-spacing__coming-soon">
            {translate('page.body.customization.comingSoon')}
        </span>
    </div>
);
