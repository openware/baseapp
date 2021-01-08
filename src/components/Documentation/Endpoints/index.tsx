import * as React from 'react';
import { useSelector } from 'react-redux';
import { selectDocumentationData } from '../../../modules';

export const DocumentationEndpoints: React.FC = () => {
    const documentation = useSelector(selectDocumentationData);

    if (!(documentation?.definitions && Object.keys(documentation?.definitions).length)) {
        return null;
    }

    return (
        <div className="pg-documentation-endpoints">
            Endpoints
        </div>
    );
};
