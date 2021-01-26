import { shallow } from 'enzyme';
import * as React from 'react';
import { connect, Provider } from 'react-redux';
import { createStore } from 'redux';
import { IntlProps } from '../../';
import { rootReducer } from '../../modules';
import { HistoryScreen } from '../History';

const store = createStore(rootReducer);
const History = connect()(HistoryScreen);

const setup = (props: Partial<IntlProps> = {}) =>
    shallow(
        <Provider store={store}>
            <History />
        </Provider>,
    );

describe('HistoryScreen', () => {
    const wrapper = setup();

    it('should render', () => {
        expect(wrapper).toMatchSnapshot();
    });
});
