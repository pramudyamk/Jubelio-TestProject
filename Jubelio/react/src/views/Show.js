import { Form, Input, Button } from 'antd';
import { inject, observer } from 'mobx-react';
import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getProduct, updateProduct, storeProduct } from '../services/product';

function Show({ productStore }) {
  const [formProduct] = Form.useForm();
  const { id } = useParams()
  const navigate = useNavigate()

  const [data, setData] = React.useState({
      sku: '',
      name: '',
      price: '',
      description: ''
    })

  React.useEffect(() => {
    if (id) {
      getProduct(id)
      .then(({ data }) => {
        setData(data.data);
      })
    }
  }, [])

  formProduct.setFieldsValue({...data});

  const updateForm  = (field, val) => {
    setData({...data, [field]: val});
  }

  const onFinish = (value) => {
    if (id) {
      updateProduct(id, value)
      .then(({data}) => {
        return navigate('/');
      }) 
    } else {  
      storeProduct(value)
      .then(({data}) => {
        return navigate('/');
      }) 
    }
  }
  const onFinishFailed = (e) => {
    console.log(e)
  }
  return (
    <>
      <Form
        form={formProduct}
        labelCol={{ span:8 }}
        wrapperCol={{ span:16 }}
        onFinish={onFinish}
        initialValues={{...data}}
        onFinishFailed={onFinishFailed}
        noValidate
        >
        <Form.Item
          label='Sku'
          name='sku'
          rules={[{ required: true, message: 'Sku is required' }]}
          >
          <Input onChange={(e) => updateForm('sku', e.target.value)}/>
        </Form.Item>
        <Form.Item
          label='Name'
          name='name'
          rules={[{ required: true, message: 'Name is required' }]}
          >
          <Input onChange={(e) => updateForm('name', e.target.value)}/>
        </Form.Item>
        <Form.Item
          label='Price'
          name='price'
          rules={[{ required: true, message: 'Price is required' }]}
          >
          <Input onChange={(e) => updateForm('price', e.target.value)}/>
        </Form.Item>
        <Form.Item
          label='Description'
          name='description'
          rules={[{ required: true, message: 'Description is required' }]}
          >
          <Input.TextArea onChange={(e) => updateForm('description', e.target.value)} />
        </Form.Item>
        
        <Form.Item wrapperCol={{ span: 12, offset: 6 }}>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
    </>
  )
}

export default inject('productStore')(observer(Show));