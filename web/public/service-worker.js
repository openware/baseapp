// declare const self: ServiceWorkerGlobalScope;

/**
 * Array to store all the connected ports in.
 */
const connectedPorts = [];

// Create socket instance.
const baseUrl = `ws://localhost:9003/api/v2/ranger/public`;
const ws = new WebSocket(baseUrl);

ws.onopen = () => {
  const subscribe = {
    event: 'subscribe',
    streams: [
      'global.tickers',
      'dashbtc.trades'
    ],
  };

  console.log('[Service worker] - Connection opened');

  ws.send(JSON.stringify(subscribe));
};

ws.onmessage = (event) => {
  console.log('[Service worker] - New message: ', event);
  //const response = JSON.parse(event.data);
  //setOrders(response.data);
};

ws.onclose = () => {
  console.log('[Service worker] - Connection closed');

  ws.close();
};


/*
// Send data from socket to all open tabs.
ws.addEventListener('message', ({ data }) => {
  const payload = JSON.parse(data);
  connectedPorts.forEach(port => port.postMessage(payload));
});


self.addEventListener('connect', ({ ports }: any) => {
  const port = ports[0];

  // Add this new port to the list of connected ports.
  connectedPorts.push(port);

  port.addEventListener('message', ({ data }) => {
    const { action, value } = data;

    // Send message to socket.
    if (action === 'send') {
      ws.send(JSON.stringify(value));

    // Remove port from connected ports list.
    } else if (action === 'unload') {
      const index = connectedPorts.indexOf(port);
      connectedPorts.splice(index, 1);
    }
  });

  // Start the port broadcasting.
  port.start();
});
*/
