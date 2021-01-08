import * as React from 'react';
import { useIntl } from 'react-intl';
import { ParametersItem } from './ParametersItem';
import { ResponsesItem } from './ResponsesItem';

interface ItemInterface {
    item: any;
    title: string;
}

export const RequestTypeItem: React.FC<ItemInterface> = (props: ItemInterface) => {
    const { title, item } = props;
    const intl = useIntl();

    return (
        <div className="pg-documentation-item">
            <h4 className="text-transform--uppercase">{title}</h4>
            <h5>{intl.formatMessage({ id: 'page.documentation.endpoints.requestTypeItem.description.title' })}</h5>
            <span>{item.description}</span>
            <ParametersItem item={item} />
            <ResponsesItem item={item} />
        </div>
    );
};
