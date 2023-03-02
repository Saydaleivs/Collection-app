import * as React from 'react'
import { styled, useTheme } from '@mui/material/styles'
import Box from '@mui/material/Box'
import Drawer from '@mui/material/Drawer'
import CssBaseline from '@mui/material/CssBaseline'
import MuiAppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import List from '@mui/material/List'
import Divider from '@mui/material/Divider'
import IconButton from '@mui/material/IconButton'
import MenuIcon from '@mui/icons-material/Menu'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import ListItemButton from '@mui/material/ListItemButton'
import AdminPanelSettingsRoundedIcon from '@mui/icons-material/AdminPanelSettingsRounded'
import LogoutIcon from '@mui/icons-material/Logout'
import LoginIcon from '@mui/icons-material/Login'
import HomeIcon from '@mui/icons-material/Home'
import CollectionsIcon from '@mui/icons-material/Collections'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import SearchIcon from '@mui/icons-material/Search'
import { useTranslation } from 'react-i18next'
import {
  alpha,
  Avatar,
  Button,
  CircularProgress,
  FormControl,
  FormControlLabel,
  Grid,
  InputBase,
  InputLabel,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListSubheader,
  MenuItem,
  Modal,
  Select,
  Switch,
  Typography,
} from '@mui/material'

const drawerWidth = 240

const Demo = styled('div')(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
}))

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(1),
    width: 'auto',
  },
}))

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}))

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      width: '12ch',
      '&:focus': {
        width: '20ch',
      },
    },
  },
}))

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  transition: theme.transitions.create(['margin', 'width'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: `${drawerWidth}px`,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}))

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: 'flex-end',
}))

const MaterialUISwitch = styled(Switch)(({ theme }) => ({
  width: 62,
  height: 34,
  padding: 7,
  '& .MuiSwitch-switchBase': {
    margin: 1,
    padding: 0,
    transform: 'translateX(6px)',
    '&.Mui-checked': {
      color: '#fff',
      transform: 'translateX(22px)',
      '& .MuiSwitch-thumb:before': {
        backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 20 20"><path fill="${encodeURIComponent(
          '#fff'
        )}" d="M4.2 2.5l-.7 1.8-1.8.7 1.8.7.7 1.8.6-1.8L6.7 5l-1.9-.7-.6-1.8zm15 8.3a6.7 6.7 0 11-6.6-6.6 5.8 5.8 0 006.6 6.6z"/></svg>')`,
      },
      '& + .MuiSwitch-track': {
        opacity: 1,
        backgroundColor: theme.palette.mode === 'dark' ? '#8796A5' : '#aab4be',
      },
    },
  },
  '& .MuiSwitch-thumb': {
    backgroundColor: theme.palette.mode === 'dark' ? '#003892' : '#001e3c',
    width: 32,
    height: 32,
    '&:before': {
      content: "''",
      position: 'absolute',
      width: '100%',
      height: '100%',
      left: 0,
      top: 0,
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center',
      backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 20 20"><path fill="${encodeURIComponent(
        '#fff'
      )}" d="M9.305 1.667V3.75h1.389V1.667h-1.39zm-4.707 1.95l-.982.982L5.09 6.072l.982-.982-1.473-1.473zm10.802 0L13.927 5.09l.982.982 1.473-1.473-.982-.982zM10 5.139a4.872 4.872 0 00-4.862 4.86A4.872 4.872 0 0010 14.862 4.872 4.872 0 0014.86 10 4.872 4.872 0 0010 5.139zm0 1.389A3.462 3.462 0 0113.471 10a3.462 3.462 0 01-3.473 3.472A3.462 3.462 0 016.527 10 3.462 3.462 0 0110 6.528zM1.665 9.305v1.39h2.083v-1.39H1.666zm14.583 0v1.39h2.084v-1.39h-2.084zM5.09 13.928L3.616 15.4l.982.982 1.473-1.473-.982-.982zm9.82 0l-.982.982 1.473 1.473.982-.982-1.473-1.473zM9.305 16.25v2.083h1.389V16.25h-1.39z"/></svg>')`,
    },
  },
  '& .MuiSwitch-track': {
    opacity: 1,
    backgroundColor: theme.palette.mode === 'dark' ? '#8796A5' : '#aab4be',
    borderRadius: 20 / 2,
  },
}))

