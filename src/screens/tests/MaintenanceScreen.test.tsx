import { shallow } from 'enzyme';
import * as React from 'react';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import { IntlProps } from '../../index';
import { rootReducer } from '../../modules';
import { PluginsManager } from '../../plugins/PluginsManager';
import { MaintenanceScreen } from '../MaintenanceScreen';

const Plugins = new PluginsManager();

const store = createStore(rootReducer(Plugins.getReduxReducer()));

const setup = (props: Partial<IntlProps> = {}) =>
    shallow(
        <Provider store={store}>
            <MaintenanceScreen />
        </Provider>,
    );

describe('MaintenanceScreen', () => {
    const wrapper = setup();

    it('should render', () => {
        expect(wrapper).toMatchSnapshot();
    });
});
