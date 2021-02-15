import * as React from 'react';

interface SetupInfoBlockProps {
    // path to platform logo
    // @default OpenDAX logo
    logo: string;
    // path to background
    backgroundImage: string;
    title: string;
    description?: string;
}

export class SetupInfoBlock extends React.Component<SetupInfoBlockProps> {
    public render() {
        const { backgroundImage, title, logo } = this.props;

        return (
            <div className="setup-info-block" style={{ background: backgroundImage }}>
                <div className="setup-info-block__logo">
                    <img src={logo} alt="platform-logo" />
                </div>
                <div className="setup-info-block__title">
                    {title}
                </div>
                {this.renderDescription()}
            </div>
        );
    }

    public renderDescription = () => {
        const { description } = this.props;

        if (description) {
            return (
                <div className="setup-info-block__description">
                    Description
                </div>
            );
        }

        return null;
    };
}
