import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { Link, navigate } from 'gatsby'
import Container from '@material-ui/core/Container'
import Grid from '@material-ui/core/Grid'
import Hidden from '@material-ui/core/Hidden'
import { makeStyles } from '@material-ui/core/styles'

import colors from '../styles/colors'

const useStyles = makeStyles({
  header: {
    backgroundColor: 'white',
    fontFamily: 'Ubuntu, san-serif',
    fontWeight: '700',
    height: '2.4rem',
    position: 'fixed',
    width: '100%',
    zIndex: '99',
  },
  logo: {
    backgroundColor: colors.red,
    color: 'white',
    fontSize: '1.6rem',
    padding: '0 0.15rem 0.8rem',
  },
  navItem: {
    float: 'left',
    listStyleType: 'none',
    paddingTop: '0.1rem',
    fontSize: '1.2rem',
    color: colors.blue,
    paddingLeft: '2.0rem',
    '&:hover': {
      color: colors.red,
    },
  },
  navActiveItem: {
    color: colors.red,
  },
})

const Header = ({ currentPage }) => {
  const classes = useStyles()

  // logo
  const logo = (
    <a href="/" className={classes.logo}>
      bobae kang
    </a>
  )

  // index page
  const [activeSection, setActiveSection] = useState('home')
  const indexSections = ['home', 'about', 'blog']

  const navItemClass = isActive =>
    [classes.navItem, isActive ? classes.navActiveItem : undefined].join(' ')
  const navIndex = indexSections.map(s => (
    <a
      className={navItemClass(activeSection === s)}
      key={s}
      href={`#${s}`}
      onClick={() => navigate(`#${s}`)}
    >
      {s}
    </a>
  ))

  useEffect(() => {
    const onScroll = e => {
      indexSections.forEach(s => {
        if (
          document.querySelector(`#${s}`).getBoundingClientRect().top <
          e.target.documentElement.scrollTop
        )
          setActiveSection(s)
      })
    }

    if (currentPage === 'index') window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [currentPage, indexSections])

  // blog page
  const navBlog = (
    <Link to="/blog" className={navItemClass(true)}>
      blog
    </Link>
  )

  return (
    <header className={classes.header}>
      <Container maxWidth="md">
        <Grid container direction="row" justify="space-between">
          <Grid item>
            {(currentPage !== 'index' || activeSection !== 'home') && logo}
          </Grid>
          <Grid item>
            <Hidden xsDown>{currentPage === 'index' && navIndex}</Hidden>
            {currentPage === 'blog' && navBlog}
          </Grid>
        </Grid>
      </Container>
    </header>
  )
}

Header.propTypes = {
  currentPage: PropTypes.string.isRequired,
}

export default Header
