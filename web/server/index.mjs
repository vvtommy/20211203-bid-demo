import { WebSocketServer } from 'ws';
import Log from 'electron-log';

const wss = new WebSocketServer({ port: 9001 });

let clients = {};

function broadcastClients() {
  const list = Object.keys(clients).map((key) => ({ key, ...clients[key] }));

  wss.clients.forEach((client) => {
    list.forEach((c) => {
      const { id, key, encoders } = c;
      client.send(
        JSON.stringify({ type: 'client/add', payload: { id, key, encoders } })
      );
    });
  });
}

wss.on('connection', function connection(ws) {
  const { remoteAddress, remotePort } = ws._socket;
  const key = `${remoteAddress}:${remotePort}`;
  const clientLog = Log.scope(`client(${key})`);
  ws.on('message', function message(data) {
    clientLog.info(`new message: ${data}`);
    const action = JSON.parse(data);
    switch (action.type) {
      case 'reg':
        clients[key] = { ws, encoders: action.encoders, id: action.id };
        wss.clients.forEach((c) => {
          c.send(
            JSON.stringify({
              type: 'client/add',
              payload: { id: action.id, encoders: action.encoders, key },
            })
          );
        });
        return;
      case 'ask':
        broadcastClients();
        return;
      case 'send':
        if (!clients[action.key]) {
          clientLog.error(`client not connected. key = ${action.key}`);
          return;
        }

        clients[action.key].ws.send(data);
        return;
      case 'change':
        if (!clients[action.key]) {
          clientLog.error(`client not connected. key = ${action.key}`);
          return;
        }

        clients[action.key].ws.send(data);
        return;
      case 'log':
        const payload = JSON.stringify({
          type: 'log/append',
          key,
          id: action.id,
          data: action.data,
          spend: action.spend,
        });
        wss.clients.forEach((c) => c.send(payload));
        return;
      default:
    }
  });
  ws.on('close', () => {
    const newClients = Object.keys(clients)
      .filter((clientKey) => clientKey !== key)
      .reduce(
        (prev, current) => ({ ...prev, [current]: clients[current] }),
        {}
      );
    if (clients[key]) {
      const sendPayload = JSON.stringify({
        type: 'client/remove',
        payload: { id: clients[key].id },
      });
      wss.clients.forEach((c) => {
        c.send(sendPayload);
      });
    }
    clients = { ...newClients };
  });
});
