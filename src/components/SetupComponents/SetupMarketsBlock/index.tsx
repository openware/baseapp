import * as React from 'react';
import { Button } from 'react-bootstrap';
import { MarketItem, MarketUpdateItem } from 'src/modules';
import { ArrowAllLeftIcon } from 'src/assets/images/setup/arrowAllLeftIcon';
import { ArrowAllRightIcon } from 'src/assets/images/setup/arrowAllRightIcon';
import { ArrowLeftIcon } from 'src/assets/images/setup/arrowLeftIcon';
import { ArrowRightIcon } from 'src/assets/images/setup/arrowRightIcon';

export interface SetupMarketBlockState {
    availableMarkets: string[];
    addedMarkets: string[];
    selectedAvailableMarkets: string[];
    selectedAddedMarkets: string[];
}

interface SetupMarketBlockProps {
    marketsList: MarketItem[];
    handleClickSave: (list: MarketUpdateItem[]) => void;
    fetchMarkets: () => void;
}

export class SetupMarketsBlock extends React.Component<SetupMarketBlockProps, SetupMarketBlockState> {
    constructor(props: SetupMarketBlockProps) {
        super(props);

        this.state = {
            availableMarkets: [],
            addedMarkets: [],
            selectedAvailableMarkets: [],
            selectedAddedMarkets: [],
        };
    }

    public componentDidMount() {
        this.props.fetchMarkets();
    }

    public componentWillReceiveProps(nextProps: SetupMarketBlockProps) {
        if (!this.state.availableMarkets.length && !this.props.marketsList.length && nextProps.marketsList.length) {
            this.setState({
                availableMarkets: this.getAllMarketsNames(nextProps.marketsList),
            });
        }
    }

    public render() {
        const { availableMarkets, addedMarkets, selectedAvailableMarkets, selectedAddedMarkets } = this.state;
        const { marketsList } = this.props;

        return (
            <React.Fragment>
                <div className="setup-markets-block">
                    <div className="setup-markets-block__list">
                        <div className="setup-markets-block__list__title">Selected to your platform</div>
                        <select size={marketsList.length} multiple={true} value={selectedAddedMarkets} onChange={(e) => this.handleSelectAddedMarket(Array.from(e.target.selectedOptions, option => option.value))}>
                            {this.renderMarketList(addedMarkets)}
                        </select>
                    </div>
                    <div className="setup-markets-block__list">
                        <div className="setup-markets-block__list__command-add">
                            <div className="setup-markets-block__list__command" onClick={this.handleAddMarket}>
                                <ArrowLeftIcon /><span>Add</span>
                            </div>
                            <div  className="setup-markets-block__list__command"  onClick={this.handleAddAllMarkets}>
                                <ArrowAllLeftIcon /><span>Add All</span>
                            </div>
                        </div>
                        <div className="setup-markets-block__list__command-remove">
                            <div  className="setup-markets-block__list__command" onClick={this.handleRemoveMarket}>
                                <ArrowRightIcon /><span>Remove</span>
                            </div>
                            <div  className="setup-markets-block__list__command" onClick={this.handleRemoveAllMarkets}>
                                <ArrowAllRightIcon /><span>Remove All</span>
                            </div>
                        </div>
                    </div>
                    <div className="setup-markets-block__list">
                        <div className="setup-markets-block__list__title">Library</div>
                        <select size={marketsList.length} multiple={true} value={selectedAvailableMarkets} onChange={e => this.handleSelectAvailableMarket(Array.from(e.target.selectedOptions, option => option.value))}>
                            {this.renderMarketList(availableMarkets)}
                        </select>
                    </div>
                </div>
                <div className="setup-screen__step-footer">
                    <Button
                        block={true}
                        type="button"
                        size="lg"
                        variant="primary"
                        onClick={this.handleSave}
                    >
                        Next
                    </Button>
                </div>
            </React.Fragment>
        );
    }

    private handleSelectAvailableMarket = (value: string[]) => {
        this.setState({
            selectedAvailableMarkets: value,
        });
    };

    private handleSelectAddedMarket = (value: string[]) => {
        this.setState({
            selectedAddedMarkets: value,
        });
    };

    private renderMarketList = (items: string[]) => {
        return items && items.length
            ? items.map(item => <option key={item} value={item}>{item}</option>)
            : null;
    };

    private handleAddMarket = () => {
        const addedMarkets = [...this.state.addedMarkets, ...this.state.selectedAvailableMarkets];
        const availableMarkets = this.props.marketsList.filter(item => {
             if (addedMarkets.indexOf(item.name) === -1) {
                return item.name;
             }

             return undefined;
        }).filter(item => item !== undefined);

        this.setState({
            addedMarkets,
            selectedAvailableMarkets: [],
            availableMarkets: this.getAllMarketsNames(availableMarkets),
        });
    };

    private handleAddAllMarkets = () => {
        this.setState({
            addedMarkets: this.getAllMarketsNames(this.props.marketsList),
            availableMarkets: [],
            selectedAvailableMarkets: [],
        });
    };

    private handleRemoveMarket = () => {
        const addedMarkets = this.state.addedMarkets.filter(item => {
            if (this.state.selectedAddedMarkets.indexOf(item) === -1) {
                return item;
            }

            return undefined;
        }).filter(item => item !== undefined);
        const availableMarkets = this.props.marketsList.filter(item => {
             if (addedMarkets.indexOf(item.name) === -1) {
                return item.name;
             }

             return undefined;
        }).filter(item => item !== undefined);

        this.setState({
            addedMarkets: addedMarkets,
            availableMarkets: this.getAllMarketsNames(availableMarkets),
            selectedAvailableMarkets: [],
            selectedAddedMarkets: [],
        });
    };

    private handleRemoveAllMarkets = () => {
        this.setState({
            addedMarkets: [],
            availableMarkets: this.getAllMarketsNames(this.props.marketsList),
            selectedAvailableMarkets: [],
            selectedAddedMarkets: [],
        });
    };

    private handleSave = () => {
        const { marketsList } = this.props;
        const { addedMarkets } = this.state;

        const payloadMarkets = marketsList.map(item => {
            if (addedMarkets.indexOf(item.name) !== -1) {
                return {
                    id: item.id,
                    state: 'enabled',
                };
            }

            return undefined;
        }).filter(item => item !== undefined);

        this.props.handleClickSave(payloadMarkets);
    };

    private getAllMarketsNames = marketsList => marketsList.map(market => market.name);
}
