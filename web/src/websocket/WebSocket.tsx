import React, { useEffect, useRef, useState } from 'react';
import { incrementalOrderBook, rangerUrl } from 'src/api'
import { useDispatch, useSelector } from 'react-redux';
import { CanCan } from 'src/containers';
import { depthData, depthDataIncrement, depthDataSnapshot, depthIncrementSubscribe, selectAbilities, selectCurrentMarket, selectLoadingAbilities, selectOrderBookSequence, selectUserFetching, selectUserLoggedIn } from '../modules';
import { generateSocketURI, streamsBuilder } from './helpers';
import useWebSocket from "react-use-websocket";

const WebSocketContext = React.createContext(null);

export default ({ children }) => {
    const ws = useRef(null);
    const { lastMessage } = useWebSocket(`${rangerUrl()}/public?stream=global.tickers&stream=dashbtc.ob-inc`);

    const [ connected, setConnected ] = useState<boolean>(false);
    const [ withAuth, setWithAuth ] = useState<boolean>(false);
    const [ withP2P, setWithP2P ] = useState<boolean>(false);
    const [ subscriptions, setSubscriptions ] = useState<string[]>([]);
    const [ messages, setMessages ] = useState<object[]>([]);
    const dispatch = useDispatch();
    const userLoggedIn = useSelector(selectUserLoggedIn);
    const userLoading = useSelector(selectUserFetching);
    const abilities = useSelector(selectAbilities);
    const abilitiesLoading = useSelector(selectLoadingAbilities);
    const canReadP2P = CanCan.checkAbilityByAction('read', 'P2P', abilities);
    const currentMarket = useSelector(selectCurrentMarket);
    const previousSequence = useSelector(selectOrderBookSequence);

    useEffect(() => {
        if (incrementalOrderBook()) {
            dispatch(depthIncrementSubscribe(currentMarket?.id));
        }
    }, [currentMarket]);

    useEffect(() => {
        if (!connected && ((!userLoggedIn && !userLoading) || (userLoggedIn && !abilitiesLoading))) {
            setWithAuth(userLoggedIn);
            setWithP2P(canReadP2P);
        } else if (connected && ((!withAuth && userLoggedIn && !abilitiesLoading) || (!withP2P && canReadP2P))) {
            setWithAuth(userLoggedIn);
            setWithP2P(canReadP2P);
        }
    }, [connected, userLoggedIn, userLoading, userLoggedIn, abilitiesLoading, withAuth, withP2P]);

    useEffect(() => {
        const baseUrl = `${rangerUrl()}/${withAuth ? 'private' : 'public'}`;
        const streams = streamsBuilder(withAuth, withP2P, subscriptions, currentMarket);

        ws.current = new WebSocket(generateSocketURI(baseUrl, streams));

        ws.current.onerror = error => {
            window.console.log(`WebSocket error ${error}`);
            window.console.dir(error);
        };
        ws.current.onopen = () => {
            console.log("ws opened");
            setConnected(true);

            while (messages.length > 0) {
                const message = messages.shift();
                ws.current.send(JSON.stringify(message));
            }
        };
        ws.current.onclose = () => {
            setConnected(false);
            console.log("ws closed");
        };

        return () => {
            ws.current.close();
        };
    }, [
        messages,
        withAuth,
        withP2P,
        subscriptions,
        currentMarket,
    ]);


    useEffect(() => {
        let payload: { [pair: string]: any } = {};

        try {
            payload = JSON.parse(lastMessage?.data as string);
        } catch (e) {
            window.console.error(`Error parsing : ${e.data}`);
        }
        for (const routingKey in payload) {
            if (payload.hasOwnProperty(routingKey)) {
                const event = payload[routingKey];

                const orderBookMatch = routingKey.match(/([^.]*)\.update/);
                const orderBookMatchSnap = routingKey.match(/([^.]*)\.ob-snap/);
                const orderBookMatchInc = routingKey.match(/([^.]*)\.ob-inc/);
                window.console.log(orderBookMatchInc, currentMarket);

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
                            ws.current.close();

                            return;
                        }
                        dispatch(depthDataIncrement(event));
                    }

                    return;
                }
            }
        }
    }, [currentMarket, previousSequence, lastMessage]);

    // useEffect(() => {
    //     window.console.log(ws.current);
    //     if (!ws.current) return;

    //     ws.current.onmessage = ({ data }) => {
    //         let payload: { [pair: string]: any } = {};

    //         try {
    //             payload = JSON.parse(data as string);
    //         } catch (e) {
    //             window.console.error(`Error parsing : ${e.data}`);
    //         }
    //         window.console.log(payload);

    //         for (const routingKey in payload) {
    //             if (payload.hasOwnProperty(routingKey)) {
    //                 const event = payload[routingKey];

    //                 const orderBookMatch = routingKey.match(/([^.]*)\.update/);
    //                 const orderBookMatchSnap = routingKey.match(/([^.]*)\.ob-snap/);
    //                 const orderBookMatchInc = routingKey.match(/([^.]*)\.ob-inc/);
    //                 window.console.log(orderBookMatchInc, currentMarket);

    //                 // public
    //                 if (orderBookMatch) {
    //                     if (orderBookMatch[1] === currentMarket?.id) {
    //                         dispatch(depthData(event));
    //                     }

    //                     return;
    //                 }

    //                 // public
    //                 if (orderBookMatchSnap) {
    //                     if (orderBookMatchSnap[1] === currentMarket?.id) {
    //                         dispatch(depthDataSnapshot(event));
    //                     }

    //                     return;
    //                 }

    //                 // public
    //                 if (orderBookMatchInc) {
    //                     if (orderBookMatchInc[1] === currentMarket?.id) {
    //                         if (previousSequence === null) {
    //                             window.console.log('OrderBook increment received before snapshot');

    //                             return;
    //                         }
    //                         if (previousSequence + 1 !== event.sequence) {
    //                             window.console.log(`Bad sequence detected in incremental orderbook previous: ${previousSequence}, event: ${event.sequence}`);
    //                             ws.current.close();

    //                             return;
    //                         }
    //                         dispatch(depthDataIncrement(event));
    //                     }

    //                     return;
    //                 }
    //             }
    //         }
    //     };
    // }, [currentMarket, previousSequence, ws]);

    return (
        <WebSocketContext.Provider value={ws}>
            {children}
        </WebSocketContext.Provider>
    )
}

export { WebSocketContext }
