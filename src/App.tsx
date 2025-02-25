// import './App.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import ListLog from './pages/ListLog'
import { ConfigProvider } from 'antd'

function App() {
  const routers = createBrowserRouter([
    {
      path: "/",
      element: <ListLog />
    }
  ])

  return (
    <ConfigProvider>
      <RouterProvider router={routers} />
    </ConfigProvider>
  )
}

export default App
