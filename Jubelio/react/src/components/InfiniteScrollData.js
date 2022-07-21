
import { Row, Col } from 'antd';
import InfiniteScroll from 'react-infinite-scroll-component';
import Product from './Product';
import { inject, observer } from "mobx-react";
import { Component } from 'react';

class InfiniteScrollData extends Component {

  fetchMoreData = () => {
    const { productStore } = this.props;

    if (productStore.hasMore && productStore.nexPage) {
      setTimeout(() => {
        productStore.loadProducts();
      }, 2000);
    }
  }
  
  render() {
    const { productStore } = this.props;
    return (
      <InfiniteScroll 
        next={this.fetchMoreData()}
        dataLength={productStore.products.length}
        hasMore={productStore.hasMore}
        endMessage={
          <p style={{ textAlign: 'center' }}>
            <b>Yay! You have seen it all</b>
          </p>
        }
        >
        <Row gutter={[16, 16]}>
            {
              productStore.products.map((item, key) => {
                  return (
                    <Col key={key} span={6}>
                      <Product product={item[1]} />
                    </Col>
                  )
                })
            }
        </Row>
      </InfiniteScroll>
    )
  }
}

export default inject('productStore')(observer(InfiniteScrollData));