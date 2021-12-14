import store from './store';

let socket;

function connect(address) {
  socket = new WebSocket(address);
  // ws.on('open', () => store.dispatch('ws/connect'));
  // ws.on('close', () => store.dispatch('ws/disconnect'));
  // ws.on('message', (data) => store.dispatch(JSON.stringify(data)));
  socket.onmessage = ({ data }) => {
    console.log(data);
    store.dispatch(JSON.parse(data));
  };
  socket.onopen = () => {
    store.dispatch({ type: 'ws/connect' });
    socket.send(JSON.stringify({ type: 'ask' }));
  };
  socket.onclose = () => {
    store.dispatch({ type: 'ws/disconnect' });
    connect(address);
  };
}

export function useWS() {
  return socket;
}

export default connect;
