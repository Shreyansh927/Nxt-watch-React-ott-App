import {useState, useContext, useEffect} from 'react'
import {Link} from 'react-router-dom'
import {HiDotsVertical} from 'react-icons/hi'
import Header from '../header/index'
import SavedVideosContext from '../../createContext'
import './index.css'

const SavedVideos = () => {
  const [inputValue, setInputValue] = useState('')

  const [add, setAdd] = useState(3)
  const [v, setV] = useState(false)
  const {
    savedVideosList,
    deleteFullList,
    deleteIndivisualVideo,
    darkMode,
  } = useContext(SavedVideosContext)
  const [finalFilteredList, setFinalFilteredList] = useState(savedVideosList)

  const [activeDeleteId, setActiveDeleteId] = useState(null)

  const toggleInsideDeleteButton = each => {
    setActiveDeleteId(each)
    setV(!v)
  }

  const showMore = () => {
    setAdd(add + 3)
  }

  const showLess = () => {
    setAdd(3)
  }

  useEffect(() => {
    const filterList = savedVideosList.filter(eachList =>
      eachList.title.toLowerCase().includes(inputValue.toLowerCase()),
    )
    setFinalFilteredList(filterList.slice(0, add))
  }, [inputValue, savedVideosList, add])

  return (
    <>
      <div className={darkMode && 'dark'}>
        <Header />
        {savedVideosList.length === 0 ? (
          <>
            <div className="empty-container">
              <div>
                <img
                  src="https://assets.ccbp.in/frontend/react-js/nxt-watch-no-saved-videos-img.png"
                  className="empty-image"
                  alt="empty list"
                />
              </div>
            </div>
            <div className="show-hide-container">
              <div className="hr">
                <hr />
              </div>
              <div style={{display: 'flex', justifyContent: 'center'}}>
                <Link to="/home" style={{textDecoration: 'none'}}>
                  <button type="button" className="add-button">
                    Add Movies
                  </button>
                </Link>
              </div>

              <div className="hr">
                <hr />
              </div>
            </div>
          </>
        ) : (
          <div className="main-container">
            <div
              className="search-and-delete-container"
              style={{marginBottom: '20px'}}
            >
              <div className="searchbox-container">
                <input
                  className="saved-videos-search-bar"
                  type="text"
                  value={inputValue}
                  onChange={e => setInputValue(e.target.value)}
                  placeholder="Search saved videos..."
                  style={{marginLeft: '20px', padding: '5px'}}
                />
              </div>
              <div className="delete-all-container">
                <button
                  onClick={deleteFullList}
                  type="button"
                  className="delete-all-button"
                >
                  Delete All
                </button>
              </div>
            </div>

            <ul className="saved-videos-container">
              {finalFilteredList.map(each => (
                <li key={each.id} className="li" style={{listStyle: 'none'}}>
                  <div>
                    <HiDotsVertical
                      className="delete-indivisual-movie-icon"
                      onClick={() => toggleInsideDeleteButton(each.id)}
                    />

                    {activeDeleteId === each.id && v && (
                      <button
                        className="delete-indivisual-movie-button"
                        onClick={() => deleteIndivisualVideo(each)}
                        type="button"
                        style={{marginTop: '40px'}}
                      >
                        Delete
                      </button>
                    )}
                  </div>
                  <Link
                    to={`/trending/${each.title}/${each.id}`}
                    style={{textDecoration: 'none'}}
                  >
                    <div
                      style={{
                        backgroundSize: 'cover',
                        height: '25vh',
                        backgroundPosition: 'center',
                        display: 'flex',
                        justifyContent: 'flex-end',
                        alignItems: 'center',
                        backgroundImage: `url(https://image.tmdb.org/t/p/original/${each.backdropPath})`,
                        color: 'white',
                        borderRadius: '10px',
                        marginBottom: '30px',
                      }}
                      className="sneak-peek-container"
                    >
                      <div
                        className={
                          each.backdropPath
                            ? 'saved-video-content-container'
                            : 'saved-video-content-container2'
                        }
                      >
                        <h4 className="sv-title">{each.title}</h4>
                        <h4 className="sv-title">{each.avgVote.toFixed(1)}</h4>
                        <h4 className="sv-title">
                          {new Date(each.releaseDate).getFullYear()}
                        </h4>
                      </div>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>

            <div className="show-hide-container">
              <div className="hr">
                <hr />
              </div>
              <div style={{display: 'flex', justifyContent: 'center'}}>
                {finalFilteredList.length === savedVideosList.length &&
                finalFilteredList.length !== 3 ? (
                  <button
                    onClick={showLess}
                    type="button"
                    className="show-button"
                  >
                    Show Less
                  </button>
                ) : (
                  <button
                    onClick={showMore}
                    type="button"
                    className="show-button"
                  >
                    Show More
                  </button>
                )}
              </div>

              <div className="hr">
                <hr />
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  )
}

export default SavedVideos
