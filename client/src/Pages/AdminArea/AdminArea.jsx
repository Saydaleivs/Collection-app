import axios from 'axios'
import * as React from 'react'
import Table from '../../Components/Table/Table'
import { Alert, Box, IconButton, Tab, Tabs } from '@mui/material'
import { useTranslation } from 'react-i18next'

function TabPanel(props) {
  const { children, value, index, ...other } = props

  return (
    <div
      role='tabpanel'
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      style={{ justifyContent: 'center' }}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <div>{children}</div>
        </Box>
      )}
    </div>
  )
}

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  }
}

export const AdminArea = () => {
  const [users, setUsers] = React.useState([])
  const [error, setError] = React.useState()
  const [isManaged, setIsManaged] = React.useState(false)
  const [usersHeadCells, setUsersHeadCells] = React.useState([])
  const [collectionHeadCells, setCollectionHeadCells] = React.useState([])
  const [itemHeadCells, setItemHeadCells] = React.useState([])
  const [collections, setCollections] = React.useState()
  const [selectedCollection, setSelectedCollection] = React.useState()
  const [isEmpty, setIsEmpty] = React.useState(false)
  const [items, setItems] = React.useState([])
  const [value, setValue] = React.useState(0)
  const [errorMessage, setErrorMessage] = React.useState()

  const { t } = useTranslation()

  const handleChange = (event, newValue) => {
    setValue(newValue)
  }

  React.useEffect(() => {
    axios({
      method: 'GET',
      headers: { token: localStorage.getItem('token') },
      url: 'https://course-project-server.onrender.com/api/users',
    })
      .then((res) => {
        setUsers(res.data)
        setUsersHeadCells([...new Set([...Object.keys(res.data[0])])])
      })
      .catch((err) => setError(err.response))
  }, [isManaged])

  React.useEffect(() => {
    axios({
      method: 'GET',
      url: 'https://course-project-server.onrender.com/api/collection/forAdmins',
      headers: { token: localStorage.getItem('token') },
    }).then((res) => {
      setCollections(res.data)
      setCollectionHeadCells([...new Set([...Object.keys(res.data[0])])])
    })
  }, [isManaged])

  const loadItems = () => {
    if (selectedCollection)
      axios({
        method: 'GET',
        headers: { token: localStorage.getItem('token') },
        url: `https://course-project-server.onrender.com/api/collection/${selectedCollection}/items`,
      })
        .then((res) => {
          setIsEmpty(res.data.length === 0 ? true : false)
          if (res.data.length !== 0) {
            setItems(res.data)
            setItemHeadCells([...new Set([...Object.keys(res.data[0])])])
          }
        })
        .catch((err) => setErrorMessage(err.response.data))
  }

  React.useEffect(() => loadItems(), [isManaged])

  return (
    <>
      <Box
        sx={{
          width: '100%',
          marginTop: 9,
          padding: 0,
          justifyContent: 'center',
        }}
      >
        <Box
          sx={{
            borderBottom: 1,
            borderColor: 'divider',
            justifyContent: 'center',
          }}
        >
          <Tabs
            value={value}
            onChange={handleChange}
            aria-label='basic tabs example'
            centered
          >
            <Tab label={t('users')} {...a11yProps(0)} />
            <Tab label={t('collections')} {...a11yProps(1)} />
          </Tabs>
        </Box>
        <TabPanel value={value} index={0}>
          <div>
            {error ? (
              <h1>{error.data}</h1>
            ) : (
              <div>
                <Table
                  rows={users}
                  isManaged={isManaged}
                  setIsManaged={setIsManaged}
                  headCells={usersHeadCells}
                  isForAdmins={true}
                />
              </div>
            )}
          </div>
        </TabPanel>
        <TabPanel value={value} index={1}>
          <div>
            {!selectedCollection ? (
              <Table
                rows={collections}
                isManaged={isManaged}
                setIsManaged={setIsManaged}
                headCells={collectionHeadCells}
                isForAdmins={false}
                setSelectedCollection={setSelectedCollection}
                isCollections={true}
              />
            ) : (
              <Table
                isForAdmins={false}
                isEmpty={isEmpty}
                rows={items}
                headCells={itemHeadCells}
              />
            )}
          </div>
        </TabPanel>
      </Box>

      {errorMessage && (
        <Alert
          action={
            <IconButton
              aria-label='close'
              color='inherit'
              size='small'
              onClick={() => {
                setErrorMessage()
              }}
            >
              x
            </IconButton>
          }
          className='alert_error'
          severity='error'
        >
          {errorMessage}
        </Alert>
      )}
    </>
  )
}
