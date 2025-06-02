import { useState, useEffect } from 'react'
import { Table, Card, Breadcrumb, Typography, Avatar } from 'antd'
import { HomeOutlined } from '@ant-design/icons'
import './DashBoardLayout.scss'
import { getApiUrl } from '../../api/api'

const { Title } = Typography

function DashBoardLayout () {
  const [data, setData] = useState([])

  const fetchdata = async () => {
    try {
      const response = await fetch(`${getApiUrl('backend')}/top5manga`)
      const data = await response.json()
      if (response.ok) {
        setData(data)
      }
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    fetchdata()
  }, [])

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
      title: 'Manganame',
      dataIndex: 'manganame',
      key: 'manganame',
      render: text => <strong>{text}</strong>
    },
    {
      title: 'Author',
      dataIndex: 'author',
      key: 'author'
    },
    {
      title: 'View',
      dataIndex: 'view',
      key: 'view'
    }
  ]

  return (
    <div className='dashboard_container'>
      <Breadcrumb
        style={{ marginBottom: 16 }}
        items={[
          {
            title: 'Dashboard'
          },
          {
            title: (
              <>
                <HomeOutlined />
                <span style={{ marginLeft: 4 }}>Home</span>
              </>
            )
          }
        ]}
      />

      <Card className='dashboard_card'>
        <Title level={4}>Top 5 truyện nhiều lượt xem nhất</Title>
        <Table
          dataSource={data}
          columns={columns}
          pagination={false}
          rowKey={record => record._id || record.manganame} // đảm bảo có key duy nhất
        />
      </Card>
    </div>
  )
}

export default DashBoardLayout
