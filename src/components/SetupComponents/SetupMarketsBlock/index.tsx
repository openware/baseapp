import * as React from 'react';
import { ArrowAllLeftIcon } from 'src/assets/images/setup/arrowAllLeftIcon';
import { ArrowAllRightIcon } from 'src/assets/images/setup/arrowAllRightIcon';
import { ArrowLeftIcon } from 'src/assets/images/setup/arrowLeftIcon';
import { ArrowRightIcon } from 'src/assets/images/setup/arrowRightIcon';

export interface SetupMarketBlockProps {
    availableMarkets: string[];
    addedMarkets: string[];
    selectedAvailableMarkets: string[];
    selectedAddedMarkets: string[];
    handleSelectAvailableMarket: (value: string[]) => void;
    handleSelectAddedMarket: (value: string[]) => void;
    handleAdd: () => void;
    handleAddAll: () => void;
    handleRemove: () => void;
    handleRemoveAll: () => void;
}

export class SetupMarketsBlock extends React.Component<SetupMarketBlockProps> {
    private renderMarketList = (items: string[]) => {
        return items && items.length ? 
                items.map(item => {return <option value={item}>{item}</option>})
            : null;
    };

    public render() {
        const {
            availableMarkets,
            addedMarkets,
            selectedAvailableMarkets,
            selectedAddedMarkets,
            handleSelectAvailableMarket,
            handleSelectAddedMarket,
            handleAdd,
            handleAddAll,
            handleRemove,
            handleRemoveAll,
        } = this.props;

        return (
            <div className="setup-markets-block">
                <div className="setup-markets-block__list">
                    <div className="setup-markets-block__list__title">Selected to your platform</div>
                    <select size={16} multiple={true} value={selectedAddedMarkets} onChange={(e) => handleSelectAddedMarket(Array.from(e.target.selectedOptions, option => option.value))}>
                        {this.renderMarketList(addedMarkets)}
                    </select>  
                </div>
                <div className="setup-markets-block__list">
                    <div className="setup-markets-block__list__command-add">
                        <div className="setup-markets-block__list__command" onClick={handleAdd}>
                            <ArrowLeftIcon /><span>Add</span>
                        </div>
                        <div  className="setup-markets-block__list__command"  onClick={handleAddAll}>
                            <ArrowAllLeftIcon /><span>Add All</span>
                        </div>
                    </div>
                    <div className="setup-markets-block__list__command-remove">
                        <div  className="setup-markets-block__list__command" onClick={handleRemove}>
                            <ArrowRightIcon /><span>Remove</span>
                        </div>
                        <div  className="setup-markets-block__list__command"  onClick={handleRemoveAll}>
                            <ArrowAllRightIcon /><span>Remove All</span>
                        </div>
                    </div>
                </div>
                <div className="setup-markets-block__list">
                    <div className="setup-markets-block__list__title">Library</div>
                    <select size={16} multiple={true} value={selectedAvailableMarkets}  onChange={(e) => handleSelectAvailableMarket(Array.from(e.target.selectedOptions, option => option.value))}>
                        {this.renderMarketList(availableMarkets)}
                    </select>  
                </div>
            </div>
        );
    }
}
