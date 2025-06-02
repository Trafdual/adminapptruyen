import { Route, Routes, BrowserRouter as Router } from 'react-router-dom'
import { publicRoutes } from './router'
import { DefaultLayout } from './Layout/DefaultLayout'
function App () {
  return (
    <Router>
      <div className='App'>
        <Routes>
          {publicRoutes.map((route, index) => {
            let Layout = DefaultLayout

            const Page = route.component

            return (
              <Route
                key={index}
                path={route.path}
                element={
                  <Layout>
                    <Page />
                  </Layout>
                }
              />
            )
          })}
        </Routes>
      </div>
    </Router>
  )
}

export default App
