/* eslint-disable jsx-a11y/anchor-is-valid */
import { Link, useLocation } from 'react-router-dom'
import './Sidebar.scss'
import 'boxicons/css/boxicons.min.css'

function Sidebar ({ active }) {
  const location = useLocation()

  const mainMenu = [
    {
      to: '/dashboard',
      icon: 'bxs-dashboard',
      text: 'Dashboard',
      id: ''
    },
    {
      to: '/user',
      icon: 'bxs-user',
      text: 'User Management',
      id: 'userManagerLink'
    },
    {
      to: '/category',
      icon: 'bxs-category',
      text: 'Category Manager',
      id: 'categoryManagerLink'
    },
    {
      to: '#mangaManagerLink',
      icon: 'bxs-book-bookmark',
      text: 'Manga Manager',
      id: 'mangaManagerLink'
    },
    {
      to: '#chapterManagerLink',
      icon: 'bxs-file',
      text: 'Chapter Manager',
      id: 'chapterManagerLink'
    },
    {
      to: '#baivietManagerLink',
      icon: 'bxs-receipt',
      text: 'Baiviet Manager',
      id: 'baivietManagerLink'
    },
    {
      to: '',
      icon: 'bxs-dollar-circle',
      text: 'Revenue Management',
      id: 'revenueManagerLink'
    }
  ]

  const bottomMenu = [
    {
      to: '#',
      icon: 'bxs-cog',
      text: 'Settings',
      id: 'setting'
    },
    {
      to: '/logout',
      icon: 'bxs-log-out-circle',
      text: 'Logout',
      className: 'logout'
    }
  ]

  return (
    <section id='sidebar' className={active ? 'hide' : ''}>
      <Link to='' className='brand'>
        <i className='bx bxs-smile'></i>
        <span className='text'>AdminMangaLand</span>
      </Link>

      <ul className='side-menu top'>
        {mainMenu.map((item, index) => (
          <li
            key={index}
            className={location.pathname === item.to ? 'active' : ''}
          >
            <Link to={item.to} id={item.id}>
              <i className={`bx ${item.icon}`}></i>
              <span className='text'>{item.text}</span>
            </Link>
          </li>
        ))}
      </ul>

      <ul className='side-menu'>
        {bottomMenu.map((item, index) => (
          <li key={index}>
            <Link to={item.to} id={item.id} className={item.className || ''}>
              <i className={`bx ${item.icon}`}></i>
              <span className='text'>{item.text}</span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  )
}

export default Sidebar
