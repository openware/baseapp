it('deprecated: saga, reducer, components with redux are tested separatelly', () => {
    expect(true).toBeTruthy();
});

// import { shallow } from 'enzyme';
// import * as React from 'react';
// import { InjectedIntlProps } from 'react-intl';
// import { Provider } from 'react-redux';
// import { createStore } from 'redux';
// import { rootReducer } from '../../modules';
// import { RestrictedScreen } from '../RestrictedScreen';

// const store = createStore(rootReducer);

// const setup = (props: Partial<InjectedIntlProps> = {}) =>
//     shallow(
//         <Provider store={store}>
//             <RestrictedScreen />
//         </Provider>,
//     );

// describe('RestrictedScreen', () => {
//     const wrapper = setup();

//     it('should render', () => {
//         expect(wrapper).toMatchSnapshot();
//     });
// });
