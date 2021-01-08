import * as React from 'react';
import { useIntl } from 'react-intl';
import { useSelector } from 'react-redux';
import { selectDocumentationData } from '../../../modules';
import { DocumentationModelsItem } from './Item';

export const DocumentationModels: React.FC = () => {
    const intl = useIntl();
    const documentation = useSelector(selectDocumentationData);

    if (documentation?.definitions && Object.keys(documentation?.definitions).length) {
        return (
            <div className="pg-documentation-item pg-documentation-models" id="models">
                <h4>{intl.formatMessage({ id: 'page.documentation.models.title' })}</h4>
                {Object.keys(documentation?.definitions).map(key => (
                    <DocumentationModelsItem
                        key={key}
                        title={key}
                        item={documentation?.definitions[key]}
                    />
                ))}
            </div>
        );
    }

    return null;
};
