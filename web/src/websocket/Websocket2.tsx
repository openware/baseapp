import React, { useState, useCallback, useMemo, useRef } from 'react';
import useWebSocket, { ReadyState } from 'react-use-websocket';
import { rangerUrl } from 'src/api';

export const WebSocketDemo = () => {
  //Public API that will echo messages sent to it back to the client
  const [socketUrl, setSocketUrl] = useState(`${rangerUrl()}/public?stream=global.tickers`);
  const messageHistory = useRef([]);

  const {
	sendMessage,
	lastMessage,
	readyState,
  } = useWebSocket(socketUrl);

  messageHistory.current = useMemo(() =>
	messageHistory.current.concat(lastMessage),[lastMessage]);

  const handleClickChangeSocketUrl = useCallback(() =>
	setSocketUrl('wss://demos.kaazing.com/echo'), []);

  const handleClickSendMessage = useCallback(() =>
	sendMessage('Hello'), []);

  const connectionStatus = {
	[ReadyState.CONNECTING]: 'Connecting',
	[ReadyState.OPEN]: 'Open',
	[ReadyState.CLOSING]: 'Closing',
	[ReadyState.CLOSED]: 'Closed',
	[ReadyState.UNINSTANTIATED]: 'Uninstantiated',
  }[readyState];

  return (
	<div>
	  <button
		onClick={handleClickChangeSocketUrl}
	  >
		Click Me to change Socket Url
	  </button>
	  <button
		onClick={handleClickSendMessage}
		disabled={readyState !== ReadyState.OPEN}
	  >
		Click Me to send 'Hello'
	  </button>
	  <span>The WebSocket is currently {connectionStatus}</span>
	  {lastMessage ? <span>Last message: {lastMessage.data}</span> : null}
	  <ul>
		{messageHistory.current
		  .map((message, idx) => <span key={idx}>{message ? message.data : null}</span>)}
	  </ul>
	</div>
  );
};