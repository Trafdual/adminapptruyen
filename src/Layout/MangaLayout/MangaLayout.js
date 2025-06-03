import { useEffect, useState } from 'react'
import {
  Table,
  Button,
  Space,
  message,
  Popconfirm,
  Avatar,
  Tooltip
} from 'antd'
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons'
import { getApiUrl } from '../../api/api'
import { AddManga } from './AddManga'
import { EditManga } from './EditManga'

function MangaLayout () {
  const [manga, setmanga] = useState([])
  const [loading, setLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [showAddModalAdd, setShowAddModalAdd] = useState(false)
  const [showAddModalEdit, setShowAddModalEdit] = useState(false)
  const [selectedmanga, setSelectedmanga] = useState(null)
  const userId = '653a20c611295a22062661f9'

  const pageSize = 10

  const fetchmanga = async (page = 1) => {
    setLoading(true)
    try {
      const res = await fetch(
        `${getApiUrl('backend')}/mangasnew?page=${page}&limit=${pageSize}`
      )
      const data = await res.json()
      if (res.ok) {
        setmanga(data.manga)
        setTotal(data.totalmanga)
        setCurrentPage(data.currentPage)
      } else {
        message.error('Không thể lấy danh sách người dùng')
      }
    } catch (err) {
      console.error(err)
      message.error('Lỗi kết nối server')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchmanga(currentPage)
  }, [currentPage])

  const handleEdit = manga => {
    setSelectedmanga(manga)
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
        message.success('xóa thành công')
        fetchmanga()
      }
    } catch (error) {
      console.log(error)
    }
  }

  const columns = [
    {
      title: 'Image',
      dataIndex: 'image',
      key: 'image',
      render: (_, record) => (
        <Avatar
          src={record.image || 'https://via.placeholder.com/40x40.png?text=M'}
          alt='Manga'
          shape='square'
          size={40}
        />
      )
    },
    {
      title: 'Tên',
      dataIndex: 'manganame',
      key: 'manganame'
    },
    {
      title: 'Tác giả',
      dataIndex: 'author',
      key: 'author'
    },
    {
      title: 'Nội dung',
      dataIndex: 'content',
      key: 'content',
      ellipsis: true,
      render: text => (
        <Tooltip title={text}>
          <div
            style={{
              maxWidth: 300,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap'
            }}
          >
            {text}
          </div>
        </Tooltip>
      )
    },
    {
      title: 'Thể loại',
      dataIndex: 'category',
      key: 'category'
    },
    {
      title: 'Lượt xem',
      dataIndex: 'view',
      key: 'view'
    },
    {
      title: 'Lượt thích',
      dataIndex: 'like',
      key: 'like'
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
      <h2>Quản lý truyện</h2>
      <Button
        type='primary'
        icon={<PlusOutlined />}
        style={{ marginBottom: 10, marginTop: 10 }}
        onClick={() => setShowAddModalAdd(true)}
      >
        Thêm truyện
      </Button>

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

      <AddManga
        visible={showAddModalAdd}
        onClose={() => setShowAddModalAdd(false)}
        onSuccess={() => fetchmanga(currentPage)}
        userId={userId}
      />

      <EditManga
        visible={showAddModalEdit}
        onClose={() => setShowAddModalEdit(false)}
        manga={selectedmanga}
        onSuccess={() => fetchmanga(currentPage)}
        userid={userId}
      />
    </div>
  )
}

export default MangaLayout
