import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import 'jest-enzyme';

Enzyme.configure({ adapter: new Adapter() });

// jest.mock('react-redux', () => {
//     return {
//         useSelector: jest.fn().mockImplementation(() => {
//             return {};
//         }),
//         useDispatch: jest.fn().mockImplementation(() => null),
//     };
// });

// jest.mock('custom-lib', () => {
//     return {};
// });
