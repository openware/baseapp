import { CommonError } from '../../types';
import * as actions from './actions';
import { CUSTOMIZATION_DATA, CUSTOMIZATION_ERROR, CUSTOMIZATION_FETCH } from './constants';
import { CustomizationDataInterface } from './types';

describe('Customization actions', () => {
    const fakeCustomization: CustomizationDataInterface = {
        settings: '{\"theme_id\": \"1\",\"theme_colors\":[]}',
    };

    const error: CommonError = {
        code: 500,
        message: ['Server error'],
    };

    it('should check CustomizationFetch action creator', () => {
        const expectedAction = { type: CUSTOMIZATION_FETCH };
        expect(actions.customizationFetch()).toEqual(expectedAction);
    });

    it('should check CustomizationData action creator', () => {
        const payload = fakeCustomization;
        const expectedAction = { type: CUSTOMIZATION_DATA, payload };
        expect(actions.customizationData(payload)).toEqual(expectedAction);
    });

    it('should check CustomizationError action creator', () => {
        const expectedAction = { type: CUSTOMIZATION_ERROR, error: error };
        expect(actions.customizationError(error)).toEqual(expectedAction);
    });
});
