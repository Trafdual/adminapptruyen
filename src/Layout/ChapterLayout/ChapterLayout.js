/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react'
import {
  Table,
  Button,
  Space,
  message,
  Popconfirm,
  Input,
  Row,
  Col
} from 'antd'
import {
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  SearchOutlined
} from '@ant-design/icons'
import { getApiUrl } from '../../api/api'
import { AddChapter } from './AddChapter'
import { EditChapter } from './EditChapter'

function ChapterLayout () {
  const [manga, setManga] = useState([])
  const [loading, setLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [searchText, setSearchText] = useState('')
  const [showAddModalAdd, setShowAddModalAdd] = useState(false)
  const [showAddModalEdit, setShowAddModalEdit] = useState(false)
  const [selectedManga, setSelectedManga] = useState(null)

  const userId = '653a20c611295a22062661f9'
  const pageSize = 10

  const fetchManga = async (page = 1, search = '') => {
    setLoading(true)
    try {
      const api = search.trim()
        ? `${getApiUrl(
            'backend'
          )}/searchchap/${userId}?page=${page}&limit=${pageSize}&search=${encodeURIComponent(
            search
          )}`
        : `${getApiUrl(
            'backend'
          )}/getchapnew/${userId}?page=${page}&limit=${pageSize}`

      const res = await fetch(api)
      const data = await res.json()
      if (res.ok) {
        setManga(data.data)
        setTotal(data.totalPages * pageSize)
        setCurrentPage(data.currentPage)
      } else {
        message.error('Không thể lấy danh sách chapter')
      }
    } catch (err) {
      console.error(err)
      message.error('Lỗi kết nối server')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchManga(currentPage, searchText)
  }, [currentPage])

  const handleEdit = record => {
    setSelectedManga(record)
    setShowAddModalEdit(true)
  }

  const handleDelete = async mangaid => {
    try {
      const response = await fetch(
        `${getApiUrl('backend')}/mangadeletenew/${mangaid}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          }
        }
      )
      if (response.ok) {
        message.success('Xóa thành công')
        fetchManga(currentPage, searchText)
      }
    } catch (error) {
      console.log(error)
    }
  }

  const handleSearch = () => {
    setCurrentPage(1)
    fetchManga(1, searchText)
  }

  const columns = [
    {
      title: 'Tên truyện',
      dataIndex: 'mangaName',
      key: 'mangaName'
    },
    {
      title: 'Chap',
      dataIndex: 'number',
      key: 'number'
    },
    {
      title: 'Trạng thái',
      dataIndex: 'viporfree',
      key: 'viporfree'
    },
    {
      title: 'Giá',
      dataIndex: 'price',
      key: 'price'
    },
    {
      title: 'Hành động',
      key: 'actions',
      align: 'center',
      render: (_, record) => (
        <Space>
          <Button icon={<EditOutlined />} onClick={() => handleEdit(record)} />
          <Popconfirm
            title='Bạn có chắc muốn xóa?'
            onConfirm={() => handleDelete(record._id)}
            okText='Xóa'
            cancelText='Hủy'
          >
            <Button danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      )
    }
  ]

  return (
    <div style={{ padding: 24 }}>
      <h2>Quản lý chương</h2>
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col flex='auto'>
          <Input
            placeholder='Tìm theo tên truyện...'
            value={searchText}
            onChange={e => setSearchText(e.target.value)}
            onPressEnter={handleSearch}
            allowClear
          />
        </Col>
        <Col>
          <Button
            type='primary'
            icon={<SearchOutlined />}
            onClick={handleSearch}
          >
            Tìm kiếm
          </Button>
        </Col>
        <Col>
          <Button
            type='primary'
            icon={<PlusOutlined />}
            onClick={() => setShowAddModalAdd(true)}
          >
            Thêm chương
          </Button>
        </Col>
      </Row>
      <Table
        rowKey='_id'
        columns={columns}
        dataSource={manga}
        loading={loading}
        pagination={{
          current: currentPage,
          total,
          pageSize,
          onChange: page => setCurrentPage(page)
        }}
      />
      <AddChapter
        visible={showAddModalAdd}
        onClose={() => setShowAddModalAdd(false)}
        onSuccess={() => fetchManga(currentPage)}
        userId={userId}
      />
      
      <EditChapter
        visible={showAddModalEdit}
        onClose={() => setShowAddModalEdit(false)}
        chapter={selectedManga}
        onSuccess={() => fetchManga(currentPage)}
        userid={userId}
      />
    </div>
  )
}

export default ChapterLayout
