import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  CircularProgress,
  Typography,
} from '@mui/material'
import axios from 'axios'
import * as React from 'react'
import { useTranslation } from 'react-i18next'
import { ReactMarkdown } from 'react-markdown/lib/react-markdown'
import { useParams } from 'react-router-dom'

export const CollectionDetailed = () => {
  const { id } = useParams()
  const { t } = useTranslation()
  const [collection, setCollection] = React.useState()

  React.useEffect(() => {
    axios({
      method: 'GET',
      headers: { token: localStorage.getItem('token') },
      url: `https://course-project-server.onrender.com/api/collection/${id}`,
    }).then((res) => setCollection(res.data))
  }, [])

  return (
    <>
      {collection ? (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <img
            src={
              collection.image
                ? collection.image
                : 'https://media.istockphoto.com/id/1357365823/vector/default-image-icon-vector-missing-picture-page-for-website-design-or-mobile-app-no-photo.jpg?s=612x612&w=0&k=20&c=PM_optEhHBTZkuJQLlCjLz-v3zzxp-1mpNQZsdjrbns='
            }
            alt={collection.name}
            style={{ width: '100%', maxWidth: 694 }}
          />
          <Accordion style={{ width: '100%', maxWidth: 694 }}>
            <AccordionSummary
              aria-controls='panel1a-content'
              id='panel1a-header'
            >
              <Typography>{t('description')}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <ReactMarkdown children={collection.description} />
            </AccordionDetails>
          </Accordion>
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
    </>
  )
}
