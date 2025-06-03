import React, { useEffect, useState } from 'react'
import { Modal, Form, Input, Select, message } from 'antd'
import { getApiUrl } from '../../../api/api'

function AddManga ({ visible, onClose, userId, onSuccess }) {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [categories, setCategories] = useState([])
  const [imageFile, setImageFile] = useState(null)

  useEffect(() => {
    if (visible) {
      fetchCategories()
    }
  }, [visible])

  const fetchCategories = async () => {
    try {
      const res = await fetch(`${getApiUrl('backend')}/categorys`)
      const data = await res.json()
      const formatted = data.map(item => ({
        _id: item.categoryid,
        categoryname: item.categoryname
      }))
      setCategories(formatted)
    } catch (error) {
      console.error('Lỗi khi fetch thể loại:', error)
      message.error('Không thể tải danh sách thể loại.')
    }
  }

  const handleFileChange = e => {
    const file = e.target.files[0]
    if (file) {
      setImageFile(file)
    }
  }

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields()

      if (!imageFile) {
        message.error('Vui lòng chọn hình ảnh')
        return
      }

      setLoading(true)

      const formData = new FormData()
      formData.append('manganame', values.manganame)
      formData.append('author', values.author)
      formData.append('content', values.content)
      formData.append('category', values.category)
      formData.append('image', imageFile)

      const response = await fetch(
        `${getApiUrl('backend')}/mangapostnew/${userId}`,
        {
          method: 'POST',
          body: formData
        }
      )

      if (!response.ok) {
        throw new Error('Thêm truyện thất bại')
      }

      message.success('Thêm truyện thành công!')
      form.resetFields()
      setImageFile(null)
      onSuccess()
      onClose()
    } catch (error) {
      console.error(error)
      message.error('Đã xảy ra lỗi khi thêm truyện.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal
      open={visible}
      title='Thêm truyện mới'
      onCancel={onClose}
      onOk={handleSubmit}
      confirmLoading={loading}
      okText='Thêm'
      cancelText='Hủy'
    >
      <Form form={form} layout='vertical'>
        <Form.Item
          label='Tên truyện'
          name='manganame'
          rules={[{ required: true, message: 'Vui lòng nhập tên truyện' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label='Tác giả'
          name='author'
          rules={[{ required: true, message: 'Vui lòng nhập tên tác giả' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label='Nội dung'
          name='content'
          rules={[{ required: true, message: 'Vui lòng nhập nội dung' }]}
        >
          <Input.TextArea rows={4} />
        </Form.Item>

        <Form.Item
          label='Thể loại'
          name='category'
          rules={[{ required: true, message: 'Vui lòng chọn thể loại' }]}
        >
          <Select placeholder='Chọn thể loại'>
            {categories.map(c => (
              <Select.Option key={c._id} value={c.categoryname}>
                {c.categoryname}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item label='Hình ảnh'>
          <input type='file' accept='image/*' onChange={handleFileChange} />
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default AddManga
