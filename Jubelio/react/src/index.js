import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'mobx-react';
import { configure } from "mobx"
import App from './App';
import reportWebVitals from './reportWebVitals';
import 'antd/dist/antd.min.css'; // or 'antd/dist/antd.less'
import { BrowserRouter } from "react-router-dom";
import productStore from './stores/productStore';

const stores = {
  productStore,
}

configure({
  // useProxies: "never",
  enforceActions: 'observed',
  // enforceActions: "always",
  // computedRequiresReaction: true,
  // observableRequiresReaction: true,
  // reactionRequiresObservable: true,
})

// For easier debugging
window._____APP_STATE_____ = stores;

ReactDOM.render(
  <Provider {...stores}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
