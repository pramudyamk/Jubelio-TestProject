
import { Layout, Menu } from 'antd';
import { Outlet, useNavigate } from "react-router-dom";
import { inject, observer } from 'mobx-react';

function AppLayout(props) {
  const navigate = useNavigate();

  return (
    <Layout>
      <Layout.Header style={{ background: '#fff' }}>
        <Menu mode='horizontal' onClick={() => {
          props.productStore.showModal()
        }}>
          <Menu.Item key="product"> Create Product</Menu.Item>
        </Menu>
      </Layout.Header>
      <Layout.Content style={{ padding: '20px 30px' }}>
        <Outlet />
      </Layout.Content>
    </Layout>
  );
}

// export default AppLayout;

export default inject('productStore')(observer(AppLayout));