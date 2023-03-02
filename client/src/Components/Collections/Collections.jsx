import * as React from 'react'
import axios from 'axios'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardMedia from '@mui/material/CardMedia'
import Typography from '@mui/material/Typography'
import { Button, CardActionArea, CardActions, Skeleton } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

export default function Collections({ isForMainpage }) {
  const [collections, setCollections] = React.useState()

  React.useEffect(() => {
    if (!isForMainpage) {
      axios({
        method: 'GET',
        url: 'https://course-project-server.onrender.com/api/collection/me',
        headers: { token: localStorage.getItem('token') },
      }).then((res) => {
        setCollections(res.data)
      })
    } else {
      axios({
        method: 'GET',
        url: 'https://course-project-server.onrender.com/api/collection/biggest',
      }).then((res) => {
        setCollections(res.data)
      })
    }
  }, [])

  return <Collection collections={collections} isForMainpage={isForMainpage} />
}

function Collection({ collections, isForMainpage }) {
  const navigate = useNavigate()
  const { t } = useTranslation()

  return (
    <>
      {collections ? (
        <div style={{ margin: 'auto' }}>
          {typeof collections === 'object' ? (
            collections.map((collection) => {
              return (
                <Card
                  sx={{ maxWidth: 345, marginBottom: 3 }}
                  id={collection._id}
                  key={collection._id}
                >
                  <CardActionArea
                    onClick={() => navigate(`/collection/${collection.name}`)}
                  >
                    <CardMedia
                      component='img'
                      height='140'
                      src={
                        collection.image
                          ? collection.image
                          : 'https://media.istockphoto.com/id/1357365823/vector/default-image-icon-vector-missing-picture-page-for-website-design-or-mobile-app-no-photo.jpg?s=612x612&w=0&k=20&c=PM_optEhHBTZkuJQLlCjLz-v3zzxp-1mpNQZsdjrbns='
                      }
                      alt=''
                    />
                    <CardContent>
                      <Typography gutterBottom variant='h5' component='div'>
                        {collection.name}
                      </Typography>
                      <Typography variant='body2' color='text.secondary'>
                        {collection.topic}
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                  {!isForMainpage && (
                    <CardActions>
                      <Button
                        onClick={() => navigate(`/edit/${collection.name}`)}
                        size='small'
                        color='primary'
                      >
                        {t('edit')}
                      </Button>
                    </CardActions>
                  )}
                </Card>
              )
            })
          ) : (
            <p>{t('no collection')}</p>
          )}
        </div>
      ) : (
        <>
          <Skeleton
            style={{ marginTop: 10 }}
            variant='rectangular'
            width='260px'
            height={270}
          >
            <div style={{ paddingTop: '57%' }} />
          </Skeleton>
          <Skeleton
            style={{ marginTop: 10 }}
            variant='rectangular'
            width='260px'
            height={270}
          >
            <div style={{ paddingTop: '57%' }} />
          </Skeleton>
          <Skeleton
            style={{ marginTop: 10 }}
            variant='rectangular'
            width='260px'
            height={270}
          >
            <div style={{ paddingTop: '57%' }} />
          </Skeleton>
        </>
      )}
    </>
  )
}
