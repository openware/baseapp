import { isFinexEnabled } from '../api';

export const getOrderAPI = () => (isFinexEnabled() ? 'finex' : 'peatio');
