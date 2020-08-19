it('deprecated: saga, reducer, components with redux are tested separatelly', () => {
    expect(true).toBeTruthy();
});

// import { shallow } from 'enzyme';
// import * as React from 'react';
// import { InjectedIntlProps } from 'react-intl';
// import { connect, Provider } from 'react-redux';
// import { createStore } from 'redux';
// import { rootReducer } from '../../modules';
// import { HistoryScreen } from '../History';

// const store = createStore(rootReducer);
// const History = connect()(HistoryScreen);

// const setup = (props: Partial<InjectedIntlProps> = {}) =>
//     shallow(
//         <Provider store={store}>
//             <History />
//         </Provider>,
//     );

// describe('HistoryScreen', () => {
//     const wrapper = setup();

//     it('should render', () => {
//         expect(wrapper).toMatchSnapshot();
//     });
// });
