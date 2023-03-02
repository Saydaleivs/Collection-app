import * as React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { MainPage } from './Pages/MainPage/MainPage'
import { AdminArea } from './Pages/AdminArea/AdminArea'
import { MyCollections } from './Pages/MyCollections/MyCollections'
import { EditOrCreate } from './Pages/EditOrCreate/EditOrCreate'
import { SingleCollection } from './Pages/SingleCollection/SingleCollection'
import { CreateOrEditItem } from './Components/CreateItem/CreateOrEditItem'
import { ThemeProvider } from '@emotion/react'
import { createTheme } from '@mui/material'
import SignInSide from './Pages/SignInPage/SignInPage'
import SignUpPage from './Pages/SignUpPage/SignUpPage'
import TheNavbar from './Components/Navbar/TheNavbar'
import Item from './Components/Item/Item'
import './App.css'

function App() {
  const [token, setToken] = React.useState(localStorage.getItem('token'))
  const [theme, setTheme] = React.useState(
    localStorage.getItem('theme') || 'light'
  )

  const themes = createTheme({
    palette: {
      mode: theme === 'light' ? 'light' : 'dark',
    },
  })

  React.useEffect(() => {
    setTheme(localStorage.getItem('theme'))
    if (!localStorage.getItem('theme')) {
      localStorage.setItem('theme', 'light')
    }
  }, [])

  return (
    <>
      <ThemeProvider theme={themes}>
        <BrowserRouter>
          <TheNavbar selectedTheme={theme} setTheme={setTheme} token={token} />

          <Routes>
            <Route path='/' element={<MainPage />} />
            <Route path='/adminarea' element={<AdminArea />} />
            <Route path='/collections' element={<MyCollections />} />
            <Route path='/collection/:id' element={<SingleCollection />} />
            <Route path='/edit/:id' element={<EditOrCreate />} />
            <Route
              path='/create/collection'
              element={<EditOrCreate isForCreating={true} />}
            />
            <Route path='/item/:id' element={<Item />} />
            <Route
              path='/item/:id/comment'
              element={<Item isCommentSearch={true} />}
            />
            <Route path='/tag/:id' element={<Item isForTags={true} />} />
            <Route
              path='/create/item/:id'
              element={<CreateOrEditItem isForEditing={false} />}
            />
            <Route
              path='/editItem/:id'
              element={<CreateOrEditItem isForEditing={true} />}
            />
            <Route
              path='/signin'
              element={<SignInSide setToken={setToken} />}
            />
            <Route
              path='/signup'
              element={<SignUpPage setToken={setToken} />}
            />
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </>
  )
}

export default App
