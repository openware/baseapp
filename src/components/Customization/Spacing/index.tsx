import * as React from 'react';

interface OwnProps {
    translate: (key: string) => string;
}

type Props = OwnProps;

export class CustomizationSpacing extends React.PureComponent<Props> {
    public render() {
        const { translate } = this.props;

        return (
            <div className="pg-customization-spacing">
                <span className="pg-customization-spacing__coming-soon">
                    {translate('page.body.customization.comingSoon')}
                </span>
            </div>
        );
    }
}
