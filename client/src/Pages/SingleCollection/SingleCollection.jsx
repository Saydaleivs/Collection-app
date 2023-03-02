import * as React from 'react'
import axios from 'axios'
import { Button, Tab, Tabs } from '@mui/material'
import { Box } from '@mui/system'
import { useNavigate, useParams } from 'react-router-dom'
import Table from '../../Components/Table/Table'
import { CollectionDetailed } from '../../Components/CollectionDetailed/CollectionDetailed'
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

export const SingleCollection = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { t } = useTranslation()
  const [value, setValue] = React.useState(0)
  const [items, setItems] = React.useState([])
  const [isEmpty, setIsEmpty] = React.useState(true)
  const [isManaged, setIsManaged] = React.useState(false)
  const [headCells, setHeadCells] = React.useState([])

  const handleChange = (event, newValue) => {
    setValue(newValue)
  }

  React.useEffect(() => {
    axios({
      method: 'GET',
      headers: { token: localStorage.getItem('token') },
      url: `https://course-project-server.onrender.com/api/collection/${id}/items`,
    })
      .then((res) => {
        setIsEmpty(res.data.length === 0 ? true : false)
        if (res.data.length !== 0) {
          setItems(res.data)
          setHeadCells([...new Set([...Object.keys(res.data[0])])])
        }
      })
      .catch((err) => setItems(err))
  }, [isManaged])

  return (
    <div>
      <Box
        sx={{
          marginTop: 9,
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
            <Tab label={t('details')} {...a11yProps(0)} />
            <Tab label={t('items')} {...a11yProps(1)} />
          </Tabs>
        </Box>
        <TabPanel value={value} index={0}>
          <CollectionDetailed />
        </TabPanel>

        <TabPanel value={value} index={1}>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              width: '100%',
              margin: 'auto',
            }}
          >
            <Button
              variant='contained'
              color='success'
              style={{ marginBottom: 20, width: 270 }}
              onClick={() => navigate(`/create/item/${id}`)}
            >
              {t('create new Item')}
            </Button>
            <Table
              isForAdmins={false}
              isEmpty={isEmpty}
              setIsManaged={setIsManaged}
              isManaged={isManaged}
              rows={items}
              headCells={headCells}
            />
          </div>
        </TabPanel>
      </Box>
    </div>
  )
}
