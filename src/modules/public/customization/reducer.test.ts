import { CommonError } from '../../types';
import * as actions from './actions';
import { customizationReducer, initialCustomizationState } from './reducer';
import { CustomizationDataInterface } from './types';

describe('customizationReducer', () => {
    const fakeCustomization: CustomizationDataInterface = {
        settings: '{\"theme_id\":\"1\",\"theme_colors\":{\"light\":[],\"dark\":[]}}',
    };

    const error: CommonError = {
        code: 500,
        message: ['Server error'],
    };

    it('should handle CUSTOMIZATION_FETCH', () => {
        const expectedState = {
            ...initialCustomizationState,
            loading: true,
         };
        expect(customizationReducer(initialCustomizationState, actions.customizationFetch())).toEqual(expectedState);
    });

    it('should handle CUSTOMIZATION_DATA', () => {
        const expectedState = {
            ...initialCustomizationState,
            loading: false,
            success: true,
            data: fakeCustomization,
        };

        const payload = fakeCustomization;
        expect(customizationReducer(initialCustomizationState, actions.customizationData(payload))).toEqual(expectedState);
    });

    it('should handle CUSTOMIZATION_ERROR', () => {
        const expectedState = {
            ...initialCustomizationState,
            loading: false,
            success: false,
            error: error,
         };
        expect(customizationReducer(initialCustomizationState, actions.customizationError(error))).toEqual(expectedState);
    });
});
