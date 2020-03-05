import { handleIncrementalUpdate } from '../../../helpers';
import { DepthActions, OrderBookActions } from './actions';
import {
  DEPTH_DATA,
  DEPTH_DATA_INCREMENT,
  DEPTH_DATA_SNAPSHOT,
  DEPTH_ERROR,
  DEPTH_FETCH,
  DEPTH_INCREMENT_SUBSCRIBE,
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
  marketId: undefined,
  asks: [],
  bids: [],
  sequence: null,
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
    default:
      return state;
    }
};

export const incrementDepthReducer = (state = initialIncrementDepth, action: DepthActions): DepthIncrementState => {
  switch (action.type) {
    case DEPTH_INCREMENT_SUBSCRIBE:
      return {
        ...state,
        marketId: action.payload,
        loading: state.marketId === undefined || state.marketId !== action.payload,
      };
    case DEPTH_DATA_INCREMENT:
      if (action.payload.asks) {
        return {
          ...state,
          sequence: action.payload.sequence,
          asks: handleIncrementalUpdate(state.asks, action.payload.asks, 'asks'),
        };
      }

      if (action.payload.bids) {
        return {
          ...state,
          sequence: action.payload.sequence,
          bids: handleIncrementalUpdate(state.bids, action.payload.bids, 'bids'),
        };
      }

      return state;
    case DEPTH_DATA_SNAPSHOT:
      const {asks, bids, sequence} = action.payload;
      return {
        ...state,
        asks,
        bids,
        sequence,
        loading: false,
      };
    default:
      return state;
    }
};
