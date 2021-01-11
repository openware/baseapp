import * as React from 'react';
import {
    DocumentationEndpoints,
    DocumentationHeader,
    DocumentationModels,
} from '../../components';
import { useDocumentationFetch } from '../../hooks';

export const DocumentationScreen: React.FC = () => {
    useDocumentationFetch();

    return (
        <div className="pg-documentation">
            <div className="pg-documentation__content">
                <DocumentationHeader />
                <DocumentationEndpoints />
                <DocumentationModels />
            </div>
        </div>
    );
};
