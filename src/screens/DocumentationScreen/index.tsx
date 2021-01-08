import * as React from 'react';
import { DocumentationHeader } from '../../components';
import { useDocumentationFetch } from '../../hooks';

export const DocumentationScreen: React.FC = () => {
    useDocumentationFetch();

    return (
        <div className="pg-documentation">
            <div className="pg-documentation__content">
                <DocumentationHeader />
            </div>
        </div>
    );
};
