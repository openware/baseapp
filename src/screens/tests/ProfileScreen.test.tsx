it('deprecated: saga, reducer, components with redux are tested separatelly', () => {
    expect(true).toBeTruthy();
});

// import { shallow } from 'enzyme';
// import * as React from 'react';
// import { InjectedIntlProps } from 'react-intl';
// import { connect, Provider } from 'react-redux';
// import { createStore } from 'redux';
// import { ProfileScreen } from '../';
// import { rootReducer } from '../../modules';

// const store = createStore(rootReducer);
// const ProfileTab = connect()(ProfileScreen);

// const setup = (props: Partial<InjectedIntlProps> = {}) =>
//     shallow(
//         <Provider store={store}>
//             <ProfileTab/>
//         </Provider>,
//     );

// describe('ProfileScreen test', () => {
//     it('should render', () => {
//         const wrapper = setup();
//         expect(wrapper).toMatchSnapshot();
//         expect(wrapper).toBeDefined();
//     });
// });
