import React, { useCallback, useEffect, useState } from 'react';
import { incrementalOrderBook, isFinexEnabled } from 'src/api'
import { useDispatch, useSelector } from 'react-redux';
import { CanCan } from 'src/containers';
import {
    alertPush,
    depthData,
    depthDataIncrement,
    depthDataSnapshot,
    depthIncrementSubscribe,
    klinePush,
    marketsTickersData,
    p2pOffersUpdate,
    p2pOrdersDataWS,
    p2pUserOffersUpdate,
    pushHistoryEmit,
    recentTradesPush,
    selectAbilities,
    selectCurrentMarket,
    selectKline,
    selectLoadingAbilities,
    selectOpenOrdersList,
    selectOrderBookSequence,
    selectOrdersHideOtherPairsState,
    selectUserFetching,
    selectUserLoggedIn,
    updateP2PWalletsDataByRanger,
    updateWalletsDataByRanger,
    userOpenOrdersUpdate,
    userOrdersHistoryRangerData,
    walletsAddressDataWS,
} from '../modules';
import {
    formatTicker,
    generateSocketURI,
    isTradingPage,
    marketKlineStreams,
    streamsBuilder,
} from './helpers';
import useWebSocket, { ReadyState } from "react-use-websocket";
import { useLocation } from 'react-router-dom';

const WebSocketContext = React.createContext(null);

