import {
  Alert,
  Box,
  Button,
  CircularProgress,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from '@mui/material'
import axios from 'axios'
import * as React from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate, useParams } from 'react-router-dom'
import TheFileUploader from '../../Components/FileUploader/TheFileUploader'
import Markdown from '../../Components/Markdown/Markdown'

export const EditOrCreate = ({ isForCreating }) => {
  const { id } = useParams()
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [errorMessage, setErrorMessage] = React.useState()
  const [collection, setCollection] = React.useState(
    isForCreating && { name: '', topic: '', customFields: [] }
  )
  const [savedCustomFields, setSavedCustomFields] = React.useState([])
  const [clone, setClone] = React.useState([])
  const [customField, setCustomField] = React.useState({
    type: '',
    customFieldName: '',
  })
  const [types, setTypes] = React.useState([
    'Number',
    'String',
    'Multiline',
    'Boolean',
    'Date',
  ])

  React.useEffect(() => {
    if (id)
      axios({
        method: 'GET',
        headers: { token: localStorage.getItem('token') },
        url: `https://course-project-server.onrender.com/api/collection/${id}`,
      }).then((res) => {
        setCollection(res.data)
        setClone([...res.data.customFields])
      })
  }, [])

  const saveCustomFields = () => {
    if (customField.type !== '' && customField.customFieldName !== '') {
      const sameTypeField = collection.customFields.filter(
        (f) => f.type === customField.type
      )

      if (sameTypeField.length < 3) {
        setSavedCustomFields([...savedCustomFields, customField])
        setCollection({
          ...collection,
          customFields: [...collection.customFields, customField],
        })
      } else {
        setErrorMessage(`You can't save ${customField.type} more than 3`)
      }
    }
  }

  const saveChanges = () => {
    axios({
      method: 'POST',
      url: 'https://course-project-server.onrender.com/api/collection',
      headers: { token: localStorage.getItem('token') },
      data: { ...collection, customFields: savedCustomFields },
    })
      .then(() => {
        navigate('/collections')
      })
      .catch((err) => setErrorMessage(err.response.data))
  }

  const saveEdits = () => {
    axios({
      method: 'POST',
      url: 'https://course-project-server.onrender.com/api/collection/edit',
      headers: { token: localStorage.getItem('token') },
      data: collection,
    })
      .then(() => navigate('/collections'))
      .catch((err) => setErrorMessage(err.response.data))
  }

  const deleteCollection = () => {
    axios({
      method: 'GET',
      url: 'https://course-project-server.onrender.com/api/collection/delete',
      headers: { token: localStorage.getItem('token') },
      params: { _id: collection._id },
    }).then(() => navigate('/collections'))
  }

  return (
    <div
      style={{
        display: 'flex',
        marginTop: 80,
        justifyContent: 'center',
      }}
    >
      {isForCreating || collection ? (
        <div
          style={{
            padding: 30,
            border: '1px solid rgba(0, 0, 0, 0.12)',
            maxWidth: '700px',
          }}
        >
          <React.Fragment>
            <Typography variant='h6' gutterBottom>
              {id ? `${t('edit')} ` : `${t('new')} `}
              {t('collection')}
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  required
                  id='name'
                  name='name'
                  label={t('name')}
                  value={collection.name}
                  onChange={(e) =>
                    setCollection({ ...collection, name: e.target.value })
                  }
                  fullWidth
                  autoComplete='given-name'
                  variant='standard'
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  required
                  id='topic'
                  name='topic'
                  label={t('topic')}
                  fullWidth
                  value={collection.topic}
                  onChange={(e) =>
                    setCollection({ ...collection, topic: e.target.value })
                  }
                  autoComplete='shipping address-line2'
                  variant='standard'
                />
              </Grid>
              <Grid item xs={12}>
                <TheFileUploader
                  setCollection={setCollection}
                  collection={collection}
                />
              </Grid>
              <Grid item xs={12}>
                <Markdown
                  setCollection={setCollection}
                  collection={collection}
                />
              </Grid>

              <Grid item xs={12} sm={5}>
                <FormControl
                  variant='standard'
                  sx={{ m: 1, width: '80%', position: 'relative', top: -7 }}
                >
                  <InputLabel id='demo-simple-select-standard-label'>
                    {t('type')}
                  </InputLabel>
                  <Select
                    labelId='demo-simple-select-standard-label'
                    id='demo-simple-select-standard'
                    label={t('type')}
                    value={customField.type}
                    onChange={(e) =>
                      setCustomField({ ...customField, type: e.target.value })
                    }
                  >
                    {types.map((t, i) => {
                      const sameTypeField = collection.customFields.filter(
                        (f) => f.type === t
                      )

                      if (sameTypeField.length < 3) {
                        return (
                          <MenuItem key={i} value={t}>
                            {t}
                          </MenuItem>
                        )
                      } else {
                        return (
                          <MenuItem key={i} disabled value={t}>
                            {t}
                          </MenuItem>
                        )
                      }
                    })}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={5}>
                <TextField
                  id='customfieldname'
                  name='customfieldname'
                  label={t('custom field name')}
                  fullWidth
                  autoComplete='shipping address-line2'
                  variant='standard'
                  value={customField.customFieldName}
                  onChange={(e) =>
                    setCustomField({
                      ...customField,
                      customFieldName: e.target.value,
                    })
                  }
                />
              </Grid>
              <Grid item xs={12} sm={2}>
                <Button
                  onClick={saveCustomFields}
                  style={{ marginTop: 10 }}
                  variant='contained'
                >
                  {t('save')}
                </Button>
              </Grid>

              {collection.customFields && (
                <>
                  {collection.customFields.map((f, i) => {
                    return (
                      <div
                        key={i}
                        style={{
                          width: '100%',
                          display: 'flex',
                          justifyContent: 'center',
                        }}
                      >
                        <Grid item xs={12} sm={5}>
                          <FormControl
                            variant='standard'
                            sx={{
                              m: 1,
                              width: '80%',
                              position: 'relative',
                              top: -7,
                            }}
                          >
                            <InputLabel id='demo-simple-select-standard-label'>
                              Type
                            </InputLabel>
                            <Select
                              labelId='demo-simple-select-standard-label'
                              id='demo-simple-select-standard'
                              label='Age'
                              value={f.type}
                              onChange={(e) => {
                                clone[i].type = e.target.value
                                setCollection({
                                  ...collection,
                                  customFields: [...clone],
                                })
                              }}
                            >
                              {types.map((t, i) => {
                                const sameTypeField = clone.filter(
                                  (f) => f.type === t
                                )

                                if (sameTypeField.length < 3) {
                                  return (
                                    <MenuItem key={i} value={t}>
                                      {t}
                                    </MenuItem>
                                  )
                                } else {
                                  return (
                                    <MenuItem key={i} disabled value={t}>
                                      {t}
                                    </MenuItem>
                                  )
                                }
                              })}
                            </Select>
                          </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={5}>
                          <TextField
                            id='customfieldname'
                            name='customfieldname'
                            label='Custom field name'
                            fullWidth
                            autoComplete='shipping address-line2'
                            variant='standard'
                            value={f.customFieldName}
                            onChange={(e) => {
                              clone[i].customFieldName = e.target.value
                              setCollection({
                                ...collection,
                                customFields: [...clone],
                              })
                            }}
                          />
                        </Grid>
                      </div>
                    )
                  })}
                </>
              )}

              <Grid item xs={12}>
                {id ? (
                  <>
                    <Button variant='contained' onClick={saveEdits}>
                      {t('edit')}
                    </Button>
                    <Button
                      variant='contained'
                      color='error'
                      style={{ marginLeft: 15 }}
                      onClick={deleteCollection}
                    >
                      {t('delete')}
                    </Button>
                  </>
                ) : (
                  <Button variant='contained' onClick={saveChanges}>
                    {t('save')}
                  </Button>
                )}
              </Grid>
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
            </Grid>
          </React.Fragment>
        </div>
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
    </div>
  )
}
