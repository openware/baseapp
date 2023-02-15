import * as React from 'react';
import { useIntl } from 'react-intl';
import { Link } from 'react-scroll';
import { Table } from '../../../../components';

interface ItemInterface {
    item: any;
    title: string;
}

export const DocumentationModelsItem: React.FC<ItemInterface> = (props: ItemInterface) => {
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
        return Object.keys(item.properties).map((key) => {
            const property = item.properties[key];
            const getFormattedType = () => {
                switch (property.type) {
                    case 'number':
                        return property.format;
                    case 'array':
                        if (property.items && property.items.$ref) {
                            const refElements = property.items.$ref.split('/');
                            const linkTitle = refElements[refElements.length - 1];

                            return (
                                <div>
                                    <span>[&nbsp;</span>
                                    <Link smooth to={`models/${linkTitle}`}>
                                        {linkTitle}
                                    </Link>
                                    <span>&nbsp;]</span>
                                </div>
                            );
                        } else {
                            return property.type;
                        }
                    case undefined:
                        if (property.$ref) {
                            const refElements = property.$ref.split('/');
                            const linkTitle = refElements[refElements.length - 1];

                            return (
                                <Link smooth to={`models/${linkTitle}`}>
                                    {linkTitle}
                                </Link>
                            );
                        } else {
                            return property.type;
                        }
                    default:
                        return property.type;
                }
            };

            return [
                key,
                getFormattedType(),
                property.description,
                !!property.required
                    ? intl.formatMessage({
                          id: 'page.documentation.models.item.table.data.required.true',
                      })
                    : intl.formatMessage({
                          id: 'page.documentation.models.item.table.data.required.false',
                      }),
            ];
        });
    }, [item.properties, intl]);

    return (
        <div className="pg-documentation-item pg-documentation-models-item" id={`models/${title}`}>
            <h5>{title}</h5>
            <span>{item.description}</span>
            {item.properties && Object.keys(item.properties).length ? (
                <Table header={getTableHeaders()} data={getTableData()} />
            ) : null}
        </div>
    );
};
