import * as React from 'react';
import { Form } from 'react-bootstrap';
import { useIntl } from 'react-intl';
import { FilterInput } from '..';
import { Wallet } from '../../modules';

interface ParentProps {
    wallets: Wallet[];
    nonZeroSelected: boolean;
    setFilteredWallets: (value: Wallet[]) => void;
    handleClickCheckBox: (value: boolean) => void;
}

/**
 * Component for displaying search field and checkbox for Overview, Spot, P2P, Transfers Wallets tabs
 */
export const WalletsHeader: React.FunctionComponent<ParentProps> = (props: ParentProps) => {
    const { wallets, nonZeroSelected } = props;
    const intl = useIntl();

    const searchFilter = (row: Wallet, searchKey: string) => {
        return row ? row.name?.toLowerCase().includes(searchKey.toLowerCase()) || row.currency?.toLowerCase().includes(searchKey.toLowerCase()) : false;
    };

    const handleFilter = (result: object[]) => {
        props.setFilteredWallets(result as Wallet[]);
    };

    const handleToggleCheckbox = React.useCallback(event => {
        event.preventDefault();
        props.handleClickCheckBox(!nonZeroSelected);
    }, [nonZeroSelected, props.handleClickCheckBox]);

    return (
        <div className="cr-wallets-header">
            <div className="cr-wallets-header__search">
                <FilterInput
                    data={wallets}
                    onFilter={handleFilter}
                    filter={searchFilter}
                    placeholder={intl.formatMessage({id: 'page.body.wallets.overview.seach'})}
                />
            </div>
            <Form className="cr-wallets-header__checkbox" onClick={handleToggleCheckbox}>
                <Form.Check
                    type="checkbox"
                    custom
                    id="nonZeroSelected"
                    checked={nonZeroSelected}
                    readOnly={true}
                    label={intl.formatMessage({id: 'page.body.wallets.overview.nonZero'})}
                />
            </Form>
        </div>
    );
};
