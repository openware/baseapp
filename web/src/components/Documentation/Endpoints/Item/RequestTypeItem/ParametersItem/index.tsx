import * as React from 'react';
import { useIntl } from 'react-intl';
import { Table } from '../../../../../../components';

interface ItemInterface {
    item: any;
}

export const ParametersItem: React.FC<ItemInterface> = (props: ItemInterface) => {
    const { item } = props;
    const intl = useIntl();

    const getTableHeaders = React.useCallback(() => {
        return [
            intl.formatMessage({ id: 'page.documentation.endpoints.requestTypeItem.parameters.table.header.name' }),
            intl.formatMessage({ id: 'page.documentation.endpoints.requestTypeItem.parameters.table.header.location' }),
            intl.formatMessage({ id: 'page.documentation.endpoints.requestTypeItem.parameters.table.header.description' }),
            intl.formatMessage({ id: 'page.documentation.endpoints.requestTypeItem.parameters.table.header.required' }),
            intl.formatMessage({ id: 'page.documentation.endpoints.requestTypeItem.parameters.table.header.schema' }),
        ];
    }, [intl]);

    const getTableData = React.useCallback(() => {
        return item.parameters.map(parameter => {
            const getFormattedSchema = () => {
                switch (parameter.type) {
                    case 'number':
                        return parameter.format;
                    default:
                        return parameter.type;
                }
            };

            return [
                parameter.name,
                parameter.in,
                parameter.description,
                !!parameter.required ? (
                    intl.formatMessage({ id: 'page.documentation.endpoints.requestTypeItem.parameters.table.data.required.true' })
                ) : (
                    intl.formatMessage({ id: 'page.documentation.endpoints.requestTypeItem.parameters.table.data.required.false' })
                ),
                getFormattedSchema(),
            ];
        });
    }, [item.parameters, intl]);

    if (item.parameters && Object.keys(item.parameters).length) {
        return (
            <React.Fragment>
                <h5>{intl.formatMessage({ id: 'page.documentation.endpoints.requestTypeItem.parameters.title' })}</h5>
                <Table
                    header={getTableHeaders()}
                    data={getTableData()}
                />
            </React.Fragment>
        );
    }

    return null;
};
