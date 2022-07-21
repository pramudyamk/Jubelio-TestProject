import React, { Component, useEffect } from "react";
import { inject, observer } from "mobx-react";
import { Modal, Form, Input, Button, Upload } from 'antd'
import { UploadOutlined } from '@ant-design/icons';


function ModalProduct({ visibleModal, form, productStore }) {
  const [ formProduct ] = Form.useForm();
  const [data, setData] = React.useState({
    sku: '',
    name: '',
    price: '',
    description: '',
    prodimage01: null,
    prodimage02: null,
    prodimage03: null,
    prodimage04: null,
  })

  if (visibleModal) {
    formProduct.setFieldsValue({...form});
  }

  const updateForm  = (field, val) => {
    productStore.updateForm(field, val);
  }

  const onFinish = (value) => {
    const config = {
        headers: { 'content-type': 'multipart/form-data' }
    }
    
    if (form.id) {
      productStore.updateProduct()
    } else {  
      productStore.createProduct(value)
    }
  }
  const onFinishFailed = (e) => {
    console.log(e)
  }

  const handleCancel = () => {
    productStore.closeModal()
  }

  const dummyRequest = ({ file, onSuccess }) => {
    setTimeout(() => {
      onSuccess("ok");
    }, 0);
  };

  const uploadprops = {
    name: 'image01',
    onChange: info => {
      console.log('info', info)
      switch (info.file.status) {
        case "uploading":
          productStore.updateForm('image', [info.file])
          break;
        case "done":
          productStore.updateForm('image', [info.file])
          break;
        default:
      }
    },
    listType: 'picture',
    customRequest: dummyRequest,
    beforeUpload(file) {
      return new Promise(resolve => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
          const img = document.createElement('img');
          img.src = reader.result;
          img.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = img.naturalWidth;
            canvas.height = img.naturalHeight;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0);
            ctx.fillStyle = 'red';
            ctx.textBaseline = 'middle';
            ctx.font = '33px Arial';
            ctx.fillText('Ant Design', 20, 20);
            canvas.toBlob(resolve);
          };
        };
      });
    },
    fileList: productStore.form.image
  };

  return (
    <>
      <Modal
          title="Form"
          visible={visibleModal}
          onCancel={handleCancel}
          footer={[
            <Button key="back" onClick={handleCancel}>
              Cancel
            </Button>,
            <Button key="submit" type="primary" onClick={() => formProduct.submit()}>
              Save
            </Button>,
          ]}
        >
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
            <Form.Item
              label='Image'
              name='image'
              rules={[{ required: true, message: 'Image is required' }]}
              >
              <Upload id="image" {...uploadprops}>
                <Button icon={<UploadOutlined />}>Upload</Button>
              </Upload>
            </Form.Item>
            
            {/* <Form.Item wrapperCol={{ span: 12, offset: 6 }}>
              <Button type="primary" htmlType="submit">
                Submit
                <input ref="image" type="file" id="image" />
                
              </Button>
            </Form.Item> */}
          </Form> 
        </Modal>
    </>
  )
}
export default ModalProduct