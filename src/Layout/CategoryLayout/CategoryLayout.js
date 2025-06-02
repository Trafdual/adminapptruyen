import { useEffect, useState } from 'react'
import { Table, Button, Space, message, Popconfirm } from 'antd'
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons'
import { getApiUrl } from '../../api/api'
import { AddCategory } from './AddCategory'

function CategoryLayout () {
  const [category, setcategory] = useState([])
  const [loading, setLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [showAddModalAdd, setShowAddModalAdd] = useState(false)
  const [showAddModalCoin, setShowAddModalCoin] = useState(false)
  const [showAddModalEdit, setShowAddModalEdit] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)

  const pageSize = 10

  const fetchcategory = async (page = 1) => {
    setLoading(true)
    try {
      const res = await fetch(
        `${getApiUrl('backend')}/categorynewweb?page=${page}&limit=${pageSize}`
      )
      const data = await res.json()
      if (res.ok) {
        setcategory(data.category)
        setTotal(data.totalcategory)
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
    fetchcategory(currentPage)
  }, [currentPage])

  const handleEdit = user => {
    setSelectedUser(user)
    setShowAddModalEdit(true)
  }

  const handleDelete = async userid => {
    try {
      const response = await fetch(
        `${getApiUrl('backend')}/categorydeletenew/${userid}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          }
        }
      )
      if (response.ok) {
        message.success('xóa thành công')
        fetchcategory()
      }
    } catch (error) {
      console.log(error)
    }
  }

  const columns = [
    {
      title: 'Tên',
      dataIndex: 'categoryname',
      key: 'categoryname'
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
      <h2>Quản lý thể loại</h2>
      <Button
        type='primary'
        icon={<PlusOutlined />}
        style={{ marginBottom: 10, marginTop: 10 }}
        onClick={() => setShowAddModalAdd(true)}
      >
        Thêm thể loại
      </Button>

      <Table
        rowKey='_id'
        columns={columns}
        dataSource={category}
        loading={loading}
        pagination={{
          current: currentPage,
          total,
          pageSize,
          onChange: page => setCurrentPage(page)
        }}
      />

      <AddCategory
        visible={showAddModalAdd}
        onClose={() => setShowAddModalAdd(false)}
        onSuccess={() => fetchcategory(currentPage)}
      />

      {/* <AddCoin
        visible={showAddModalCoin}
        onCancel={() => setShowAddModalCoin(false)}
        userId={selectedUser?._id}
        onSuccess={() => fetchcategory(currentPage)}
        setSelectedUser={setSelectedUser}
      />

      <EditUser
        visible={showAddModalEdit}
        onCancel={() => setShowAddModalEdit(false)}
        userData={selectedUser}
        onSuccess={() => fetchcategory(currentPage)}
      /> */}
    </div>
  )
}

export default CategoryLayout
