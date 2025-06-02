import { useEffect, useState } from 'react'
import { Table, Button, Space, message, Popconfirm } from 'antd'
import {
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  DollarOutlined
} from '@ant-design/icons'
import { getApiUrl } from '../../api/api'
import { AddUser } from './AddUser'
import { AddCoin } from './AddCoin'
import { EditUser } from './EditUser'

function UserLayout () {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [showAddModalAdd, setShowAddModalAdd] = useState(false)
  const [showAddModalCoin, setShowAddModalCoin] = useState(false)
  const [showAddModalEdit, setShowAddModalEdit] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)

  const pageSize = 10

  const fetchUsers = async (page = 1) => {
    setLoading(true)
    try {
      const res = await fetch(
        `${getApiUrl('backend')}/usernewwweb?page=${page}&limit=${pageSize}`
      )
      const data = await res.json()
      if (res.ok) {
        setUsers(data.users)
        setTotal(data.totalUsers)
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
    fetchUsers(currentPage)
  }, [currentPage])

  const handleEdit = user => {
    setSelectedUser(user)
    setShowAddModalEdit(true)
  }

  const handleDelete = async userid => {
    try {
      const response = await fetch(
        `${getApiUrl('backend')}/userdelete/${userid}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          }
        }
      )
      if (response.ok) {
        message.success('xóa thành công')
        fetchUsers()
      }
    } catch (error) {
      console.log(error)
    }
  }

  const handleTopUp = user => {
    setSelectedUser(user)
    setShowAddModalCoin(true)
  }

  const columns = [
    {
      title: 'Tên',
      dataIndex: 'username',
      key: 'username'
    },
    {
      title: 'Số điện thoại',
      dataIndex: 'phone',
      key: 'phone'
    },
    {
      title: 'Vai trò',
      dataIndex: 'role',
      key: 'role'
    },
    {
      title: 'Coin',
      dataIndex: 'coin',
      key: 'coin'
    },
    {
      title: 'Hành động',
      key: 'actions',
      align: 'center',
      render: (_, record) => (
        <Space>
          <Button
            icon={<DollarOutlined />}
            onClick={() => handleTopUp(record)}
          />
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
      <h2>Quản lý người dùng</h2>
      <Button
        type='primary'
        icon={<PlusOutlined />}
        style={{ marginBottom: 10, marginTop: 10 }}
        onClick={() => setShowAddModalAdd(true)}
      >
        Thêm người dùng
      </Button>

      <Table
        rowKey='_id'
        columns={columns}
        dataSource={users}
        loading={loading}
        pagination={{
          current: currentPage,
          total,
          pageSize,
          onChange: page => setCurrentPage(page)
        }}
      />

      <AddUser
        visible={showAddModalAdd}
        onClose={() => setShowAddModalAdd(false)}
        onSuccess={() => fetchUsers(currentPage)}
      />

      <AddCoin
        visible={showAddModalCoin}
        onCancel={() => setShowAddModalCoin(false)}
        userId={selectedUser?._id}
        onSuccess={() => fetchUsers(currentPage)}
        setSelectedUser={setSelectedUser}
      />

      <EditUser
        visible={showAddModalEdit}
        onCancel={() => setShowAddModalEdit(false)}
        userData={selectedUser}
        onSuccess={() => fetchUsers(currentPage)}
      />
    </div>
  )
}

export default UserLayout
