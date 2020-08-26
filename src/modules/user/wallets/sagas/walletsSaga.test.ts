it('deprecated: saga, reducer, components with redux are tested separatelly', () => {
    expect(true).toBeTruthy();
});

// import MockAdapter from 'axios-mock-adapter';
// import { MockStoreEnhanced } from 'redux-mock-store';
// import createSagaMiddleware, { SagaMiddleware } from 'redux-saga';
// import { AccountInterface, rootSaga, Wallet } from '../../..';
// import { mockNetworkError, setupMockAxios, setupMockStore } from '../../../../helpers/jest';
// import {
//     walletsData,
//     walletsError,
//     walletsFetch,
// } from '../actions';

// describe('Module: Wallets', () => {
//     let store: MockStoreEnhanced;
//     let sagaMiddleware: SagaMiddleware<{}>;
//     let mockAxios: MockAdapter;

//     beforeEach(() => {
//         mockAxios = setupMockAxios();
//         sagaMiddleware = createSagaMiddleware();
//         store = setupMockStore(sagaMiddleware, false)();
//         sagaMiddleware.run(rootSaga);
//     });

//     afterEach(() => {
//         mockAxios.reset();
//     });

//     const fakeError = {
//         code: 500,
//         message: ['Server error'],
//     };

//     const fakeAccounts: AccountInterface[] = [
//         {
//             currency: 'eth',
//             balance: '0',
//             locked: '0',
//         },
//         {
//             currency: 'fth',
//             balance:'0',
//             locked:'0',
//         },
//         {
//             currency: 'gmt',
//             balance:'0',
//             locked:'0',
//         },
//         {
//             currency: 'ksys',
//             balance:'0',
//             locked:'0',
//         },
//         {
//             currency: 'kyn',
//             balance:'0',
//             locked:'0',
//         },
//         {
//             currency: 'usd',
//             balance:'0',
//             locked:'0',
//         },
//     ];

//     const fakeCurrencies = [
//         {
//             id:'gmt',
//             name:'Good Mood',
//             symbol:')',
//             explorer_transaction:'https://rinkeby.etherscan.io/tx/#{txid}',
//             explorer_address:'https://rinkeby.etherscan.io/address/#{address}',
//             type:'coin' as 'fiat' | 'coin',
//             deposit_fee:0,
//             min_deposit_amount:'1.0',
//             withdraw_fee:0.1,
//             min_withdraw_amount:'1.0',
//             withdraw_limit_24h:'100.0',
//             withdraw_limit_72h:'200.0',
//             deposit_enabled: true,
//             withdrawal_enabled: true,
//             base_factor:1000000000000000000,
//             precision:3,
//         },
//         {
//             id:'ksys',
//             name:' K Systems LTD Token',
//             symbol:'K',
//             explorer_transaction:'https://etherscan.io/tx/#{txid}',
//             explorer_address:'https://etherscan.io/address/#{address}',
//             type:'coin' as 'fiat' | 'coin',
//             deposit_fee:0,
//             min_deposit_amount:'200.0',
//             withdraw_fee:0.1,
//             min_withdraw_amount:'200.0',
//             withdraw_limit_24h:'400.0',
//             withdraw_limit_72h:'600.0',
//             deposit_enabled: true,
//             withdrawal_enabled: true,
//             base_factor:100000000000000000,
//             precision:8,
//         },
//         {
//             id:'usd',
//             name:'US Dollar',
//             symbol:'$',
//             explorer_transaction:'https://etherscan.io/tx/#{txid}',
//             explorer_address:'https://rinkeby.etherscan.io/address/#{address}',
//             type:'fiat' as 'fiat' | 'coin',
//             deposit_fee:0,
//             min_deposit_amount:'0.0',
//             withdraw_fee:0,
//             min_withdraw_amount:'0.0',
//             withdraw_limit_24h:'100.0',
//             withdraw_limit_72h:'200.0',
//             deposit_enabled: true,
//             withdrawal_enabled: true,
//             base_factor:1,
//             precision:2,
//         },
//         {
//             id:'eth',
//             name:'Ethereum',
//             symbol:'Ξ',
//             explorer_transaction:'https://rinkeby.etherscan.io/tx/#{txid}',
//             explorer_address:'https://rinkeby.etherscan.io/address/#{address}',
//             type:'coin' as 'fiat' | 'coin',
//             deposit_fee:0,
//             min_deposit_amount:'0.00021',
//             withdraw_fee:0.005,
//             min_withdraw_amount:'0.0',
//             withdraw_limit_24h:'300.0',
//             withdraw_limit_72h:'400.0',
//             deposit_enabled: true,
//             withdrawal_enabled: true,
//             base_factor:1000000000000000000,
//             precision:8,
//         },
//         {
//             id:'fth',
//             name:'Fiat Ethereum',
//             symbol:'F',
//             explorer_transaction:'https://etherscan.io/tx/#{txid}',
//             explorer_address:'https://rinkeby.etherscan.io/address/#{address}',
//             type:'fiat' as 'fiat' | 'coin',
//             deposit_fee:0,
//             min_deposit_amount:'0.0',
//             withdraw_fee:0,
//             min_withdraw_amount:'0.0',
//             withdraw_limit_24h:'100.0',
//             withdraw_limit_72h:'200.0',
//             deposit_enabled: true,
//             withdrawal_enabled: true,
//             base_factor:1,
//             precision:2,
//         },
//         {
//             id:'trst',
//             name:'WeTrust',
//             symbol:'Ξ',
//             explorer_transaction:'https://rinkeby.etherscan.io/tx/#{txid}',
//             explorer_address:'https://rinkeby.etherscan.io/address/#{address}',
//             type:'coin' as 'fiat' | 'coin',
//             deposit_fee:0,
//             min_deposit_amount:'0.00021',
//             withdraw_fee:0,
//             min_withdraw_amount:'0.0',
//             withdraw_limit_24h:'300.0',
//             withdraw_limit_72h:'600.0',
//             deposit_enabled: false,
//             withdrawal_enabled: false,
//             base_factor:1000000,
//             precision:8,
//             icon_url:'https://i0.wp.com/www.coinstaker.com/wp-content/uploads/2017/04/WETRUST.png?zoom=2.625\u0026w=1080\u0026ssl=1',
//         },
//         {
//             id:'kyn',
//             name:'Kayen',
//             symbol:'K',
//             explorer_transaction:'https://rinkeby.etherscan.io/tx/#{txid}',
//             explorer_address:'https://rinkeby.etherscan.io/address/#{address}',
//             type:'coin' as 'fiat' | 'coin',
//             deposit_fee:0,
//             min_deposit_amount:'0.00021',
//             withdraw_fee:0,
//             min_withdraw_amount:'0.0',
//             withdraw_limit_24h:'300.0',
//             withdraw_limit_72h:'600.0',
//             deposit_enabled: true,
//             withdrawal_enabled: true,
//             base_factor:1000000,
//             precision:8,
//         },
//     ];

