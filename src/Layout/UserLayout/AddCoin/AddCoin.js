import { Modal, Form, InputNumber, message } from 'antd'
import { useState } from 'react'
import { getApiUrl } from '../../../api/api'

function AddCoin ({ visible, onCancel, userId, onSuccess, setSelectedUser }) {
  const [loading, setLoading] = useState(false)
  const [form] = Form.useForm()

  const handleOk = async () => {
    try {
      const values = await form.validateFields()
      setLoading(true)

      const res = await fetch(`${getApiUrl('backend')}/postcoin/${userId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ coin: values.coin })
      })

      const result = await res.json()

      if (res.ok) {
        message.success('Nạp xu thành công!')
        onSuccess?.()
        form.resetFields()
        setSelectedUser(null)
        onCancel()
      } else {
        message.error(result.message || 'Nạp xu thất bại')
      }
    } catch (error) {
      console.error(error)
      message.error('Lỗi khi gửi dữ liệu')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal
      open={visible}
      title='Nạp xu cho người dùng'
      onCancel={onCancel}
      onOk={handleOk}
      confirmLoading={loading}
      okText='Nạp xu'
      cancelText='Hủy'
    >
      <Form form={form} layout='vertical'>
        <Form.Item
          label='Số xu cần nạp'
          name='coin'
          rules={[{ required: true, message: 'Vui lòng nhập số xu!' }]}
        >
          <InputNumber
            min={1}
            style={{ width: '100%' }}
            placeholder='Nhập số xu'
          />
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default AddCoin
