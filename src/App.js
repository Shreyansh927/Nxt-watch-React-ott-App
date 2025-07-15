import {Switch, Route} from 'react-router-dom'
import {toast} from 'react-toastify'
import {Component} from 'react'
import Login from './components/login/index'
import Home from './components/home/index'
import Trending from './components/trending/index'
import ProtectedRoute from './components/protectedRoute/index'
import EachMovie from './components/eachMovie/index'
import Anime from './components/Anime/index'
import Documentry from './components/documentary/index'
import Tv from './components/tv/index'
import SavedVideos from './components/saved-videos-route'
import SavedVideosContext from './createContext'

import './App.css'

// Replace your code here

class App extends Component {
  state = {
    savedVideosList: JSON.parse(localStorage.getItem('saved-videos')) || [],
    darkMode: JSON.parse(localStorage.getItem('toggle') || false),
  }

  toggleDarkMode = () => {
    this.setState(prev => ({darkMode: !prev.darkMode}))
  }

  componentDidUpdate = (_, prev) => {
    const {savedVideosList, darkMode} = this.state
    if (prev.savedVideosList !== savedVideosList) {
      localStorage.setItem('saved-videos', JSON.stringify(savedVideosList))
    }

    if (prev.darkMode !== darkMode) {
      localStorage.setItem('toggle', JSON.stringify(darkMode))
    }
  }

  addVideo = newVideo => {
    this.setState(prevState => {
      const alreadyAdded = prevState.savedVideosList.some(
        vid => vid.id === newVideo.id,
      )

      if (alreadyAdded) {
        console.log('Video already added:', newVideo.id)
        toast.info('movie already added')
        return null
      }

      console.log('Adding new video:', newVideo.id)
      toast.success('movie successfully saved')
      return {
        savedVideosList: [newVideo, ...prevState.savedVideosList],
      }
    })
  }

  removeVideo = deleteVideo => {
    const {savedVideosList} = this.state
    const finalList = savedVideosList.filter(
      video => video.id !== deleteVideo.id,
    )
    toast.error('movied removed from saved list')
    this.setState({savedVideosList: finalList})
  }

  deleteFullList = () => {
    this.setState({savedVideosList: []})
  }

  deleteIndivisualVideo = deleteIndivisualVide => {
    const {savedVideosList} = this.state
    const filteredList = savedVideosList.filter(
      dv => dv.id !== deleteIndivisualVide.id,
    )
    this.setState({savedVideosList: filteredList})
  }

  render() {
    const {savedVideosList, darkMode} = this.state
    return (
      <SavedVideosContext.Provider
        value={{
          savedVideosList,
          darkMode,

          toggleDarkMode: this.toggleDarkMode,
          deleteFullList: this.deleteFullList,
          deleteIndivisualVideo: this.deleteIndivisualVideo,
          addVideo: this.addVideo,
          removeVideo: this.removeVideo,
        }}
      >
        <div
          style={{
            backgroundImage: darkMode
              ? 'linear-gradient(135deg, #1f1f1f, #2c2c2c, #3b3737, #636262)'
              : 'linear-gradient(135deg, white, white)',

            color: darkMode ? '#fff' : '#000',
            border: '1px solid #444',
          }}
          className="floating-gradient"
        >
          <Switch>
            <Route exact path="/" component={Login} />
            <ProtectedRoute exact path="/home" component={Home} />
            <ProtectedRoute exact path="/trending" component={Trending} />
            <ProtectedRoute exact path="/anime" component={Anime} />
            <ProtectedRoute exact path="/documentary" component={Documentry} />
            <ProtectedRoute exact path="/tv" component={Tv} />
            <ProtectedRoute
              exact
              path="/trending/:title/:id"
              component={EachMovie}
            />
            <ProtectedRoute
              exact
              path="/saved-videos"
              component={SavedVideos}
            />
          </Switch>
        </div>
      </SavedVideosContext.Provider>
    )
  }
}

export default App
