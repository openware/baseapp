import { CustomizationDataInterface } from '../../public/customization';
import { CommonError } from '../../types';
import * as actions from './actions';
import { CUSTOMIZATION_UPDATE, CUSTOMIZATION_UPDATE_DATA, CUSTOMIZATION_UPDATE_ERROR } from './constants';

describe('CustomizationUpdate actions', () => {
    const fakeCustomizationUpdate: CustomizationDataInterface = {
        settings: '{\"theme_id\": \"1\",\"theme_colors\":[]}',
    };

    const error: CommonError = {
        code: 500,
        message: ['Server error'],
    };

    it('should check CustomizationUpdate action creator', () => {
        const payload = fakeCustomizationUpdate;
        const expectedAction = { type: CUSTOMIZATION_UPDATE, payload };
        expect(actions.customizationUpdate(payload)).toEqual(expectedAction);
    });

    it('should check CustomizationUpdateData action creator', () => {
        const payload = fakeCustomizationUpdate;
        const expectedAction = { type: CUSTOMIZATION_UPDATE_DATA, payload };
        expect(actions.customizationUpdateData(payload)).toEqual(expectedAction);
    });

    it('should check CustomizationUpdateError action creator', () => {
        const expectedAction = { type: CUSTOMIZATION_UPDATE_ERROR, error: error };
        expect(actions.customizationUpdateError(error)).toEqual(expectedAction);
    });
});
