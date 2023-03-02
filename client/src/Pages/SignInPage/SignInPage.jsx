import * as React from 'react'
import Avatar from '@mui/material/Avatar'
import Button from '@mui/material/Button'
import CssBaseline from '@mui/material/CssBaseline'
import TextField from '@mui/material/TextField'
import { Link, useNavigate } from 'react-router-dom'
import Paper from '@mui/material/Paper'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import Typography from '@mui/material/Typography'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import axios from 'axios'
import { Alert } from '@mui/material'
import { useTranslation } from 'react-i18next'

const themes = createTheme()

export default function SignInSide({ setToken }) {
  const [signInData, setSignInData] = React.useState({})
  const [entryError, setEntryError] = React.useState('')
  const navigate = useNavigate()

  const { t } = useTranslation()

  const handleChange = (e) => {
    setSignInData({ ...signInData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    axios({
      method: 'GET',
      params: signInData,
      url: 'https://course-project-server.onrender.com/api/signin',
    })
      .then((res) => {
        setEntryError('')
        setSignInData({})
        localStorage.setItem('token', res.data.token)
        localStorage.setItem('userId', res.data.userId)
        setToken(res.data.token)
        navigate('/')
      })
      .catch((err) => {
        setEntryError(err.response.data)
      })
  }

  return (
    <ThemeProvider theme={themes}>
      <Grid container component='main' sx={{ height: '100vh' }}>
        <CssBaseline />
        <Grid
          item
          xs={false}
          sm={4}
          md={7}
          sx={{
            backgroundImage: 'url(https://source.unsplash.com/random)',
            backgroundRepeat: 'no-repeat',
            backgroundColor: (t) =>
              t.palette.mode === 'light'
                ? t.palette.grey[50]
                : t.palette.grey[900],
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
          <Box
            sx={{
              my: 8,
              mx: 4,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component='h1' variant='h5'>
              {t('sign in')}
            </Typography>
            <Box
              component='form'
              noValidate
              onSubmit={handleSubmit}
              sx={{ mt: 1 }}
            >
              <TextField
                margin='normal'
                required
                fullWidth
                id='username'
                label='Username'
                name='username'
                autoComplete='username'
                onChange={handleChange}
                autoFocus
              />
              <TextField
                margin='normal'
                required
                fullWidth
                name='password'
                label={t('password')}
                type='password'
                id='password'
                onChange={handleChange}
                autoComplete='current-password'
              />
              <Button
                type='submit'
                fullWidth
                variant='contained'
                sx={{ mt: 3, mb: 2 }}
              >
                {t('sign in')}
              </Button>
              <Grid container>
                <Grid item>
                  <Link to='/signup' variant='body2'>
                    {`${t("don't have an account")}? ${t('sign up')}`}
                  </Link>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Grid>
        {entryError && (
          <Alert className='alert_error' severity='error'>
            {entryError}
          </Alert>
        )}
      </Grid>
    </ThemeProvider>
  )
}
