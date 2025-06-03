import { Modal, Form, Input, Select, message } from 'antd'
import { useEffect, useState } from 'react'
import { getApiUrl } from '../../../api/api'
const { Option } = Select

function EditChapter ({ visible, onClose, chapter, onSuccess, userid }) {
  const [form] = Form.useForm()
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

  useEffect(() => {
    if (visible && chapter) {
      form.setFieldsValue({
        mangaName: chapter.mangaName,
        number: chapter.number,
        viporfree: chapter.viporfree,
        images: Array.isArray(chapter.images)
          ? chapter.images.join('\n')
          : chapter.images
      })
    }
  }, [visible, chapter, form])

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields()

      const res = await fetch(
        `${getApiUrl('backend')}/chapterputnew/${chapter._id}/${userid}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(values)
        }
      )

      const data = await res.json()
      if (res.ok) {
        message.success(data.message || 'Sửa chapter thành công')
        form.resetFields()
        onSuccess()
        onClose()
      } else {
        message.error(data.message || 'Sửa chapter thất bại')
      }
    } catch (error) {
      console.error('Lỗi khi cập nhật:', error)
      message.error('Đã có lỗi xảy ra khi sửa chapter')
    }
  }

  return (
    <Modal
      open={visible}
      title='Sửa Chapter'
      onCancel={onClose}
      onOk={handleSubmit}
      okText='Lưu'
      cancelText='Hủy'
    >
      <Form form={form} layout='vertical'>
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
          <Input placeholder='Ví dụ: 12' />
        </Form.Item>
        <Form.Item
          name='viporfree'
          label='Loại truy cập'
          rules={[{ required: true, message: 'Chọn loại truy cập' }]}
        >
          <Select placeholder='Chọn loại'>
            <Option value='free'>Miễn phí</Option>
            <Option value='vip'>Trả phí</Option>
          </Select>
        </Form.Item>
        <Form.Item
          name='images'
          label='Danh sách ảnh'
          rules={[{ required: true, message: 'Nhập ảnh cho chapter' }]}
        >
          <Input.TextArea
            rows={6}
            placeholder='http://linkanh1.jpg&#10;http://linkanh2.jpg'
          />
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default EditChapter