export default ({ children }) => {
    const [ subscriptions, setSubscriptions ] = useState<string[]>([]);
    const [ socketUrl, setSocketUrl ] = useState<string>(null);
    const [ messages, setMessages ] = useState<object[]>([]);

    const dispatch = useDispatch();
    const location = useLocation();
    const userLoggedIn = useSelector(selectUserLoggedIn);
    const userLoading = useSelector(selectUserFetching);
    const abilities = useSelector(selectAbilities);
    const abilitiesLoading = useSelector(selectLoadingAbilities);
    const canReadP2P = CanCan.checkAbilityByAction('read', 'P2P', abilities);
    const currentMarket = useSelector(selectCurrentMarket);
    const previousSequence = useSelector(selectOrderBookSequence);
    const orders = useSelector(selectOpenOrdersList);
    const kline = useSelector(selectKline);
    const openOrderHideOtherPairs = useSelector(selectOrdersHideOtherPairsState);

    useEffect(() => {
        if (incrementalOrderBook()) {
            dispatch(depthIncrementSubscribe(currentMarket?.id));
        }
    }, [currentMarket]);

    // generate streams list for first WS connection
    useEffect(() => {
        if (!userLoading && !abilitiesLoading && !socketUrl) {
            const streams = streamsBuilder(userLoggedIn, canReadP2P, currentMarket, location.pathname);

            if (streams.length) {
                setSocketUrl(generateSocketURI(userLoggedIn, streams));
            }
        }
    }, [userLoggedIn, canReadP2P, currentMarket, userLoading, abilitiesLoading, location, socketUrl]);

    // handle change subscriptions
    useEffect(() => {
        if (!userLoading && !abilitiesLoading && subscriptions.length) {
            const streams = streamsBuilder(userLoggedIn, canReadP2P, currentMarket, location.pathname);

            const subscribeStreams = streams.filter(i => !subscriptions.includes(i));
            if (subscribeStreams.length) {
                subscribe(subscribeStreams);
            }

            const unsubscribeStreams = subscriptions.filter(i => !streams.includes(i) && !(isTradingPage(location.pathname) && i.includes('kline')));
            if (unsubscribeStreams.length) {
                unsubscribe(unsubscribeStreams);
            }
        }
    }, [userLoggedIn, canReadP2P, currentMarket, userLoading, abilitiesLoading, location, subscriptions]);

    // handle k-line subscriptions
    useEffect(() => {
        if (kline.marketId && kline.period && !kline.loading) {
            switch (kline.message) {
                case 'subscribe':
                    subscribe(marketKlineStreams(kline.marketId, kline.period).channels);
                    break;
                case 'unsubscribe':
                    unsubscribe(marketKlineStreams(kline.marketId, kline.period).channels);
                    break;
                default:
                    break;
            }
        }
    }, [kline.period, kline.marketId, kline.message, kline.loading]);

    // handle main websocket events
    const {
        sendJsonMessage,
        lastJsonMessage,
        readyState,
        getWebSocket,
    } = useWebSocket(socketUrl, {
        onOpen: () => {
            window.console.log('WebSocket connection opened');

            for (const m of messages) {
                sendJsonMessage(m);
            }

            setMessages([]);
        },
        onClose: () => {
            window.console.log("WebSocket connection closed");
        },
        onError: error => {
            window.console.log(`WebSocket error ${error}`);
            window.console.dir(error);
        },
        //Will attempt to reconnect on all close events, such as server shutting down
        shouldReconnect: (closeEvent) => true,
        retryOnError: true,
    });

    // empty buffer messages
    useEffect(() => {
        if (messages.length) {
            for (const m of messages) {
                sendJsonMessage(m);
            }
    
            setMessages([]);
        }
    }, [messages]);

    const postMessage = useCallback(data => {
        if (readyState === ReadyState.OPEN) {
            sendJsonMessage(data);
        } else {
            setMessages(messages => [ ...messages, data]);
        }
    }, [readyState, messages]);

    const subscribe = useCallback((streams: string[]) => {
        postMessage({ event: 'subscribe', streams });
    }, []);

    const unsubscribe = useCallback((streams: string[]) => {
        postMessage({ event: 'unsubscribe', streams });
    }, []);

    const updateOpenOrdersState = useCallback(event => {
        if (currentMarket && (event?.market === currentMarket.id || !openOrderHideOtherPairs)) {
            dispatch(userOpenOrdersUpdate(event));
        }
    }, [currentMarket, openOrderHideOtherPairs]);

    // handle websocket events
    useEffect(() => {
        let payload: { [pair: string]: any } = lastJsonMessage;

        for (const routingKey in payload) {
            if (payload.hasOwnProperty(routingKey)) {
                const event = payload[routingKey];

                const orderBookMatch = routingKey.match(/([^.]*)\.update/);
                const orderBookMatchSnap = routingKey.match(/([^.]*)\.ob-snap/);
                const orderBookMatchInc = routingKey.match(/([^.]*)\.ob-inc/);

                // public
                if (orderBookMatch) {
                    if (orderBookMatch[1] === currentMarket?.id) {
                        dispatch(depthData(event));
                    }

                    return;
                }

                // public
                if (orderBookMatchSnap) {
                    if (orderBookMatchSnap[1] === currentMarket?.id) {
                        dispatch(depthDataSnapshot(event));
                    }

                    return;
                }

                // public
                if (orderBookMatchInc) {
                    if (orderBookMatchInc[1] === currentMarket?.id) {
                        if (previousSequence === null) {
                            window.console.log('OrderBook increment received before snapshot');

                            return;
                        }
                        if (previousSequence + 1 !== event.sequence) {
                            window.console.log(`Bad sequence detected in incremental orderbook previous: ${previousSequence}, event: ${event.sequence}`);

                            return;
                        }
                        dispatch(depthDataIncrement(event));
                    }

                    return;
                }

                // public
                const klineMatch = String(routingKey).match(/([^.]*)\.kline-(.+)/);
                if (klineMatch) {
                    dispatch(
                        klinePush({
                            marketId: klineMatch[1],
                            kline: event,
                            period: klineMatch[2],
                        }),
                    );

                    return;
                }

                // public
                const tradesMatch = String(routingKey).match(/([^.]*)\.trades/);
                if (tradesMatch) {
                    dispatch(
                        recentTradesPush({
                            trades: event.trades,
                            market: tradesMatch[1],
                        }),
                    );

                    return;
                }

                switch (routingKey) {
                    // public
                    case 'global.tickers':
                        dispatch(marketsTickersData(formatTicker(event)));

                        return;

                    // public
                    case 'success':
                        switch (event.message) {
                            case 'subscribed':
                            case 'unsubscribed':
                                setSubscriptions(event.streams);

                                return;
                            default:
                        }

                        return;

                    // private
                    case 'order':
                        if (isFinexEnabled() && event) {
                            switch (event.state) {
                                case 'wait':
                                case 'pending':
                                    const updatedOrder = orders.length && orders.find(order => event.uuid && order.uuid === event.uuid);
                                    if (!updatedOrder) {
                                        dispatch(alertPush({ message: ['success.order.created'], type: 'success'}));
                                    }
                                    break;
                                case 'done':
                                    dispatch(alertPush({ message: ['success.order.done'], type: 'success'}));
                                    break;
                                case 'reject':
                                case 'execution_reject':
                                    dispatch(alertPush({ message: ['error.order.rejected'], type: 'error'}));
                                    break;
                                default:
                                    break;
                            }
                        }

                        updateOpenOrdersState(event);
                        dispatch(userOrdersHistoryRangerData(event));

                        return;

                    // private
                    case 'trade':
                        dispatch(pushHistoryEmit(event));

                        return;

                    // private
                    case 'balances':
                        dispatch(updateP2PWalletsDataByRanger({ ws: true, balances: event }));
                        dispatch(updateWalletsDataByRanger({ ws: true, balances: event }));

                        return;

                    // private
                    case 'deposit_address':
                        dispatch(walletsAddressDataWS(event));

                        return;

                    // public
                    case 'p2p.event':
                        const p2pPublicOffersMatch = event && String(event.event).includes('p2p_offer');

                        if (p2pPublicOffersMatch) {
                            dispatch(p2pOffersUpdate(event.payload));
                            return;
                        }

                        return;

                    // private
                    case 'p2p':
                        const p2pOrdersMatch = event && String(event.event).includes('p2p_order');

                        if (p2pOrdersMatch) {
                            dispatch(p2pOrdersDataWS(event.payload));

                            return;
                        }

                        const p2pOffersMatch = event && String(event.event).includes('p2p_offer');

                        if (p2pOffersMatch) {
                            dispatch(p2pUserOffersUpdate(event.payload));

                            return;
                        }

                        return;
                    default:
                }
                window.console.log(`Unhandeled websocket channel: ${routingKey}`);
            }
        }
    }, [lastJsonMessage]);

    return (
        <WebSocketContext.Provider value={getWebSocket()}>
            {children}
        </WebSocketContext.Provider>
    )
}

export { WebSocketContext }
