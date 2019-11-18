import { handleIncrementalUpdate } from '../../../helpers';
import { DepthActions, OrderBookActions } from './actions';
import {
  DEPTH_DATA,
  DEPTH_DATA_INCREMENT,
  DEPTH_DATA_SNAPSHOT,
  DEPTH_ERROR,
  DEPTH_FETCH,
  ORDER_BOOK_DATA,
  ORDER_BOOK_ERROR,
  ORDER_BOOK_FETCH,
} from './constants';
import {
  DepthIncrementState,
  DepthState,
  OrderBookState,
} from './types';

// TODO: Move market depth to his own module

export const initialOrderBook: OrderBookState = {
  asks: [],
  bids: [],
  loading: false,
};

export const initialDepth: DepthState = {
  asks: [],
  bids: [],
  loading: false,
};

export const initialIncrementDepth: DepthIncrementState = {
  asks: [],
  bids: [],
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
    default:
      return state;
    }
};

export const incrementDepthReducer = (state = initialIncrementDepth, action: DepthActions): DepthIncrementState => {
  switch (action.type) {
    case DEPTH_DATA_INCREMENT:
      if (action.payload.asks) {
        return {
          ...state,
          asks: handleIncrementalUpdate(state.asks, action.payload.asks, 'asks'),
        };
      }

      if (action.payload.bids) {
        return {
          ...state,
          bids: handleIncrementalUpdate(state.bids, action.payload.bids, 'bids'),
        };
      }

      return state;
    case DEPTH_DATA_SNAPSHOT:
      return {
        ...state,
        asks: action.payload.asks,
        bids: action.payload.bids,
      };
    default:
      return state;
    }
};
