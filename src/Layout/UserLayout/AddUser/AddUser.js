import { useState } from 'react'
import { Modal, Form, Input, Select, Button, message } from 'antd'
import { getApiUrl } from '../../../api/api'

const { Option } = Select

function AddUser ({ visible, onClose, onSuccess }) {
  const [loading, setLoading] = useState(false)
  const [form] = Form.useForm()

  const handleSubmit = async values => {
    setLoading(true)
    try {
      const res = await fetch(`${getApiUrl('backend')}/registernewweb`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values)
      })
      const data = await res.json()
      if (res.ok) {
        message.success('Thêm người dùng thành công!')
        form.resetFields()
        onSuccess && onSuccess()
        onClose()
      } else {
        message.error(data.message || 'Thêm người dùng thất bại')
      }
    } catch (err) {
      console.error(err)
      message.error('Lỗi kết nối server')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal
      open={visible}
      title='Thêm người dùng mới'
      onCancel={onClose}
      footer={null}
      centered
    >
      <Form
        form={form}
        layout='vertical'
        onFinish={handleSubmit}
        initialValues={{ role: 'user' }}
      >
        <Form.Item
          label='Tên người dùng'
          name='username'
          rules={[{ required: true, message: 'Vui lòng nhập tên' }]}
        >
          <Input placeholder='Nhập tên người dùng' />
        </Form.Item>

        <Form.Item
          label='Mật khẩu'
          name='password'
          rules={[{ required: true, message: 'Vui lòng nhập mật khẩu' }]}
        >
          <Input.Password placeholder='Nhập mật khẩu' />
        </Form.Item>

        <Form.Item
          label='Số điện thoại'
          name='phone'
          rules={[
            { required: true, message: 'Vui lòng nhập số điện thoại' },
            { pattern: /^\d{10}$/, message: 'Số điện thoại phải gồm 10 chữ số' }
          ]}
        >
          <Input placeholder='Nhập số điện thoại' />
        </Form.Item>

        <Form.Item label='Vai trò' name='role'>
          <Select>
            <Option value='user'>User</Option>
            <Option value='nhomdich'>Nhóm dịch</Option>
            <Option value='admin'>Admin</Option>
          </Select>
        </Form.Item>

        <Form.Item>
          <Button type='primary' htmlType='submit' loading={loading} block>
            Thêm người dùng
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default AddUser
