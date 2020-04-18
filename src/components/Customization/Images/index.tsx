import * as React from 'react';

interface OwnProps {
    translate: (key: string) => string;
}

type Props = OwnProps;

export class CustomizationImages extends React.PureComponent<Props> {
    public render() {
        const { translate } = this.props;

        return (
            <div className="pg-customization-images">
                <span className="pg-customization-images__coming-soon">
                    {translate('page.body.customization.comingSoon')}
                </span>
            </div>
        );
    }
}
