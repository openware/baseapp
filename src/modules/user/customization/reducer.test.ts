import { CustomizationDataInterface } from '../../public/customization';
import { CommonError } from '../../types';
import * as actions from './actions';
import { customizationUpdateReducer, initialCustomizationUpdateState } from './reducer';

describe('customizationReducer', () => {
    const fakeCustomization: CustomizationDataInterface = {
        settings: '{"theme_id": "1","theme_colors":[]}',
    };

    const error: CommonError = {
        code: 500,
        message: ['Server error'],
    };

    it('should handle CUSTOMIZATION_UPDATE', () => {
        const expectedState = {
            ...initialCustomizationUpdateState,
            loading: true,
        };

        const payload = fakeCustomization;
        expect(
            customizationUpdateReducer(initialCustomizationUpdateState, actions.customizationUpdate(payload))
        ).toEqual(expectedState);
    });

    it('should handle CUSTOMIZATION_UPDATE_DATA', () => {
        const expectedState = {
            ...initialCustomizationUpdateState,
            loading: false,
            success: true,
            data: fakeCustomization,
        };

        const payload = fakeCustomization;
        expect(
            customizationUpdateReducer(initialCustomizationUpdateState, actions.customizationUpdateData(payload))
        ).toEqual(expectedState);
    });

    it('should handle CUSTOMIZATION_UPDATE_ERROR', () => {
        const expectedState = {
            ...initialCustomizationUpdateState,
            loading: false,
            success: false,
            error: error,
        };
        expect(
            customizationUpdateReducer(initialCustomizationUpdateState, actions.customizationUpdateError(error))
        ).toEqual(expectedState);
    });
});
