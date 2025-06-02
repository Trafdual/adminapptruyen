import { useState } from 'react'
import { Modal, Form, Input, message } from 'antd'
import { getApiUrl } from '../../../api/api'

function AddCategory ({ visible, onClose, onSuccess }) {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)

  const handleAdd = async () => {
    try {
      const values = await form.validateFields()
      setLoading(true)
      const response = await fetch(`${getApiUrl('backend')}/addcategory`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(values)
      })

      const data = await response.json()
      setLoading(false)

      if (response.ok) {
        message.success('Thêm thể loại thành công!')
        form.resetFields()
        onSuccess && onSuccess()
        onClose()
      } else {
        message.error(data.error || 'Thêm thất bại')
      }
    } catch (error) {
      console.error('Lỗi khi thêm thể loại:', error)
      message.error('Đã xảy ra lỗi.')
      setLoading(false)
    }
  }

  return (
    <Modal
      title='Thêm thể loại'
      open={visible}
      onCancel={onClose}
      onOk={handleAdd}
      confirmLoading={loading}
      okText='Thêm'
      cancelText='Hủy'
    >
      <Form layout='vertical' form={form}>
        <Form.Item
          label='Tên thể loại'
          name='categoryname'
          rules={[{ required: true, message: 'Vui lòng nhập tên thể loại' }]}
        >
          <Input placeholder='Nhập tên thể loại' />
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default AddCategory
