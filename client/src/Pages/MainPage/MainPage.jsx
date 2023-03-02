import { Box, Tab, Tabs } from '@mui/material'
import React from 'react'
import { useTranslation } from 'react-i18next'
import Collections from '../../Components/Collections/Collections'
import Item from '../../Components/Item/Item'

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  }
}

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

export const MainPage = () => {
  const [value, setValue] = React.useState(0)
  const { t } = useTranslation()

  const handleChange = (event, newValue) => {
    setValue(newValue)
  }

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
            <Tab label={t('items')} {...a11yProps(0)} />
            <Tab label={t('collections')} {...a11yProps(1)} />
          </Tabs>
        </Box>
        <TabPanel value={value} index={0}>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Item />
          </div>
        </TabPanel>
        <TabPanel value={value} index={1}>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Collections isForMainpage={true} />
          </div>
        </TabPanel>
      </Box>
    </>
  )
}
