/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react'
import { Modal, Form, Input, Select, Upload, Button, message } from 'antd'
import { UploadOutlined } from '@ant-design/icons'
import { getApiUrl } from '../../../api/api'

function EditManga ({ visible, onClose, manga, onSuccess, userid }) {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [categories, setCategories] = useState([])
  const [fileList, setFileList] = useState([])

  useEffect(() => {
    if (visible && manga) {
      fetchCategories()
      form.setFieldsValue({
        manganame: manga.manganame,
        author: manga.author,
        content: manga.content,
        category: manga.category,
        link: manga.link
      })
    }
  }, [visible, manga])

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
      message.error('Lỗi tải danh sách thể loại')
    }
  }

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields()
      const formData = new FormData()

      for (const key in values) {
        formData.append(key, values[key])
      }

      if (fileList.length > 0) {
        formData.append('image', fileList[0].originFileObj)
      }

      setLoading(true)

      const res = await fetch(
        `${getApiUrl('backend')}/mangaputnew/${manga._id}/${userid}`,
        {
          method: 'POST',
          body: formData
        }
      )

      const result = await res.json()

      if (!res.ok) throw new Error(result.message || 'Sửa truyện thất bại')

      message.success(result.message || 'Sửa truyện thành công!')
      onClose()
      onSuccess()
      form.resetFields()
      setFileList([])
    } catch (error) {
      console.error(error)
      message.error(error.message || 'Đã xảy ra lỗi')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal
      open={visible}
      title='Sửa truyện'
      onCancel={onClose}
      onOk={handleSubmit}
      confirmLoading={loading}
      okText='Lưu thay đổi'
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

        <Form.Item
          label='Link truyện'
          name='link'
          rules={[{ required: true, message: 'Vui lòng nhập link' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item label='Hình ảnh mới (nếu muốn thay đổi)'>
          <Upload
            beforeUpload={() => false}
            fileList={fileList}
            onChange={({ fileList }) => setFileList(fileList)}
            accept='image/*'
            maxCount={1}
          >
            <Button icon={<UploadOutlined />}>Chọn ảnh</Button>
          </Upload>
          {manga?.image && (
            <img
              src={manga.image}
              alt='Ảnh hiện tại'
              style={{ marginTop: 10, maxHeight: 100 }}
            />
          )}
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default EditManga