export default function TheNavbar({ selectedTheme, setTheme, token }) {
  const navigate = useNavigate()
  const theme = useTheme()
  const [open, setOpen] = React.useState(false)
  const [searchResults, setSearchResults] = React.useState(false)
  const [user, setUser] = React.useState()
  const [isAuth, setIsAuth] = React.useState(false)
  const [searchText, setSearchText] = React.useState('')
  const [searches, setSearches] = React.useState()
  const [language, setLanguage] = React.useState(
    localStorage.getItem('language') ? localStorage.getItem('language') : 'en'
  )

  const { t, i18n } = useTranslation()

  const handleDrawerOpen = () => {
    setOpen(true)
  }

  const handleDrawerClose = () => {
    setOpen(false)
  }

  const search = () => {
    axios({
      method: 'GET',
      url: 'https://course-project-server.onrender.com/api/search',
      params: { q: searchText },
    })
      .then((res) => {
        setSearches(res.data)
      })
      .catch((err) => setSearches(err.response.data))
  }

  React.useEffect(() => {
    axios({
      method: 'GET',
      headers: { token: localStorage.getItem('token') },
      url: 'https://course-project-server.onrender.com/api/me',
    })
      .then((res) => {
        setUser(res.data)
        setIsAuth(true)
      })
      .catch((err) => {
        if (err.response.status === 401) {
          setIsAuth(false)
        }
      })
  }, [token])

  React.useEffect(() => {
    i18n.changeLanguage(language)
  }, [language])

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar position='fixed' style={{ display: 'flex' }} open={open}>
        <Toolbar style={{ justifyContent: 'space-between' }}>
          <IconButton
            color='inherit'
            aria-label='open drawer'
            onClick={handleDrawerOpen}
            edge='start'
            sx={{ mr: 2, ...(open && { display: 'none' }) }}
          >
            <MenuIcon />
          </IconButton>

          <div style={{ display: 'flex' }}>
            <Search>
              <SearchIconWrapper>
                <SearchIcon />
              </SearchIconWrapper>
              <StyledInputBase
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                placeholder={`${t('search')}....`}
                inputProps={{ 'aria-label': 'search' }}
              />
            </Search>
            <Button
              variant='contained'
              style={{ marginBottom: 2, padding: '7px 14px' }}
              onClick={() => {
                search()
                setSearchResults(true)
              }}
            >
              {t('searching')}
            </Button>
          </div>
        </Toolbar>
      </AppBar>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
        style={{ display: !open && 'none' }}
        variant='persistent'
        anchor='left'
        open={open}
      >
        <DrawerHeader>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === 'ltr' ? (
              <ChevronLeftIcon />
            ) : (
              <ChevronRightIcon />
            )}
          </IconButton>
        </DrawerHeader>
        <Divider />
        <List>
          <ListItemButton onClick={() => navigate('/')}>
            <HomeIcon />
            <h4 className='nav_link'>{t('home')}</h4>
          </ListItemButton>

          {isAuth && (
            <ListItemButton onClick={() => navigate('/collections')}>
              <CollectionsIcon />
              <h4 className='nav_link'>{t('my collections')}</h4>
            </ListItemButton>
          )}
          {user && user.isAdmin && (
            <ListItemButton onClick={() => navigate('/adminarea')}>
              <AdminPanelSettingsRoundedIcon />
              <h4 className='nav_link'>{t('admin panel')}</h4>
            </ListItemButton>
          )}
        </List>
        <Divider />
        <List>
          <ListItemButton onClick={() => navigate('/signin')}>
            <LoginIcon />
            <h4 className='nav_link'>{t('sign in')}</h4>
          </ListItemButton>
          <ListItemButton onClick={() => navigate('/signup')}>
            <LogoutIcon />
            <h4 className='nav_link'>{t('sign up')}</h4>
          </ListItemButton>
        </List>

        <Modal
          open={searchResults}
          onClose={() => {
            setSearchText('')
            setSearches()
            setSearchResults(false)
          }}
          aria-labelledby='parent-modal-title'
          aria-describedby='parent-modal-description'
        >
          <Box
            sx={{
              width: '85%',
              height: '100vh',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              margin: 'auto',
              maxWidth: 500,
            }}
          >
            <h4
              onClick={() => {
                setSearchText('')
                setSearches()
                setSearchResults(false)
              }}
              style={{
                position: 'absolute',
                top: 20,
                right: 20,
                fontSize: 30,
                cursor: 'pointer',
                color: '#fff',
              }}
            >
              x
            </h4>
            <div>
              {typeof searches === 'object' ? (
                <div>
                  <Grid item xs={12} md={6}>
                    <Demo>
                      <List sx={{ mb: 2, width: 500 }}>
                        {searches.items.length !== 0 && (
                          <>
                            <ListSubheader
                              sx={{
                                bgcolor: 'background.paper',
                                width: '0%',
                              }}
                            >
                              Items
                            </ListSubheader>
                            {searches.items?.map((i, index) => (
                              <React.Fragment key={index}>
                                <ListItem
                                  button
                                  onClick={() => {
                                    setSearchResults(false)
                                    navigate(`item/${i._id}`)
                                  }}
                                >
                                  <ListItemAvatar>
                                    <Avatar alt={i.name} />
                                  </ListItemAvatar>
                                  <ListItemText
                                    primary={i.name}
                                    secondary={`tags: ` + i.tags.map((i) => i)}
                                  />
                                </ListItem>
                              </React.Fragment>
                            ))}
                          </>
                        )}

                        {searches.collections.length !== 0 && (
                          <>
                            <ListSubheader
                              sx={{ bgcolor: 'background.paper', width: '0%' }}
                            >
                              Collections
                            </ListSubheader>
                            {searches.collections?.map((i, index) => (
                              <React.Fragment key={index}>
                                <ListItem
                                  button
                                  onClick={() => {
                                    setSearchResults(false)
                                    navigate(`collection/${i._id}`)
                                  }}
                                >
                                  <ListItemAvatar>
                                    <Avatar alt={i.name} src={i.image} />
                                  </ListItemAvatar>
                                  <ListItemText
                                    primary={i.name}
                                    secondary={i.topic}
                                  />
                                </ListItem>
                              </React.Fragment>
                            ))}
                          </>
                        )}
                        {searches.comments.length !== 0 && (
                          <>
                            <ListSubheader
                              sx={{ bgcolor: 'background.paper', width: '0%' }}
                            >
                              Comments
                            </ListSubheader>
                            {searches.comments?.map((i, index) => (
                              <React.Fragment key={index}>
                                <ListItem
                                  button
                                  onClick={() => {
                                    setSearchResults(false)
                                    navigate(`item/${i.itemId}/comment`)
                                  }}
                                >
                                  <ListItemText
                                    primary={i.comment}
                                    secondary={`by ${i.owner}`}
                                  />
                                </ListItem>
                              </React.Fragment>
                            ))}
                          </>
                        )}
                      </List>
                    </Demo>
                  </Grid>
                </div>
              ) : (
                <>
                  {searches === 'no results found' ? (
                    <Typography style={{ textAlign: 'center' }}>
                      {t('no results')}
                    </Typography>
                  ) : (
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        height: '70vh',
                      }}
                    >
                      <CircularProgress />
                    </Box>
                  )}
                </>
              )}
            </div>
          </Box>
        </Modal>

        <Divider />
        <FormControl size='small' sx={{ m: 1, minWidth: 120, marginTop: 2 }}>
          <InputLabel id='demo-select-small'>{t('language')}</InputLabel>
          <Select
            labelId='demo-select-small'
            id='demo-select-small'
            label='Language'
            value={language}
            onChange={(e) => {
              setLanguage(e.target.value)
              localStorage.setItem('language', e.target.value)
            }}
          >
            <MenuItem value='en'>EN</MenuItem>
            <MenuItem value='uz'>UZ</MenuItem>
          </Select>
        </FormControl>

        <FormControlLabel
          style={{ justifyContent: 'center' }}
          label='Theme'
          control={
            <MaterialUISwitch
              sx={{ m: 1 }}
              checked={localStorage.getItem('theme') === 'dark' ? true : false}
              onChange={() => {
                setTheme(selectedTheme === 'light' ? 'dark' : 'light')
                localStorage.setItem(
                  'theme',
                  selectedTheme === 'light' ? 'dark' : 'light'
                )
              }}
            />
          }
        />
      </Drawer>
    </Box>
  )
}
