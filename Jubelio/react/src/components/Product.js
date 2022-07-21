import React, { useState }  from 'react';
import { inject, observer } from "mobx-react";
import { Card, Image, Modal } from 'antd';
import { EditOutlined, DeleteFilled, ExclamationCircleOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';

function Product(props) {
    const { product, productStore } = props
    const { id, name, price, description, prdimage01, prdimage02, prdimage03, prdimage04 } = product
    
    const [visible, setVisible] = useState(false);

    const formatter = new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
    });

    const handleBtnDelete = () => {
        Modal.confirm({
            title: 'Confirm',
            icon: <ExclamationCircleOutlined />,
            content: 'Apakah Yakin akan dihapus ?',
            okText: 'Ya',
            cancelText: 'No',
            onOk: () => {
                productStore.deleteProduct(id)
            }
        });
    }

    const handleBtnEdit = () => {
        productStore.showModal();
    }

    return (
        <Card
            loading={productStore.isLoading}
            title={name}
            cover={
                <>
                    <Image
                        style={{ maxHeight: 300, minHeight: 300 }}
                        preview={{ visible: false }}
                        src={prdimage01}
                        onClick={() => setVisible(true)}
                    />
                    <div style={{ display: 'none' }}>
                        <Image.PreviewGroup preview={{ visible, onVisibleChange: vis => setVisible(vis) }}>
                            {
                                prdimage01 ? <Image src={prdimage01} /> : ''
                            }
                            {
                                prdimage02 ? <Image src={prdimage02} /> : ''
                            }
                            {
                                prdimage03 ? <Image src={prdimage03} /> : ''
                            }
                            {
                                prdimage04 ? <Image src={prdimage04} /> : ''
                            }
                        </Image.PreviewGroup>
                    </div>
                </>
            }
            actions={[
                <Link to={`/product/${id}`}><EditOutlined key="edit" /></Link>,
                <EditOutlined key="edit" onClick={() => productStore.showModal(id)} />,
                <DeleteFilled onClick={handleBtnDelete} key="delete" />
            ]}
          >
            <Card.Meta
              title={formatter.format(price)}
              description={
                  <>
                      <p>
                          {description.replace(/(<([^>]+)>)/gi, "").substring(0, 50)}
                      </p>
                  </>
              }
              >
            </Card.Meta>
        </Card>
    );
}

export default inject('productStore')(observer(Product));