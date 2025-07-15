import {withRouter, Link} from 'react-router-dom'
import {useState, useContext} from 'react'
import Cookies from 'js-cookie'

import {FaMoon, FaHome, FaSave} from 'react-icons/fa'
import {IoMdTrendingUp} from 'react-icons/io'
import {IoMenu} from 'react-icons/io5'

import Popup from 'reactjs-popup'
import SavedVideosContext from '../../createContext'

import 'reactjs-popup/dist/index.css'
import './index.css'

const navigationList = [
  {
    link: '/home',
    navText: 'Home',
  },
  {
    link: '/trending',
    navText: 'Movies',
  },
  {
    link: '/anime',
    navText: 'Anime',
  },
  {
    link: '/documentary',
    navText: 'Documentary',
  },
  {
    link: '/tv',
    navText: 'TV',
  },
  {
    link: '/saved-videos',
    navText: 'Saved',
  },
]

const Header = props => {
  const [activeNav, setActiveNav] = useState('')
  const {savedVideosList, darkMode, toggleDarkMode} = useContext(
    SavedVideosContext,
  )

  const changeNavLink = newLink => {
    setActiveNav(newLink)
  }
  const logout = () => {
    const {history} = props
    Cookies.remove('jwt_token')
    history.replace('/')
  }

  const overlayStyles = {
    backgroundColor: '#ffff',
  }

  return (
    <>
      <nav className="sm-navbar">
        <ol>
          <img
            src="https://assets.ccbp.in/frontend/react-js/nxt-watch-logo-light-theme-img.png"
            alt="home-logo"
            className="home-logo"
          />
        </ol>

        <ol>
          <Popup
            modal
            trigger={
              <li>
                <IoMenu className="m" />
              </li>
            }
            overlayStyle={overlayStyles}
          >
            <div className="popup-container">
              <ol>
                <Link to="/home" className="no-underline">
                  <li className="home">
                    <FaHome className=" m" />
                    <span className="pop-content">Home</span>
                  </li>
                </Link>
                <Link to="/trending" className="no-underline">
                  <li className="trending">
                    <IoMdTrendingUp className=" m" />
                    <span className="pop-content">Trending</span>
                  </li>
                </Link>

                <Link to="/anime" className="no-underline">
                  <li className="trending">
                    <IoMdTrendingUp className=" m" />
                    <span className="pop-content">Anime</span>
                  </li>
                </Link>
                <Link to="/documentary" className="no-underline">
                  <li className="trending">
                    <IoMdTrendingUp className=" m" />
                    <span className="pop-content">Documentry</span>
                  </li>
                </Link>
                <Link to="/tv" className="no-underline">
                  <li className="trending">
                    <IoMdTrendingUp className=" m" />
                    <span className="pop-content">TV</span>
                  </li>
                </Link>
                <Link to="/saved-videos">
                  <li className="saved-videos">
                    <FaSave className="m" />
                    <span className="pop-content">Saved </span>
                    <p style={{color: 'red'}}>{savedVideosList.length}</p>
                  </li>
                </Link>
              </ol>

              <ol className="nav-sec2">
                <li>
                  <FaMoon className="moon" />
                </li>

                <li>
                  <button
                    type="button"
                    onClick={logout}
                    className="logout-button"
                  >
                    Logout
                  </button>
                </li>
              </ol>
            </div>
          </Popup>
        </ol>
      </nav>

      <nav className={darkMode ? 'lg-navbar-dark' : 'lg-navbar'}>
        <ol>
          <img
            src={
              darkMode
                ? 'https://assets.ccbp.in/frontend/react-js/nxt-watch-logo-dark-theme-img.png'
                : 'https://assets.ccbp.in/frontend/react-js/nxt-watch-logo-light-theme-img.png'
            }
            alt="home-logo"
            className="home-logo"
          />
        </ol>
        <ol className="nav-sec2">
          {navigationList.map(eachNav => (
            <Link
              key={eachNav.navText}
              to={eachNav.link}
              className="no-underline"
            >
              <li
                className={
                  eachNav.link === activeNav ? 'newNavCss' : 'lg-nav-routes'
                }
                onClick={() => changeNavLink(eachNav.link)}
              >
                {eachNav.navText}
              </li>
            </Link>
          ))}
        </ol>
        <ol className="nav-sec2">
          <li>
            <FaMoon
              className="moon"
              style={{fontSize: '27px'}}
              onClick={() => toggleDarkMode()}
            />
          </li>

          <li>
            <button type="button" onClick={logout} className="logout-button">
              Logout
            </button>
          </li>
        </ol>
      </nav>
    </>
  )
}

export default withRouter(Header)
