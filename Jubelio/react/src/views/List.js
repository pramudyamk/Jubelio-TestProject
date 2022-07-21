
import { inject, observer } from "mobx-react";
import InfiniteScroll from 'react-infinite-scroll-component';
import { Row, Col, Button } from 'antd';
import Product from '../components/Product';
import React from "react";
import ModalProduct from "../components/ModalProduct";

class List extends React.Component {
  constructor() {
    super();
    this.fetchMoreData = this.fetchMoreData.bind(this);
  }

  componentDidMount() {
    this.fetchMoreData();
  }

  fetchMoreData() {
    const { productStore } = this.props;

    if (productStore.hasMore) {
      setTimeout(() => {
        productStore.loadProducts();
      }, 2000);
    }
  }

  render() {
    const { productStore } = this.props;
    return (
      <>
        <InfiniteScroll 
          next={this.fetchMoreData}
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

        <ModalProduct visibleModal={productStore.visibleModal} form={productStore.form} productStore={productStore}/>
  
        {/* <Row gutter={[16, 16]}>
            {
              productStore.products.map((item, key) => {
                  return (
                    <Col key={key} span={6}>
                      <Product product={item[1]} />
                    </Col>
                  )
                })
            }
            { 
              productStore.hasMore ? (
                <p style={{ textAlign: 'center' }}>
                      <Button onClick={() => this.fetchMoreData()}>Load More</Button>
                    </p>
              ) : ''
            }
            
        </Row> */}
      </>
    )
  }
}

export default inject('productStore')(observer(List));