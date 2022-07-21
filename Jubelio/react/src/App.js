import React, { Suspense } from 'react';
import { inject, observer } from "mobx-react";
import {
  Routes,
  Route
} from "react-router-dom";
import { Spin } from 'antd';

const AppLayout = React.lazy(() => import('./layouts/AppLayout'));

const List = React.lazy(() => import('./views/List'));
const Show = React.lazy(() => import('./views/Show'));

class App extends React.Component {
  render() {
    return (
      <>
        <Suspense fallback={<Spin />}>
          <Routes>
              <Route path="/" element={<AppLayout/>}>
                <Route index element={<List />} />
                <Route path="/product/:id" element={<Show />} />
                <Route path="/product" element={<Show />} />
              </Route>
          </Routes>
        </Suspense>
      </>
    );
  }
}

export default inject('productStore')(observer(App));