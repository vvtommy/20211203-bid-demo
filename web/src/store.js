import { createStore } from 'redux';

const initState = {
  clients: {},
  logs: [],
  serverConnected: false,
};

function addClient(state, action) {
  const { clients } = state;
  const { payload } = action;
  const { id } = payload;
  return { ...state, clients: { ...clients, [id]: payload } };
}

function removeClient(state, { payload }) {
  const { id } = payload;
  const { clients } = state;
  if (!clients[id]) {
    return state;
  }
  const newClients = Object.keys(clients)
    .filter((clientId) => clientId !== id)
    .reduce((prev, current) => ({ ...prev, [current]: clients[current] }), {});
  return { ...state, clients: newClients };
}

function appendLog(state, { key, id, data, spend }) {
  console.log('PAYLOAD:', key, id, data);
  const buf = Buffer.from(data.data);
  return {
    ...state,
    logs: state.logs.concat([
      {
        id,
        key,
        dateTime: new Date(),
        data: buf,
        spend,
      },
    ]),
  };
}

function setOnline(state, { payload }) {
  return { ...state, serverConnected: payload };
}

function reducer(state = initState, action) {
  switch (action.type) {
    case 'client/add':
      return addClient(state, action);
    case 'client/remove':
      return removeClient(state, action);
    case 'log/append':
      return appendLog(state, action);
    case 'ws/connect':
      return setOnline(state, { payload: true });
    case 'ws/disconnect':
      return setOnline(state, { payload: false });
    default:
  }
  return state;
}
const store = createStore(
  reducer,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

export default store;
