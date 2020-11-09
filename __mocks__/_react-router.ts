export const useHistory = jest.fn(() => {
    return {
        push: jest.fn(),
    };
});
