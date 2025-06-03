import { Modal, Form, Input, Select, message } from 'antd'
import { useEffect, useState } from 'react'
import { getApiUrl } from '../../../api/api'
const { Option } = Select

function AddChapter ({ visible, onClose, onSuccess, userId }) {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [mangaList, setMangaList] = useState([])

  const fetchMangaList = async () => {
    try {
      const res = await fetch(`${getApiUrl('backend')}/getmanga`)
      const data = await res.json()
      if (res.ok) {
        setMangaList(data)
      } else {
        message.error('Không thể tải danh sách truyện')
      }
    } catch (error) {
      console.error('Lỗi khi tải manga:', error)
    }
  }

  useEffect(() => {
    if (visible) {
      fetchMangaList()
    }
  }, [visible])

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields()
      setLoading(true)

      const res = await fetch(`${getApiUrl('backend')}/chaptersnew/${userId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(values)
      })

      const data = await res.json()
      if (res.ok) {
        message.success(data.message || 'Thêm chapter thành công')
        form.resetFields()
        onSuccess()
        onClose()
      } else {
        message.error(data.message || 'Thêm thất bại')
      }
    } catch (err) {
      console.error(err)
      message.error('Lỗi khi gửi dữ liệu')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal
      open={visible}
      title='Thêm Chapter Mới'
      onCancel={onClose}
      onOk={handleSubmit}
      confirmLoading={loading}
      okText='Thêm'
      cancelText='Hủy'
    >
      <Form
        form={form}
        layout='vertical'
        style={{ maxHeight: '60vh', overflowY: 'auto' }}
      >
        <Form.Item
          name='mangaName'
          label='Tên truyện'
          rules={[{ required: true, message: 'Vui lòng chọn truyện' }]}
        >
          <Select showSearch placeholder='Chọn truyện'>
            {mangaList.map(manga => (
              <Option key={manga._id} value={manga.manganame}>
                {manga.manganame}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name='number'
          label='Số chap'
          rules={[{ required: true, message: 'Vui lòng nhập số chap' }]}
        >
          <Input placeholder='Ví dụ: 1051' />
        </Form.Item>

        <Form.Item
          name='viporfree'
          label='Loại truy cập'
          rules={[{ required: true, message: 'Chọn loại truy cập' }]}
        >
          <Select placeholder='Chọn loại truy cập'>
            <Option value='free'>Miễn phí</Option>
            <Option value='vip'>Trả phí</Option>
          </Select>
        </Form.Item>

        <Form.Item
          name='images'
          label='Danh sách ảnh (dán mỗi dòng 1 link)'
          rules={[{ required: true, message: 'Vui lòng nhập ảnh' }]}
        >
          <Input.TextArea
            rows={6}
            placeholder='http://example.com/1.jpg&#10;http://example.com/2.jpg'
          />
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default AddChapter
