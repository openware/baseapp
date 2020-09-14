import { shallow } from 'enzyme';
import * as React from 'react';
import { connect, Provider } from 'react-redux';
import { createStore } from 'redux';
import { IntlProps } from '../../index';
import { rootReducer } from '../../modules';
import { PluginsManager } from '../../plugins/PluginsManager';
import { ConfirmScreen } from '../ConfirmScreen';

const Plugins = new PluginsManager();

const store = createStore(rootReducer(Plugins.getReduxReducer()));
const ConfirmTab = connect()(ConfirmScreen);

const setup = (props: Partial<IntlProps> = {}) =>
    shallow(
        <Provider store={store}>
            <ConfirmTab/>
        </Provider>,
    );

describe('ConfirmScreen test', () => {
    it('should render', () => {
        const wrapper = setup();
        expect(wrapper).toMatchSnapshot();
        expect(wrapper).toBeDefined();
    });
});
