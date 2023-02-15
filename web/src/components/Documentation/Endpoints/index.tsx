import * as React from 'react';
import { useSelector } from 'react-redux';
import { selectDocumentationData } from '../../../modules';
import { DocumentationEndpointsItem } from './Item';

export const DocumentationEndpoints: React.FC = () => {
    const documentation = useSelector(selectDocumentationData);

    if (documentation?.paths && Object.keys(documentation?.paths).length) {
        return (
            <div className="pg-documentation-item pg-documentation-endpoints" id="endpoints">
                {Object.keys(documentation?.paths).map((key, index) => (
                    <DocumentationEndpointsItem key={key} title={key} item={documentation?.paths[key]} />
                ))}
            </div>
        );
    }

    return null;
};