//     const fakeWallets: Wallet[] = fakeCurrencies.map(currencyInfo => {
//         let walletInfo = fakeAccounts.find(wallet => wallet.currency === currencyInfo.id);

//         if (!walletInfo) {
//             walletInfo = {
//                 currency: currencyInfo.id,
//             };
//         }

//         return ({
//             ...walletInfo,
//             name: currencyInfo ? currencyInfo.name : '',
//             explorerTransaction: currencyInfo!.explorer_transaction,
//             explorerAddress: currencyInfo!.explorer_address,
//             fee: currencyInfo!.withdraw_fee,
//             type: currencyInfo!.type,
//             fixed: currencyInfo!.precision,
//             iconUrl: currencyInfo ? currencyInfo.icon_url : '',
//         });
//     });

//     const mockWallets = () => {
//         mockAxios.onGet('/account/balances').reply(200, fakeAccounts);
//         mockAxios.onGet('/public/currencies').reply(200, fakeCurrencies);
//     };

//     const expectedActionsFetch = [walletsFetch(), walletsData(fakeWallets)];
//     const expectedActionsError = [walletsFetch(), walletsError(fakeError)];

//     it('should fetch wallets in success flow', async () => {
//         mockWallets();
//         const promise = new Promise(resolve => {
//             store.subscribe(() => {
//                 const actions = store.getActions();
//                 if (actions.length === expectedActionsFetch.length) {
//                     expect(actions).toEqual(expectedActionsFetch);
//                     resolve();
//                 }
//             });
//         });

//         store.dispatch(walletsFetch());

//         return promise;
//     });

//     it('should trigger an error', async () => {
//         mockNetworkError(mockAxios);
//         const promise = new Promise(resolve => {
//             store.subscribe(() => {
//                 const actions = store.getActions();
//                 if (actions.length === expectedActionsError.length) {
//                     expect(actions).toEqual(expectedActionsError);
//                     resolve();
//                 }
//             });
//         });
//         store.dispatch(walletsFetch());

//         return promise;
//     });
// });
