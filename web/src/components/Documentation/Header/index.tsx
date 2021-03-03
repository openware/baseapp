import * as React from 'react';
import { useIntl } from 'react-intl';
import { useSelector } from 'react-redux';
import { selectDocumentationData } from '../../../modules';

export const DocumentationHeader: React.FC = () => {
    const intl = useIntl();
    const documentation = useSelector(selectDocumentationData);

    return (
        <div className="pg-documentation-item pg-documentation-header">
            <h3>{documentation?.info?.title}</h3>
            <div className="pg-documentation-header__description">
                <span>{documentation?.info?.description}</span>
            </div>
            <div className="pg-documentation-header__version">
                <h4>{intl.formatMessage({ id: 'page.documentation.header.version.title' })}&nbsp;{documentation?.info?.version}</h4>
            </div>
            <div className="pg-documentation-header__contact-info">
                <span>{intl.formatMessage({ id: 'page.documentation.header.contactInfo.title' })}</span>
                <a
                    href={documentation?.info?.contact?.url}
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    {documentation?.info?.contact?.name}
                </a>
                <a href={`mailto: ${documentation?.info?.contact?.email}`}>
                    {documentation?.info?.contact?.email}
                </a>
            </div>
            <div className="pg-documentation-header__license">
                <span>{intl.formatMessage({ id: 'page.documentation.header.license.title' })}</span>
                <a
                    href={documentation?.info?.license?.url}
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    {documentation?.info?.license?.url}
                </a>
            </div>
        </div>
    );
};
