import { useState, useEffect } from 'react'
import { Modal, Form, Input, message } from 'antd'
import { getApiUrl } from '../../../api/api'

function EditCategory ({ visible, onCancel, onSuccess, categoryData }) {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (categoryData) {
      form.setFieldsValue({
        categoryname: categoryData.categoryname
      })
    }
  }, [categoryData, form])

  const handleUpdate = async () => {
    try {
      const values = await form.validateFields()
      setLoading(true)

      const response = await fetch(
        `${getApiUrl('backend')}/categoryputnew/${categoryData._id}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(values)
        }
      )

      const data = await response.json()
      setLoading(false)

      if (response.ok) {
        message.success('Cập nhật thể loại thành công!')
        form.resetFields()
        onSuccess && onSuccess()
        onCancel()
      } else {
        message.error(data.message || 'Cập nhật thất bại')
      }
    } catch (error) {
      console.error('Lỗi khi cập nhật thể loại:', error)
      message.error('Đã xảy ra lỗi.')
      setLoading(false)
    }
  }

  return (
    <Modal
      title='Chỉnh sửa thể loại'
      open={visible}
      onCancel={onCancel}
      onOk={handleUpdate}
      confirmLoading={loading}
      okText='Lưu'
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

export default EditCategory
