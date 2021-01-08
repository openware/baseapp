import * as React from 'react';
import { useIntl } from 'react-intl';
import { Table } from '../../../../components';

interface DocumentationModelsItemInterface {
    item: any;
    title: string;
}

export const DocumentationModelsItem: React.FC<DocumentationModelsItemInterface> = (props: DocumentationModelsItemInterface) => {
    const { title, item } = props;
    const intl = useIntl();

    const getTableHeaders = React.useCallback(() => {
        return [
            intl.formatMessage({ id: 'page.documentation.models.item.table.header.name' }),
            intl.formatMessage({ id: 'page.documentation.models.item.table.header.type' }),
            intl.formatMessage({ id: 'page.documentation.models.item.table.header.description' }),
            intl.formatMessage({ id: 'page.documentation.models.item.table.header.required' }),
        ];
    }, [intl]);

    const getTableData = React.useCallback(() => {
        return Object.keys(item.properties).map(key => {
            const property = item.properties[key];
            const getFormattedType = () => {
                switch (property.type) {
                    case 'number':
                        return property.format;
                    default:
                        return property.type;
                }
            };

            return [
                key,
                getFormattedType(),
                property.description,
                !!property.required || intl.formatMessage({ id: 'page.documentation.models.item.table.data.required.default' }),
            ];
        });
    }, [item.properties]);

    return (
        <div className="pg-documentation-models-item">
            <h5>{title}</h5>
            <span>{item.description}</span>
            {item.properties && Object.keys(item.properties).length ? (
                <Table
                    header={getTableHeaders()}
                    data={getTableData()}
                />
            ) : null}
        </div>
    );
};
