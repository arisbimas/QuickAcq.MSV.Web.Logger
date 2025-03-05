// import './App.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
// import ListLog from './pages/ListLog'
import { ConfigProvider } from 'antd'
import ListLogV2 from './pages/ListLogV2'

function App() {
  const routers = createBrowserRouter([
    {
      path: "/",
      element: <ListLogV2 />
    }
  ])

  return (
    <ConfigProvider>
      <RouterProvider router={routers} />
    </ConfigProvider>
  )
}

export default App
