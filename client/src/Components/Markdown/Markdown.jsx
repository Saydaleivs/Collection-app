import * as React from 'react'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import CloseIcon from '@mui/icons-material/Close'
import Slide from '@mui/material/Slide'
import { ReactMarkdown } from 'react-markdown/lib/react-markdown'
import { useTranslation } from 'react-i18next'

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction='up' ref={ref} {...props} />
})

export default function Markdown({
  collection,
  setCollection,
  customFieldName,
}) {
  const { t } = useTranslation()
  const [open, setOpen] = React.useState(false)

  const handleClickOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  return (
    <div>
      <Button variant='outlined' onClick={handleClickOpen}>
        {customFieldName ? customFieldName : t('add description')}
      </Button>
      <Dialog
        fullScreen
        open={open}
        onClose={handleClose}
        TransitionComponent={Transition}
      >
        <AppBar sx={{ position: 'relative' }}>
          <Toolbar>
            <IconButton
              edge='start'
              color='inherit'
              onClick={() => {
                handleClose()
                setCollection({
                  ...collection,
                  [customFieldName ? customFieldName : 'description']: '',
                })
              }}
              aria-label='close'
            >
              <CloseIcon />
            </IconButton>
            <Typography sx={{ ml: 2, flex: 1 }} variant='h6' component='div'>
              {customFieldName ? customFieldName : 'Description'}
            </Typography>
            <Button autoFocus color='inherit' onClick={handleClose}>
              save
            </Button>
          </Toolbar>
        </AppBar>

        <div style={{ height: '90vh', display: 'flex' }}>
          <textarea
            style={{ resize: 'none', width: '50%', padding: '1%' }}
            placeholder={
              customFieldName
                ? customFieldName + '....'
                : 'Your description....'
            }
            value={
              customFieldName
                ? collection[customFieldName]
                : collection.description
            }
            onChange={(e) =>
              setCollection({
                ...collection,
                [customFieldName ? customFieldName : 'description']:
                  e.target.value,
              })
            }
          ></textarea>

          <ReactMarkdown
            children={collection.description}
            className='markdown'
          />
        </div>
      </Dialog>
    </div>
  )
}
