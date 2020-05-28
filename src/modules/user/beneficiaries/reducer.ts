import { CommonError } from '../../../modules/types';
import { BeneficiariesActions } from './actions';
import {
    BENEFICIARIES_ACTIVATE,
    BENEFICIARIES_ACTIVATE_DATA,
    BENEFICIARIES_ACTIVATE_ERROR,
    BENEFICIARIES_CREATE,
    BENEFICIARIES_CREATE_DATA,
    BENEFICIARIES_CREATE_ERROR,
    BENEFICIARIES_DATA,
    BENEFICIARIES_DATA_UPDATE,
    BENEFICIARIES_DELETE,
    BENEFICIARIES_DELETE_DATA,
    BENEFICIARIES_DELETE_ERROR,
    BENEFICIARIES_ERROR,
    BENEFICIARIES_FETCH,
} from './constants';
import { Beneficiary } from './types';

const defaultBeneficiary: Beneficiary = {
    id: 0,
    currency: '',
    name: '',
    state: '',
    data: {
        address: '',
    },
};

export interface BeneficiariesState {
    activate: {
        data: Beneficiary;
        fetching: boolean;
        success: boolean;
        error?: CommonError;
    };
    create: {
        data: Beneficiary;
        fetching: boolean;
        success: boolean;
        error?: CommonError;
    };
    fetch: {
        data: Beneficiary[];
        fetching: boolean;
        success: boolean;
        error?: CommonError;
    };
    delete: {
        data: {
            id: number;
        }
        fetching: boolean;
        success: boolean;
        error?: CommonError;
    };
}

export const initialBeneficiariesState: BeneficiariesState = {
    activate: {
        data: defaultBeneficiary,
        fetching: false,
        success: false,
    },
    create: {
        data: defaultBeneficiary,
        fetching: false,
        success: false,
    },
    fetch: {
        data: [],
        fetching: false,
        success: false,
    },
    delete: {
        data: {
            id: 0,
        },
        fetching: false,
        success: false,
    },
};

export const beneficiariesFetchReducer = (state: BeneficiariesState['fetch'], action: BeneficiariesActions) => {
    switch (action.type) {
        case BENEFICIARIES_FETCH:
            return {
                ...state,
                fetching: true,
                success: false,
                error: undefined,
            };
        case BENEFICIARIES_DATA:
            return {
                ...state,
                data: action.payload,
                fetching: false,
                success: true,
                error: undefined,
            };
        case BENEFICIARIES_DATA_UPDATE:
            const updatedData: Beneficiary[] = [...state.data];
            const updateItemIndex = updatedData.findIndex(item => action.payload && action.payload.id === item.id);

            if (updateItemIndex > -1) {
                updatedData[updateItemIndex] = action.payload;
            } else {
                updatedData.push(action.payload);
            }

            return {
                ...state,
                data: updatedData,
                fetching: false,
                success: true,
                error: undefined,
            };
        case BENEFICIARIES_ERROR:
            return {
                ...state,
                fetching: false,
                success: false,
                error: action.payload,
            };
        default:
            return state;
    }
};

const beneficiariesActivateReducer = (state: BeneficiariesState['activate'], action: BeneficiariesActions) => {
    switch (action.type) {
        case BENEFICIARIES_ACTIVATE:
            return {
                ...state,
                fetching: true,
                success: false,
                error: undefined,
            };
        case BENEFICIARIES_ACTIVATE_DATA:
            return {
                ...state,
                data: action.payload,
                fetching: false,
                success: true,
                error: undefined,
            };
        case BENEFICIARIES_ACTIVATE_ERROR:
            return {
                ...state,
                fetching: false,
                success: false,
                error: action.payload,
            };
        default:
            return state;
    }
};

const beneficiariesCreateReducer = (state: BeneficiariesState['create'], action: BeneficiariesActions) => {
    switch (action.type) {
        case BENEFICIARIES_CREATE:
            return {
                ...state,
                fetching: true,
                success: false,
                error: undefined,
            };
        case BENEFICIARIES_CREATE_DATA:
            return {
                ...state,
                data: action.payload,
                fetching: false,
                success: true,
                error: undefined,
            };
        case BENEFICIARIES_CREATE_ERROR:
            return {
                ...state,
                fetching: false,
                success: false,
                error: action.payload,
            };
        default:
            return state;
    }
};

const beneficiariesDeleteReducer = (state: BeneficiariesState['delete'], action: BeneficiariesActions) => {
    switch (action.type) {
        case BENEFICIARIES_DELETE:
            return {
                ...state,
                fetching: true,
                success: false,
                error: undefined,
            };
        case BENEFICIARIES_DELETE_DATA:
            return {
                ...state,
                data: action.payload,
                fetching: false,
                success: true,
                error: undefined,
            };
        case BENEFICIARIES_DELETE_ERROR:
            return {
                ...state,
                fetching: false,
                success: false,
                error: action.payload,
            };
        default:
            return state;
    }
};

export const beneficiariesReducer = (state = initialBeneficiariesState, action: BeneficiariesActions) => {
    switch (action.type) {
        case BENEFICIARIES_ACTIVATE:
        case BENEFICIARIES_ACTIVATE_DATA:
        case BENEFICIARIES_ACTIVATE_ERROR:
            const beneficiariesActivateState = { ...state.activate };

            return {
                ...state,
                activate: beneficiariesActivateReducer(beneficiariesActivateState, action),
            };
        case BENEFICIARIES_FETCH:
        case BENEFICIARIES_DATA:
        case BENEFICIARIES_DATA_UPDATE:
        case BENEFICIARIES_ERROR:
            const beneficiariesFetchState = { ...state.fetch };

            return {
                ...state,
                fetch: beneficiariesFetchReducer(beneficiariesFetchState, action),
            };
        case BENEFICIARIES_CREATE:
        case BENEFICIARIES_CREATE_DATA:
        case BENEFICIARIES_CREATE_ERROR:
            const beneficiariesCreateState = { ...state.create };

            return {
                ...state,
                create: beneficiariesCreateReducer(beneficiariesCreateState, action),
            };
        case BENEFICIARIES_DELETE:
        case BENEFICIARIES_DELETE_DATA:
        case BENEFICIARIES_DELETE_ERROR:
            const beneficiariesDeleteState = { ...state.delete };

            return {
                ...state,
                delete: beneficiariesDeleteReducer(beneficiariesDeleteState, action),
            };
        default:
            return state;
    }
};

