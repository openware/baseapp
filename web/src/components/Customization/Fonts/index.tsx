import * as React from 'react';

interface OwnProps {
    translate: (key: string) => string;
}

type Props = OwnProps;

export class CustomizationFonts extends React.PureComponent<Props> {
    public render() {
        const { translate } = this.props;

        return (
            <div className="pg-customization-fonts">
                <span className="pg-customization-themes__coming-soon">
                    {translate('page.body.customization.comingSoon')}
                </span>
            </div>
        );
    }
}
