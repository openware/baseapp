import * as React from 'react';
import { injectIntl } from 'react-intl';
import { IntlProps } from '../../../../index';

interface OwnProps {
    introduction: string;
}

type Props = OwnProps & IntlProps;

class IEOProjectIntroductionComponent extends React.Component<Props> {
    public translate = (e: string) => {
        return this.props.intl.formatMessage({ id: e });
    };

    public render() {
        const { introduction } = this.props;

        return (
            <div className="ieo-profile-project-introduction">
                <div className="ieo-profile-project-introduction__header">
                    {this.translate('page.body.ieo.profile.introduction.header')}
                </div>
                <div className="ieo-profile-project-introduction__body">
                    <p>{introduction}</p>
                </div>
            </div>
        );
    }
}

export const IEOProjectIntroduction = injectIntl(IEOProjectIntroductionComponent);
