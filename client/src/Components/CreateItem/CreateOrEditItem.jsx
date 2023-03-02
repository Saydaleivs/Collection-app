import {
  Alert,
  Autocomplete,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
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
import Markdown from '../../Components/Markdown/Markdown'

export const CreateOrEditItem = ({ isForEditing }) => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [errorMessage, setErrorMessage] = React.useState()
  const [collection, setCollection] = React.useState({
    name: '',
    customFields: [],
  })
  const [customFields, setCustomFields] = React.useState([])
  const [tags, setTags] = React.useState([{ tag: '' }])
  const [value, setValue] = React.useState([])
  const [item, setItem] = React.useState({
    name: '',
  })

  const { t } = useTranslation()

  const handleKeyDown = (event) => {
    switch (event.key) {
      case ',':
      case ' ': {
        event.preventDefault()
        event.stopPropagation()

        if (event.target.value !== ' ') {
          saveNewTag(event.target.value)
        }
        if (event.target.value.length > 0) {
          setValue([...value, { tag: event.target.value }])
        }
        break
      }
      default:
    }
  }

  const createItem = () => {
    axios({
      method: 'POST',
      url: 'https://course-project-server.onrender.com/api/item',
      data: {
        ...item,
        tags: value.map((t) => t.tag),
        collectionName: id,
        customFields,
      },
      headers: { token: localStorage.getItem('token') },
    })
      .then(() => navigate(`/collection/${id}`))
      .catch((err) =>
        err.response.status === 401
          ? setErrorMessage('You must be owner or admin first to create')
          : setErrorMessage(err.response.data)
      )
  }

  const editItem = () => {
    axios({
      method: 'POST',
      url: 'https://course-project-server.onrender.com/api/item/edit',
      headers: { token: localStorage.getItem('token') },
      data: {
        ...item,
        tags: value.map((t) => t.tag),
        customFields,
      },
    })
      .then(() => navigate(`/collection/${item.collectionName}`))
      .catch((err) =>
        err.response.status === 401
          ? setErrorMessage('You must be owner or admin first to edit')
          : setErrorMessage(err.response.data)
      )
  }

  const saveNewTag = (tag) => {
    axios({
      method: 'GET',
      url: 'https://course-project-server.onrender.com/api/item/tag',
      headers: { token: localStorage.getItem('token') },
      params: { tag },
    })
  }

  React.useEffect(() => {
    if (!isForEditing) {
      axios({
        method: 'GET',
        headers: { token: localStorage.getItem('token') },
        url: `https://course-project-server.onrender.com/api/item/data/${id}`,
      })
        .then((res) => {
          setCollection(res.data.collection)
          setTags(res.data.tags)
        })
        .catch(
          (err) =>
            err.response.status === 401 &&
            setErrorMessage('You must be the owner or admin first')
        )
    } else {
      axios({
        method: 'GET',
        headers: { token: localStorage.getItem('token') },
        url: `https://course-project-server.onrender.com/api/item/id/${id}`,
      }).then((res) => {
        setItem(res.data.item._doc)
        setTags(res.data.allTags)
        setValue(res.data.item.tags)
      })
    }
  }, [])

  return (
    <div
      style={{
        display: 'flex',
        marginTop: 80,
        justifyContent: 'center',
      }}
    >
      <div
        style={{
          padding: 30,
          border: '1px solid rgba(0, 0, 0, 0.12)',
          maxWidth: '700px',
        }}
      >
        <React.Fragment>
          <Typography variant='h6' gutterBottom>
            {isForEditing ? `${t('edit')} ` : `${t('new')} `}
            {t('item')}
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                required
                id='name'
                name='name'
                label={t('name')}
                value={item.name}
                onChange={(e) => setItem({ ...item, name: e.target.value })}
                fullWidth
                autoComplete='given-name'
                variant='standard'
              />
            </Grid>

            <Grid item xs={12}>
              <Autocomplete
                multiple
                freeSolo
                style={{ marginBottom: 30 }}
                id='tags-outlined'
                options={tags}
                getOptionLabel={(option) => option.tag}
                value={value}
                onChange={(event, newValue) => setValue(newValue)}
                filterSelectedOptions
                renderInput={(params) => {
                  params.inputProps.onKeyDown = handleKeyDown
                  return (
                    <TextField
                      {...params}
                      variant='outlined'
                      label={t('tags')}
                      placeholder={t('enter tag')}
                      margin='normal'
                      fullWidth
                    />
                  )
                }}
              />
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
                      <Grid item xs={12} sm={4}>
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
                          >
                            <MenuItem value={f.type}>{f.type}</MenuItem>
                          </Select>
                        </FormControl>
                      </Grid>

                      <Grid item xs={12} sm={5}>
                        {f.type === 'Multiline' ? (
                          <div style={{ marginTop: 10 }}>
                            <Markdown
                              customFieldName={f.customFieldName}
                              setCollection={setCustomFields}
                              collection={customFields}
                            />
                          </div>
                        ) : (
                          <>
                            {f.type === 'Boolean' ? (
                              <FormGroup style={{ marginTop: 10 }}>
                                <FormControlLabel
                                  control={
                                    <Checkbox
                                      onChange={(e) =>
                                        setCustomFields({
                                          ...customFields,
                                          [f.customFieldName]: e.target.checked,
                                        })
                                      }
                                    />
                                  }
                                  label={f.customFieldName}
                                />
                              </FormGroup>
                            ) : (
                              <TextField
                                id='customfieldname'
                                name='customfieldname'
                                label={
                                  f.type === 'Date' ? '' : f.customFieldName
                                }
                                helperText={
                                  f.type === 'Date' ? f.customFieldName : ''
                                }
                                type={f.type}
                                value={
                                  customFields[f.customFieldName] !== undefined
                                    ? customFields[f.customFieldName]
                                    : ''
                                }
                                onChange={(e) => {
                                  setCustomFields({
                                    ...customFields,
                                    [f.customFieldName]: e.target.value,
                                  })
                                }}
                                fullWidth
                                variant='standard'
                              />
                            )}
                          </>
                        )}
                      </Grid>
                    </div>
                  )
                })}
              </>
            )}

            <Grid item xs={12}>
              {isForEditing ? (
                <>
                  <Button variant='contained' onClick={editItem}>
                    {t('edit')}
                  </Button>
                  <Button
                    variant='contained'
                    color='error'
                    style={{ marginLeft: 15 }}
                  >
                    {t('delete')}
                  </Button>
                </>
              ) : (
                <Button variant='contained' onClick={createItem}>
                  {t('create')}
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
    </div>
  )
}
