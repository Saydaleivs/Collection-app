import * as React from 'react'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import CardActions from '@mui/material/CardActions'
import IconButton from '@mui/material/IconButton'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder'
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit'
import CommentOutlinedIcon from '@mui/icons-material/CommentOutlined'
import SendIcon from '@mui/icons-material/Send'

import {
  Alert,
  Backdrop,
  Badge,
  Button,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemText,
  Skeleton,
  Typography,
} from '@mui/material'
import axios from 'axios'
import { Stack } from '@mui/system'
import { useNavigate, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

export default function Item({ isForTags, isCommentSearch }) {
  const { id } = useParams()
  const navigate = useNavigate()
  const { t } = useTranslation()
  const [open, setOpen] = React.useState(false)
  const [comment, setComment] = React.useState([])
  const [errorMessage, setErrorMessage] = React.useState()
  const [commentId, setCommentId] = React.useState('')
  const [myComment, setMyComment] = React.useState('')
  const [items, setItems] = React.useState()

  const loadItems = () => {
    if (isForTags) {
      loadTagPage()
    } else {
      if (!id) {
        loadSingleItem()
      } else {
        loadItemById()
      }
    }
  }

  function loadTagPage() {
    axios({
      method: 'GET',
      url: 'https://course-project-server.onrender.com/api/search',
      params: { q: id },
    }).then((res) => {
      setItems(res.data.items)
    })
  }

  function loadSingleItem() {
    axios({
      method: 'GET',
      headers: { token: localStorage.getItem('token') },
      url: 'https://course-project-server.onrender.com/api/item',
    }).then((res) => {
      setItems(res.data)
    })
  }

  function loadItemById() {
    axios({
      method: 'GET',
      url: `https://course-project-server.onrender.com/api/item/id/${id}`,
    }).then((res) => {
      setItems([res.data.item._doc])
      if (isCommentSearch) {
        showComments(res.data.item._doc._id)
        setOpen(true)
      }
    })
  }

  React.useEffect(() => {
    loadItems()
  }, [id])

  React.useEffect(() => {
    let interval
    if (open) {
      interval = setInterval(() => {
        showComments(commentId || items[0]._id)
      }, 3000)
    }
    return () => clearInterval(interval)
  }, [open])

  const sendComment = (e) => {
    axios({
      method: 'POST',
      url: 'https://course-project-server.onrender.com/api/item/comment',
      headers: { token: localStorage.getItem('token') },
      data: { comment: { comment: myComment, _id: e.target.id } },
    })
      .then(() => {
        showComments(commentId)
        setMyComment('')
      })
      .catch(
        (err) =>
          err.response.status === 401 &&
          setErrorMessage('Please Sign in or sign up to comment')
      )
  }

  const likeItem = (e) => {
    axios({
      method: 'GET',
      url: 'https://course-project-server.onrender.com/api/item/like',
      headers: { token: localStorage.getItem('token') },
      params: { _id: e.currentTarget.id },
    })
      .then(() => loadItems())
      .catch(
        (err) =>
          err.response.status === 401 &&
          setErrorMessage('Please sign in or up to like')
      )
  }

  const showComments = (value) => {
    axios({
      method: 'GET',
      headers: { token: localStorage.getItem('token') },
      params: { commentId: value },
      url: 'https://course-project-server.onrender.com/api/item/comments',
    }).then((res) => {
      setComment(res.data.comments)
      setCommentId(value)
    })
  }

  return (
    <div
      style={{
        marginTop: id ? 70 : 10,
        display: 'flex',
        flexDirection: 'column',
        alignItems: id ? 'center' : 'normal',
      }}
    >
      {items ? (
        <>
          {items?.map((item) => {
            return (
              <Card
                sx={{ maxWidth: 345 }}
                key={item._id}
                style={{ marginTop: 20 }}
              >
                <CardHeader
                  title={item.name}
                  subheader={t('collection') + `: ${item.collectionName}`}
                />

                <div style={{ padding: 16 }}>
                  {item.customFields.map((f, i) => {
                    return (
                      <p key={i}>
                        {Object.keys(f)}:{' '}
                        {typeof Object.values(f)[0] === 'boolean'
                          ? JSON.stringify(Object.values(f)[0])
                          : Object.values(f)}
                      </p>
                    )
                  })}
                </div>

                <CardContent>
                  <Stack direction='row' spacing={1}>
                    {item.tags.map((tag) => (
                      <div key={tag} onClick={() => navigate(`/tag/${tag}`)}>
                        <Chip clickable label={tag} />
                      </div>
                    ))}
                  </Stack>
                </CardContent>
                <CardActions disableSpacing>
                  <IconButton
                    aria-label='Like'
                    onClick={likeItem}
                    id={item._id}
                  >
                    <Badge badgeContent={item.likes.length} color='primary'>
                      <FavoriteBorderIcon
                        sx={{
                          color: item.likes.includes(
                            localStorage.getItem('userId')
                          )
                            ? 'red'
                            : 'gray',
                        }}
                      />
                    </Badge>
                  </IconButton>

                  <IconButton
                    aria-label='Comment'
                    id={item._id}
                    onClick={(e) => {
                      setCommentId(e.currentTarget.id)
                      showComments(e.currentTarget.id)
                      setOpen(true)
                    }}
                  >
                    <CommentOutlinedIcon />
                  </IconButton>
                </CardActions>

                <Backdrop
                  sx={{
                    color: '#fff',
                    zIndex: (theme) => theme.zIndex.drawer + 1,
                  }}
                  open={open}
                >
                  <FullscreenExitIcon
                    onClick={() => {
                      setOpen(false)
                      if (isCommentSearch) {
                        navigate(`/item/${items[0]._id}`)
                      }
                    }}
                    style={{
                      position: 'absolute',
                      top: 20,
                      right: 20,
                      fontSize: 30,
                      cursor: 'pointer',
                    }}
                  />

                  <List
                    sx={{
                      width: '100%',
                      maxWidth: 360,
                      height: '70vh',
                      bgcolor: 'background.paper',
                      borderRadius: 3,
                      display: 'flex',
                      flexDirection: 'column',
                    }}
                  >
                    <Typography
                      sx={{
                        display: 'inline',
                        fontSize: 20,
                        textAlign: 'center',
                        paddingBottom: 0.7,
                      }}
                      component='title'
                      variant='body2'
                      color='text.primary'
                    >
                      {t('comments')}:
                    </Typography>
                    <div style={{ overflow: 'scroll', height: 530 }}>
                      {comment.map((c) => {
                        return (
                          <div key={c._id}>
                            <ListItem alignItems='flex-start'>
                              <ListItemText
                                secondary={
                                  <React.Fragment>
                                    <Typography
                                      sx={{ display: 'inline' }}
                                      component='span'
                                      variant='body2'
                                      color='text.primary'
                                    >
                                      {c.owner}
                                    </Typography>
                                    {` - ${c.comment}`}
                                  </React.Fragment>
                                }
                              />
                            </ListItem>
                            <Divider variant='middle' component='li' />
                          </div>
                        )
                      })}
                    </div>
                    <div
                      style={{
                        marginTop: 8,
                        width: '80%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        position: 'absolute',
                        bottom: 10,
                        left: '10%',
                      }}
                    >
                      <input
                        type='text'
                        placeholder='Your comment'
                        value={myComment}
                        onChange={(e) => {
                          setMyComment(e.target.value)
                        }}
                        style={{ height: 36.5, width: 175, paddingLeft: 10 }}
                      />
                      <Button
                        variant='contained'
                        id={commentId}
                        onClick={sendComment}
                        endIcon={<SendIcon />}
                      >
                        {t('send')}
                      </Button>
                    </div>
                  </List>
                </Backdrop>
              </Card>
            )
          })}
        </>
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

      {errorMessage && (
        <Alert
          style={{ zIndex: 99999 }}
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
    </div>
  )
}
