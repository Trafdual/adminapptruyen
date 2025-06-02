import { Modal, Form, Input, Select, message } from 'antd'
import { useState, useEffect } from 'react'
import { getApiUrl } from '../../../api/api'

const { Option } = Select

function EditUser ({ visible, onCancel, userData, onSuccess }) {
  const [loading, setLoading] = useState(false)
  const [form] = Form.useForm()

  useEffect(() => {
    if (userData) {
      form.setFieldsValue({
        username: userData.username,
        phone: userData.phone,
        role: userData.role
      })
    }
  }, [userData, form])

  const handleOk = async () => {
    try {
      const values = await form.validateFields()
      setLoading(true)

      const res = await fetch(
        `${getApiUrl('backend')}/userputnewweb/${userData._id}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(values)
        }
      )

      const result = await res.json()

      if (res.ok) {
        message.success('Cập nhật người dùng thành công!')
        onSuccess?.()
        onCancel()
      } else {
        message.error(result.message || 'Cập nhật thất bại')
      }
    } catch (error) {
      console.error('Lỗi gửi form:', error)
      message.error('Lỗi khi cập nhật người dùng')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal
      open={visible}
      title='Chỉnh sửa người dùng'
      onCancel={onCancel}
      onOk={handleOk}
      confirmLoading={loading}
      okText='Lưu'
      cancelText='Hủy'
    >
      <Form form={form} layout='vertical'>
        <Form.Item
          label='Tên người dùng'
          name='username'
          rules={[{ required: true, message: 'Vui lòng nhập tên người dùng' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label='Số điện thoại'
          name='phone'
          rules={[
            { required: true, message: 'Vui lòng nhập số điện thoại' },
            { pattern: /^\d{10}$/, message: 'Số điện thoại phải đủ 10 số' }
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label='Vai trò'
          name='role'
          rules={[{ required: true, message: 'Vui lòng chọn vai trò' }]}
        >
          <Select placeholder='Chọn vai trò'>
            <Option value='user'>User</Option>
            <Option value='nhomdich'>Nhóm dịch</Option>
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default EditUser
