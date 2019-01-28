import { DepthActions, OrderBookActions } from './actions';
import {
  DEPTH_DATA,
  DEPTH_ERROR,
  DEPTH_FETCH,
  ORDER_BOOK_DATA,
  ORDER_BOOK_ERROR,
  ORDER_BOOK_FETCH,
  SET_CURRENT_PRICE,
} from './constants';
import { DepthState, OrderBookState } from './types';

export const initialOrderBook: OrderBookState = {
  asks: [],
  bids: [],
  loading: false,
};

export const initialDepth: DepthState = {
  asks: [],
  bids: [],
  currentPrice: '',
  loading: false,
};

export const orderBookReducer = (state = initialOrderBook, action: OrderBookActions): OrderBookState => {
  switch (action.type) {
    case ORDER_BOOK_FETCH:
      return {
        ...state,
        loading: true,
        error: undefined,
      };
    case ORDER_BOOK_DATA:
      const { asks, bids } = action.payload;
      return {
        ...state,
        asks,
        bids,
        loading: false,
        error: undefined,
      };
    case ORDER_BOOK_ERROR:
      return {
        ...state,
        loading: false,
        error: action.error,
      };
    default:
      return state;
    }
};

export const depthReducer = (state = initialDepth, action: DepthActions): DepthState => {
  switch (action.type) {
    case DEPTH_FETCH:
      return {
        ...state,
        loading: true,
        error: undefined,
      };
    case DEPTH_DATA:
      const { asks, bids } = action.payload;
      return {
        ...state,
        asks,
        bids,
        loading: false,
        error: undefined,
      };
    case DEPTH_ERROR:
      return {
        ...state,
        loading: false,
        error: action.error,
      };
    case SET_CURRENT_PRICE:
      return {
        ...state,
        currentPrice: action.payload,
      };
    default:
      return state;
    }
};
