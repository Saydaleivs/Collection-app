import * as React from 'react'
import axios from 'axios'
import Avatar from '@mui/material/Avatar'
import Button from '@mui/material/Button'
import CssBaseline from '@mui/material/CssBaseline'
import TextField from '@mui/material/TextField'
import { Link, useNavigate } from 'react-router-dom'
import Grid from '@mui/material/Grid'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Container from '@mui/material/Container'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import { Alert } from '@mui/material'
import { useTranslation } from 'react-i18next'

const themes = createTheme()

export default function SignUpPage({ setToken }) {
  const navigate = useNavigate()
  const [signUpData, setSignUpData] = React.useState({
    name: '',
    username: '',
    email: '',
    password: '',
  })
  const [entryError, setEntryError] = React.useState('')

  const { t } = useTranslation()

  const handleChange = (e) => {
    setSignUpData({ ...signUpData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    axios({
      method: 'GET',
      params: signUpData,
      url: 'https://course-project-server.onrender.com/api/signup',
    })
      .then((res) => {
        setEntryError('')
        setSignUpData({
          name: '',
          username: '',
          email: '',
          password: '',
        })
        localStorage.setItem('token', res.data.token)
        localStorage.setItem('userId', res.data.userId)
        setToken(res.data.token)
        navigate('/')
      })
      .catch((err) => {
        if (typeof err.response.data === 'object') {
          setEntryError('This email address is already in use !')
        } else {
          setSignUpData({ ...signUpData, password: '' })
          setEntryError(err.response.data)
        }
      })
  }

  return (
    <ThemeProvider theme={themes}>
      <Container component='main' maxWidth='xs'>
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}></Avatar>
          <Typography component='h1' variant='h5'>
            {t('sign up')}
          </Typography>
          <Box
            component='form'
            noValidate={false}
            onSubmit={handleSubmit}
            sx={{ mt: 3 }}
          >
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id='name'
                  label={t('full name')}
                  name='name'
                  autoComplete='name'
                  value={signUpData.name}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id='username'
                  label='Username'
                  name='username'
                  value={signUpData.username}
                  autoComplete='name'
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id='email'
                  label={t('email address')}
                  name='email'
                  value={signUpData.email}
                  autoComplete='email'
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name='password'
                  label={t('password')}
                  type='password'
                  id='password'
                  value={signUpData.password}
                  autoComplete='new-password'
                  onChange={handleChange}
                />
              </Grid>
            </Grid>
            <Button
              type='submit'
              fullWidth
              variant='contained'
              sx={{ mt: 3, mb: 2 }}
            >
              {t('sign up')}
            </Button>
            <Grid container justifyContent='flex-end'>
              <Grid item>
                <Link to='/signin' variant='body2'>
                  {`${t('already have an account')}? ${t('sign in')}`}
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
        {entryError && (
          <Alert className='alert_error' severity='error'>
            {entryError}
          </Alert>
        )}
      </Container>
    </ThemeProvider>
  )
}
