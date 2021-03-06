import React from 'react'
import { Container } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'

import Layout from '../components/layout'
import LinkBackTo from '../components/linkBackTo'
import SEO from '../components/seo'
import colors from '../styles/colors.js'

const useStyles = makeStyles({
  notFound: {
    marginTop: '5rem',
    '& h1': {
      color: colors.red,
    },
  },
})

const NotFoundPage = () => {
  const classes = useStyles()

  return (
    <Layout currentPage={'404'}>
      <SEO title="404: Not found" />
      <Container className={classes.notFound} maxWidth="md">
        <LinkBackTo to={{ name: 'Home', path: '/' }}></LinkBackTo>
        <h1>
          page not found{' '}
          <span aria-label="jsx-a11y/accessible-emoji" role="img">
            😬
          </span>
        </h1>
        <p>The page you're looking for does not exist (404 Error).</p>
      </Container>
    </Layout>
  )
}

export default NotFoundPage
