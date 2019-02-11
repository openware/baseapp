import { shallow } from 'enzyme';
import * as React from 'react';
import { createStore } from 'redux';
import { rootReducer } from '../../modules';
import { mapDispatchToProps, mapStateToProps, WalletTable } from './History';


describe('WalletHistory', () => {
    let wrapper;
    const [spyReset, spyFetch] = [jest.fn(), jest.fn()];
    const reduxState = createStore(rootReducer).getState();

    const fakeHistory = [
        {
            id:566,
            currency:'btc',
            amount:'0.99',
            fee:'0.0',
            txid:'4516e174e7f04fafd14026c22d2bc288695aaa96f4b44518aa86ac7e27fc2458',
            created_at:'2018-12-03T17:13:58+01:00',
            confirmations:1,
            completed_at:'2018-12-03T17:14:56+01:00',
            state:'accepted',
        },
        {
            id:393,
            currency:'btc',
            amount:'0.001',
            fee:'0.0',
            txid:'dd5024e99c92aaa8787ed8273c8a6b635388eb4624d9cc1f8e04313dce843180',
            created_at:'2018-11-16T09:56:38+01:00',
            confirmations:0,
            completed_at:'2018-11-16T09:56:56+01:00',
            state:'canceled',
        },
    ];

    const props = {
        label: 'Deposits history',
        type: 'deposits',
        currency: 'btc',
        list: fakeHistory,
        fetching: false,
        fullHistory: 10,
        page: 0,
        pageCount: 2,
        firstElemIndex: 1,
        lastElemIndex: 6,
        nextPageExists: true,
        fetchHistory: spyFetch,
        resetHistory: spyReset,
    };

    beforeEach(() => {
        wrapper = shallow(<WalletTable {...props}/>);
    });

    it.skip('fetchCurrencyHistory called', () => {
        expect(spyFetch).toHaveBeenCalled();
        //each test increases call +1, so it should be first (test componentDidMount call)
        expect(spyFetch).toHaveBeenCalledTimes(1);
        const args = { page: 0, currency: 'btc', type: 'deposits', limit: 6 };
        expect(spyFetch).toHaveBeenCalledWith(args);
    });

    it.skip('fetchCurrencyHistory called when tab changed', () => {
        wrapper.setProps({ currency: 'eth' });
        expect(spyFetch).toHaveBeenCalled();
        // each test increases call +1, so it should be first (test componentDidMount call)
        // 1 - prev test
        // 2 - componentDidMount
        // 3 - componentWillReceiveProps
        expect(spyFetch).toHaveBeenCalledTimes(3);
        const args = { page: 0, currency: 'eth', type: 'deposits', limit: 6 };
        expect(spyFetch).toHaveBeenCalledWith(args);
        expect(spyReset).toHaveBeenCalledTimes(1);
    });

    it.skip('should call resetCurrencyHistory during component unmount', () => {
        wrapper.unmount();
        expect(spyReset).toHaveBeenCalledTimes(2);
    });


    it.skip('renders without crashing', () => {
        expect(wrapper).toBeDefined();
    });

    it.skip('should have correct className', () => {
        expect(wrapper.hasClass('pg-history-elem'));
    });

    it.skip('has label with right text', () => {
        expect(wrapper.find('.pg-history-elem__label').text()).toEqual('Deposits history');
    });

    it.skip('should matches snapshot', () => {
        expect(wrapper).toMatchSnapshot();
    });

    it.skip('has redux context', () => {
        const dispatch = jest.fn();

        expect(mapStateToProps(reduxState).list).toEqual([]);
        expect(mapStateToProps(reduxState).fetching).toEqual(false);
        expect(mapStateToProps(reduxState).fullHistory).toEqual(0);
        expect(mapStateToProps(reduxState).page).toEqual(0);
        expect(mapStateToProps(reduxState).pageCount).toEqual(0);
        expect(mapStateToProps(reduxState).firstElemIndex).toEqual(1);
        expect(mapStateToProps(reduxState).lastElemIndex).toEqual(0);
        expect(mapStateToProps(reduxState).nextPageExists).toEqual(false);
        expect(mapDispatchToProps(dispatch, {}).fetchHistory).toBeDefined();
        expect(mapDispatchToProps(dispatch, {}).resetHistory).toBeDefined();
    });
});
