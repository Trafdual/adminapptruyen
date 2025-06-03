import { Header } from './Header'
import { Sidebar } from './Sidebar'
import { useState } from 'react'
function DefaultLayout ({ children }) {
  const [active, setactive] = useState(false)
  return (
    <div>
      <Header active={active} setactive={setactive} />
      <Sidebar active={active} />
      <div id='contentgd' className={active ? 'hide' : ''}>
      {children}
      </div>
    </div>
  )
}

export default DefaultLayout
