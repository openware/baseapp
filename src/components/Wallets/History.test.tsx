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
        fetchCurrencyHistory: spyFetch,
        resetCurrencyHistory: spyReset,
    };

    beforeEach(() => {
        wrapper = shallow(<WalletTable {...props}/>);
    });

    it('fetchCurrencyHistory called', () => {
        expect(spyFetch).toHaveBeenCalled();
        //each test increases call +1, so it should be first (test componentDidMount call)
        expect(spyFetch).toHaveBeenCalledTimes(1);
        const args = { page: 0, currency: 'btc', type: 'deposits', fullHistory: 0 };
        expect(spyFetch).toHaveBeenCalledWith(args);
    });

    it('fetchCurrencyHistory called when tab changed', () => {
        wrapper.setProps({ currency: 'eth' });
        expect(spyFetch).toHaveBeenCalled();
        // each test increases call +1, so it should be first (test componentDidMount call)
        // 1 - prev test
        // 2 - componentDidMount
        // 3 - componentWillReceiveProps
        expect(spyFetch).toHaveBeenCalledTimes(3);
        const args = { page: 0, currency: 'eth', type: 'deposits', fullHistory: 0 };
        expect(spyFetch).toHaveBeenCalledWith(args);
        expect(spyReset).toHaveBeenCalledTimes(1);
    });

    it('should call resetCurrencyHistory during component unmount', () => {
        wrapper.unmount();
        expect(spyReset).toHaveBeenCalledTimes(2);
    });


    it('renders without crashing', () => {
        expect(wrapper).toBeDefined();
    });

    it('should have correct className', () => {
        expect(wrapper.hasClass('pg-history-elem'));
    });

    it('has label with right text', () => {
        expect(wrapper.find('.pg-history-elem__label').text()).toEqual('Deposits history');
    });

    it('has pagination info with right text', () => {
        expect(wrapper.find('p').text()).toEqual('1 - 6 of 10');
    });

    it('should test click on prev page', () => {
        const spyFetchPrevPage = jest.fn();
        const wrap = shallow(<WalletTable {...{...props, ...{ fetchCurrencyHistory: spyFetchPrevPage }}}/>);
        const prevButton = wrap.find('.pg-history__pagination-prev');
        // click when page equals 1
        prevButton.simulate('click');
        expect(spyFetchPrevPage).toHaveBeenCalledTimes(1);

        wrap.setProps({ page: 1 });
        // click when page equals 2
        prevButton.simulate('click');
        expect(spyFetchPrevPage).toHaveBeenCalledTimes(2);
    });

    it('should test click on next page', () => {
        const spyFetchNextPage = jest.fn();
        const wrap = shallow(<WalletTable {...{...props, ...{ fetchCurrencyHistory: spyFetchNextPage }}}/>);
        const prevButton = wrap.find('.pg-history__pagination-next');
        wrap.setProps({ nextPageExists: false });
        // click when page equals 1
        prevButton.simulate('click');
        expect(spyFetchNextPage).toHaveBeenCalledTimes(1);

        wrap.setProps({ nextPageExists: true });
        // click when page equals 2
        prevButton.simulate('click');
        expect(spyFetchNextPage).toHaveBeenCalledTimes(2);
        const args = { page: 0, currency: 'btc', type: 'deposits', fullHistory: 0 };
        expect(spyFetchNextPage).toHaveBeenCalledWith(args);
    });

    it('should matches snapshot', () => {
        expect(wrapper).toMatchSnapshot();
    });

    it('has redux context', () => {
        const dispatch = jest.fn();

        expect(mapStateToProps(reduxState).list).toEqual([]);
        expect(mapStateToProps(reduxState).fetching).toEqual(false);
        expect(mapStateToProps(reduxState).fullHistory).toEqual(0);
        expect(mapStateToProps(reduxState).page).toEqual(0);
        expect(mapStateToProps(reduxState).pageCount).toEqual(0);
        expect(mapStateToProps(reduxState).firstElemIndex).toEqual(1);
        expect(mapStateToProps(reduxState).lastElemIndex).toEqual(0);
        expect(mapStateToProps(reduxState).nextPageExists).toEqual(false);
        expect(mapDispatchToProps(dispatch, {}).fetchCurrencyHistory).toBeDefined();
        expect(mapDispatchToProps(dispatch, {}).resetCurrencyHistory).toBeDefined();
    });
});
