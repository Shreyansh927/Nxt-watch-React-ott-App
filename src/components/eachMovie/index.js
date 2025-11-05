import {useState, useEffect, useContext} from 'react'
import Loader from 'react-loader-spinner'
import {MdRestore, MdCancel} from 'react-icons/md'
import axios from 'axios'
import {Link, useParams} from 'react-router-dom'
import {FaPlay, FaPause} from 'react-icons/fa'
import {useSpeechSynthesis} from 'react-speech-kit'
import SavedVideosContext from '../../createContext'
import Header from '../header'

import './index.css'

const languageArray = [
  {
    lan: 'Hindi',
    id: 'Hindi',
  },
  {
    lan: 'Sanskrit',
    id: 'SANSKRIT',
  },
  {
    lan: 'English',
    id: 'ENGLISH',
  },
  {
    lan: 'Marathi',
    id: 'MARATHI',
  },
  {
    lan: 'Telgu',
    id: 'TELGU',
  },
  {
    lan: 'Tamil',
    id: 'TAMIL',
  },
  {
    lan: 'French',
    id: 'FRENCH',
  },
]

const EachMovie = () => {
  const {title, id} = useParams()
  const {addVideo, removeVideo} = useContext(SavedVideosContext)
  const {speak, cancel} = useSpeechSynthesis()
  const [currentLanguage, setCurrentLanguage] = useState(languageArray[2].id)
  const [movieInfo, setMovieInfo] = useState({})
  const [movieTrailer, setMovieTrailer] = useState({})
  const [tmdbMovieInfo, setTmdbMovieInfo] = useState({})
  const [suggestedMovies, setSuggestedMovies] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(false)
  const [isVideoAdded, setIsVideoAdded] = useState(false)
  const [summary, setSummary] = useState('')
  const [selectedVoice, setSelectedVoice] = useState('')
  const [paused, setPaused] = useState(false)
  const [fetchSummary, setFetchSummary] = useState(false)
  const [similarMovies, setSimilarMovies] = useState([])

  // Fetch OMDB info
  const getFullMovieInfo = async () => {
    try {
      const movieApi = `https://www.omdbapi.com/?t=${title}&apikey=14dc6453`
      const response = await fetch(movieApi)
      if (!response.ok) throw new Error('Failed to fetch movie info')

      const jsonData = await response.json()
      const formattedMovieData = {
        title: jsonData.Title,
        poster: jsonData.Poster,
        year: jsonData.Year,
        genre: jsonData.Genre,
        plot: jsonData.Plot,
        imdbID: jsonData.imdbID,
        released: jsonData.Released,
        runtime: jsonData.Runtime,
        imdbRating: jsonData.imdbRating,
        boxOffice: jsonData.BoxOffice,
        country: jsonData.Country,
        language: jsonData.Language,
        director: jsonData.Director,
        actors: jsonData.Actors,
        rated: jsonData.Rated,
        writer: jsonData.Writer,
      }
      setMovieInfo(formattedMovieData)
      setIsLoading(false)
    } catch (err) {
      console.error('Error fetching movie info:', err)
      setError(true)
      setIsLoading(false)
    }
  }

  // Fetch trailer
  const getMovieTrailer = async () => {
    try {
      const trailerApi = `https://api.themoviedb.org/3/movie/${id}/videos?api_key=04c35731a5ee918f014970082a0088b1`
      const response = await fetch(trailerApi)
      const jsonData = await response.json()
      setMovieTrailer({key: jsonData.results?.[0]?.key})
    } catch {
      console.log('error fetching trailer')
    }
  }

  // Fetch TMDB info
  const getTmdbMovieInfo = async () => {
    try {
      const tmdbApi = `https://api.themoviedb.org/3/search/movie?api_key=04c35731a5ee918f014970082a0088b1&page=1&query=${title}`
      const response = await fetch(tmdbApi)
      const jsonData = await response.json()
      const formatted = {
        id: jsonData.results[0].id,
        originalTitle: jsonData.results[0].original_title,
        posterPath: jsonData.results[0].poster_path,
        backdropPath: jsonData.results[0].backdrop_path,
        avgVote: jsonData.results[0].vote_average,
        releaseDate: jsonData.results[0].release_date,
        title: jsonData.results[0].title,
      }
      setTmdbMovieInfo(formatted)
    } catch {
      console.log('error fetching tmdb info')
    }
  }

  // Suggested movies
  const getSuggestedMovies = async () => {
    try {
      const api = `https://api.themoviedb.org/3/search/movie?api_key=04c35731a5ee918f014970082a0088b1&query=${title}`
      const response = await fetch(api)
      const jsonData = await response.json()
      const formatted = jsonData.results.map(each => ({
        originalTitle: each.original_title,
        overview: each.overview,
        id: each.id,
        posterPath: each.poster_path,
        releaseDate: each.release_date,
        averageVotes: each.vote_average,
        backdropPath: each.backdrop_path,
        title: each.title,
      }))
      setSuggestedMovies(formatted)
    } catch {
      console.log('error fetching suggested movies')
    }
  }

  // Movie Highlights (Gemini)
  const getMovieHighlights = async () => {
    try {
      const response = await axios({
        url: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-lite:generateContent?key=AIzaSyBE9xbENPJURmat3usnhN8TNeGvioRSQeY',
        method: 'post',
        data: {
          contents: [
            {
              parts: [{text: `full summary of ${title} in ${currentLanguage}`}],
            },
          ],
        },
      })
      const ans = response.data.candidates[0].content.parts[0].text
      const ans2 = ans.split('**').map(item => item.replaceAll('*', ''))
      setSummary(ans2.join(' '))
      console.log(ans2)
    } catch (err) {
      console.error('Error during API call:', err)
    }
  }

  const extractArrayFromText = text => {
    const match = text.match(/\[([\s\S]*?)\]/)
    if (match) {
      const parsedArray = JSON.parse(match[0])
      console.log(parsedArray)
      setSimilarMovies(parsedArray)
    }
  }

  // get simlar movies

  const geminiResponse = async () => {
    try {
      // maintain conversation history properly
      const response = await axios({
        url: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=AIzaSyBE9xbENPJURmat3usnhN8TNeGvioRSQeY',
        method: 'post',
        data: {
          contents: [
            {
              parts: [
                {
                  text: `List 10 movies similar to "${title}" in a JSON array of objects with keys: originalTitle, overview, id, posterPath, releaseDate, averageVotes, backdropPath, title, Poster.`,
                },
              ],
            },
          ],
        },
      })
      const ans2 = response.data.candidates[0].content.parts[0].text
      console.log(ans2)
      extractArrayFromText(ans2)
    } catch (err) {
      console.error('Error fetching Gemini response:', err)
    }
  }
  const getMovieHighlights2 = async e => {
    try {
      const response = await axios({
        url: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-lite:generateContent?key=AIzaSyBE9xbENPJURmat3usnhN8TNeGvioRSQeY',
        method: 'post',
        data: {
          contents: [
            {
              parts: [{text: `provide summary of ${title} in ${e.lan}`}],
            },
          ],
        },
      })
      const ans = response.data.candidates[0].content.parts[0].text.replaceAll(
        '**',
        '',
      )

      setSummary(ans)
    } catch (err) {
      console.error('Error during API call:', err)
    }
  }

  // Effects
  useEffect(() => {
    getFullMovieInfo()
    getMovieTrailer()
    getTmdbMovieInfo()
    getSuggestedMovies()
    geminiResponse()

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    window.speechSynthesis.cancel()
  }, [])

  useEffect(() => {
    const loadVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices()

      // Select Hindi voice if available
      const hindi = availableVoices.find(v => v.lang === 'hi-IN')
      setSelectedVoice(hindi || availableVoices[0])
    }

    loadVoices()
    window.speechSynthesis.onvoiceschanged = loadVoices
  }, [])

  // Save/remove video
  const addNewVideo = () => {
    addVideo(tmdbMovieInfo)
    setIsVideoAdded(prev => !prev)
  }

  const removeSelectedVideo = () => {
    removeVideo(tmdbMovieInfo)
    setIsVideoAdded(prev => !prev)
  }

  const pause = () => {
    setPaused(!paused)
  }

  const func = () => {
    window.speechSynthesis.resume()
    speak({text: summary, voice: selectedVoice})
  }

  const stopSpeaker = () => {
    cancel()
  }

  const changeLanguage = each => {
    setCurrentLanguage(each.id)
    setSummary('')
    cancel()
    setPaused(false)
    getMovieHighlights2(each) // fetch new summary
  }

  const fetching = () => {
    setFetchSummary(true)
    getMovieHighlights()
  }

  return (
    <div className="nav-div">
      <div className="sticky-navbar">
        <Header />
      </div>

      <div>
        {isLoading && (
          <div className="loading-container">
            <div className="loader-container" data-testid="loader">
              <Loader
                type="BallTriangle"
                color="black"
                height="100"
                width="100"
              />
            </div>
          </div>
        )}

        {error && <p>Something went wrong. Please try again.</p>}

        {!isLoading && !error && (
          <>
            <div className="bg-container">
              <div className="video-container">
                {movieInfo.imdbID ? (
                  <>
                    <iframe
                      src={`https://2embed.cc/embed/${movieInfo.imdbID}`}
                      allowFullScreen
                      frameBorder="0"
                      title="Movie Video"
                      allow="autoplay; encrypted-media"
                    />
                  </>
                ) : (
                  <>
                    <iframe
                      src={`https://www.youtube.com/embed/${movieTrailer.key}`}
                      allowFullScreen
                      frameBorder="0"
                      title="Trailer"
                      allow="autoplay; encrypted-media"
                      height="400px"
                      width="500px"
                    />
                  </>
                )}
              </div>

              <div className="movie-info-container">
                {/* Movie details */}

                <div className="movie-info-1">
                  <div className="heading-zone">
                    <h1 className="title" style={{fontWeight: 'bold'}}>
                      {movieInfo.title}
                    </h1>
                  </div>

                  <div className="date-zone">
                    <h1 className="released" style={{fontWeight: 'bold'}}>
                      {movieInfo.released}
                    </h1>
                  </div>
                </div>

                <div className="movie-info-1">
                  <div className="heading-zone">
                    <h1 className="title" style={{fontWeight: 'bold'}}>
                      Highlights Language
                    </h1>
                  </div>

                  {fetchSummary ? (
                    <>
                      {summary ? (
                        <div className="movie-info-1">
                          <div className="heading-zone">
                            <h1 className="title" style={{fontWeight: 'bold'}}>
                              Highlights
                            </h1>
                          </div>
                          {paused && (
                            <div className="loader-container">
                              <Loader
                                type="oval"
                                color="black"
                                height="20"
                                width="90"
                              />
                            </div>
                          )}
                          <div
                            className="date-zone"
                            role="button"
                            tabIndex={0}
                            onClick={pause}
                          >
                            {paused ? (
                              <>
                                <div className="play-cancel">
                                  <FaPause
                                    onClick={() =>
                                      window.speechSynthesis.pause()
                                    }
                                  />
                                  <MdCancel onClick={stopSpeaker} />
                                </div>
                              </>
                            ) : (
                              <>
                                <FaPlay onClick={func} />
                              </>
                            )}
                          </div>
                        </div>
                      ) : (
                        <div className="loader-container">
                          <Loader
                            type="ThreeDots"
                            color="black"
                            height="50"
                            width="50"
                          />
                        </div>
                      )}
                    </>
                  ) : (
                    <>
                      {' '}
                      <button type="button" onClick={fetching}>
                        Set
                      </button>
                    </>
                  )}

                  <div className="date-zone">
                    <select
                      value={currentLanguage}
                      onChange={e => {
                        const selected = languageArray.find(
                          l => l.id === e.target.value,
                        )
                        changeLanguage(selected)
                      }}
                    >
                      {languageArray.map(each => (
                        <option
                          onClick={() => changeLanguage(each)}
                          key={each.id}
                          value={each.id}
                        >
                          {each.lan}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="hr-line-zone">
                  <hr className="hr" />
                </div>

                <div className="movie-info-2">
                  <div className="movie-info-2-sec1">
                    <h1 className="duration">{movieInfo.runtime}</h1>
                    <h3 className="h3-1">Duration</h3>
                  </div>
                  <div className="movie-info-2-sec1">
                    <h1 className="imdbRating">{movieInfo.imdbRating}</h1>
                    <h3 className="h3-1">IMDB Rating</h3>
                  </div>
                  <div className="movie-info-2-sec1">
                    <h1 className="runtime">{movieInfo.boxOffice}</h1>
                    <h3 className="h3-1">Box Office</h3>
                  </div>
                </div>

                <div className="hr-line-zone">
                  <hr className="hr" />
                </div>

                <div className="movie-info-2">
                  <div className="movie-info-2-sec1">
                    <h1 className="duration" style={{textAlign: 'start'}}>
                      {movieInfo.country}
                    </h1>
                    <h3 className="h3-1">Country</h3>
                  </div>
                  <div className="movie-info-2-sec1">
                    <h1 className="imdbRating">{movieInfo.language}</h1>
                    <h3 className="h3-1">Language</h3>
                  </div>
                </div>

                <div className="hr-line-zone">
                  <hr className="hr" />
                </div>

                <div className="movie-info-2">
                  <div className="movie-info-2-sec1">
                    <h1 className="imdbRating">{movieInfo.genre}</h1>
                    <h3 className="h3-1">Genre</h3>
                  </div>
                  <div className="movie-info-2-sec1">
                    <h1 className="duration">{movieInfo.rated}</h1>
                    <h3 className="h3-1">Rated</h3>
                  </div>
                </div>

                <div className="hr-line-zone">
                  <hr className="hr" />
                </div>

                <div className="movie-info-2">
                  <div className="movie-info-2-sec1">
                    <h1 className="imdbRating">{movieInfo.director}</h1>
                    <h3 className="h3-1">Director</h3>
                  </div>
                </div>

                <div className="hr-line-zone">
                  <hr className="hr" />
                </div>

                <div className="movie-info-2">
                  <div className="movie-info-2-sec1">
                    <h1 className="duration actors">{movieInfo.actors}</h1>
                    <h3 className="h3-1">Actors</h3>
                  </div>
                </div>

                <div className="hr-line-zone">
                  <hr className="hr" />
                </div>

                <div className="movie-info-2">
                  <div className="movie-info-2-sec1">
                    <h1 className="duration actors">{movieInfo.writer}</h1>
                    <h3 className="h3-1">Writer</h3>
                  </div>
                </div>

                <div className="hr-line-zone">
                  <hr className="hr" />
                </div>

                <div className="movie-info-2">
                  <div className="movie-info-2-sec1">
                    <h1 className="duration actors">{movieInfo.plot}</h1>
                    <h3 className="h3-1">Plot</h3>
                  </div>
                </div>
              </div>
            </div>

            <div className="save-video-button-container">
              {isVideoAdded ? (
                <button
                  type="button"
                  className="saved-video-button"
                  onClick={removeSelectedVideo}
                >
                  <MdRestore /> remove video
                </button>
              ) : (
                <button
                  type="button"
                  className="saved-video-button"
                  onClick={addNewVideo}
                >
                  <MdRestore
                    style={{
                      fontWeight: 'bold',
                      fontSize: '19px',
                      marginRight: '10px',
                    }}
                  />
                  Save Movie
                </button>
              )}
            </div>

            <div className="search-suggestion-container">
              <ul className="suggested-movies-container">
                {similarMovies.map(movie => (
                  <Link
                    key={movie.id}
                    to={`/trending/${movie.title}/${movie.id}`}
                    style={{textDecoration: 'none', listStyle: 'none'}}
                  >
                    <li
                      className="indivisual-movie-container"
                      style={{
                        marginBottom: '20px',
                        listStyle: 'none',
                        backgroundImage: `url(
                          'https://m.media-amazon.com/images/M/MV5BMmFiZGZjMmEtMTA0Ni00MzA2LTljMTYtZGI2MGJmZWYzZTQ2XkEyXkFqcGc@._V1_SX300.jpg',
                        )`,
                        backgroundSize: 'cover',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'flex-end',
                        backgroundPosition: 'center',
                        padding: '10px 0px',
                        borderRadius: '10px',
                        color: 'white',
                      }}
                    >
                      <div className="sm-p">
                        <div className="sm-div">
                          <h4 className="movie-title">{movie.originalTitle}</h4>
                        </div>

                        <div className="sm-div">
                          <h4>{movie.averageVotes.toFixed(1)}</h4>
                        </div>
                        <div className="sm-div">
                          <h4>{movie.releaseDate}</h4>
                        </div>
                      </div>
                    </li>
                  </Link>
                ))}
              </ul>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default EachMovie
