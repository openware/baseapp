import { TEST_STATE } from './state';

export const useSelector = jest.fn((selector: (state: any) => any) => {
    return selector(TEST_STATE);
});
