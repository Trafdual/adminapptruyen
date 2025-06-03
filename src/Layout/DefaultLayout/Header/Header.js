/* eslint-disable jsx-a11y/anchor-is-valid */
import './Header.scss'
import { getApiUrl } from '../../../api/api'
import { useState, useEffect } from 'react'
function Header ({ active, setactive }) {
  const [count, setcount] = useState(0)

  const fetchdata = async () => {
    try {
      const response = await fetch(`${getApiUrl('backend')}/unread-count`)
      const data = await response.json()
      if (response.ok) {
        setcount(data.unreadCount)
      }
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    fetchdata()
  }, [])
  return (
    <section id='contentgd' className={active ? 'hide' : ''}>
      <nav>
        <i className='bx bx-menu' onClick={() => setactive(!active)}></i>
        <a href='#' className='nav-link'>
          Manager
        </a>
        <form action=''>
          <div className='form-input'>
            <input type='search' placeholder='Search...' />
            <button type='submit' className='search-btn'>
              <i className='bx bx-search'></i>
            </button>
          </div>
        </form>
        <input type='checkbox' id='switch-mode' hidden />
        <label htmlFor='switch-mode' className='switch-mode'></label>
        <a href='#' id='notification' className='notification'>
          <i className='bx bxs-bell'></i>
          <span className='num'>{count}</span>
        </a>
        <a href='#' className='profile'>
          {/* <img src={`data:image/jpeg;base64,${user.avatar}`} alt='User Avatar' /> */}
        </a>
      </nav>
    </section>
  )
}

export default Header
