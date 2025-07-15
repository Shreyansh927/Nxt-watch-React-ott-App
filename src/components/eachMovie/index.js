import {Component} from 'react'
import {MdRestore} from 'react-icons/md'
import {Link} from 'react-router-dom'
import Loader from 'react-loader-spinner'
import SavedVideosContext from '../../createContext'

import Header from '../header'

import './index.css'

class EachMovie extends Component {
  state = {
    movieInfo: {},
    movieTrailer: {},
    tmdbMovieInfo: {},
    suggestedMovies: [],
    isLoading: true,
    error: false,
    toggleDescription: true,
    isVideoAdded: false,
  }

  componentDidMount() {
    this.getFullMovieInfo()
    this.getSuggestedMovies()
    this.getMovieTrailer()
    this.getTmdbMovieInfo()
  }

  componentDidUpdate(prevProps) {
    const {match} = this.props
    const {title} = match.params

    if (prevProps.match.params.title !== title) {
      this.getFullMovieInfo()
      this.getMovieTrailer()
    }
  }

  toggleMovieInfo = () => {
    this.setState(prevState => ({
      toggleDescription: !prevState.toggleDescription,
    }))
  }

  getMovieTrailer = async () => {
    const {match} = this.props
    const {params} = match
    const {id} = params

    const trailerApi = `https://api.themoviedb.org/3/movie/${id}/videos?api_key=04c35731a5ee918f014970082a0088b1`

    try {
      const options = {
        method: 'GET',
      }
      const response = await fetch(trailerApi, options)
      const jsonData = await response.json()
      const formattedMovieTrailerData = {
        key: jsonData.results[0].key,
      }

      this.setState({movieTrailer: formattedMovieTrailerData})
    } catch {
      console.log('error')
    }
  }

  getTmdbMovieInfo = async () => {
    const {match} = this.props
    const {params} = match
    const {title} = params

    const tmdbApi = `https://api.themoviedb.org/3/search/movie?api_key=04c35731a5ee918f014970082a0088b1&page=1&query=${title}`
    const options = {
      method: 'GET',
    }

    try {
      const response = await fetch(tmdbApi, options)
      const jsonData = await response.json()
      const formattedTmdbApiData = {
        id: jsonData.results[0].id,
        originalTitle: jsonData.results[0].original_title,
        posterPath: jsonData.results[0].poster_path,
        backdropPath: jsonData.results[0].backdrop_path,
        avgVote: jsonData.results[0].vote_average,
        releaseDate: jsonData.results[0].release_date,
        title: jsonData.results[0].title,
      }
      this.setState({tmdbMovieInfo: formattedTmdbApiData})
    } catch {
      console.log('error')
    }
  }

  getFullMovieInfo = async () => {
    const {match} = this.props
    const {params} = match
    const {title} = params

    const movieApi = `https://www.omdbapi.com/?t=${title}&apikey=14dc6453`

    try {
      const response = await fetch(movieApi, {
        method: 'GET',
      })

      if (!response.ok) {
        throw new Error('Failed to fetch')
      }

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

      this.setState({movieInfo: formattedMovieData, isLoading: false})
    } catch (error) {
      console.error('Error fetching movie info:', error)
      this.setState({error: true, isLoading: false})
    }
  }

  getSuggestedMovies = async () => {
    const {match} = this.props
    const {params} = match
    const {title} = params

    const suggestedMoviesApi = `https://api.themoviedb.org/3/search/movie?api_key=04c35731a5ee918f014970082a0088b1&query=${title}`

    try {
      const response = await fetch(suggestedMoviesApi)
      const jsonData = await response.json()
      const formattedSuggestedMovieData = jsonData.results.map(each => ({
        originalTitle: each.original_title,
        overview: each.overview,
        id: each.id,
        posterPath: each.poster_path,
        releaseDate: each.release_date,
        averageVotes: each.vote_average,
        backdropPath: each.backdrop_path,
        title: each.title,
      }))
      this.setState({suggestedMovies: formattedSuggestedMovieData})
    } catch {
      console.log('error')
    }
  }

  render() {
    const {
      movieInfo,
      isLoading,
      error,
      toggleDescription,
      suggestedMovies,
      movieTrailer,
      isVideoAdded,
      tmdbMovieInfo,
    } = this.state

    return (
      <SavedVideosContext.Consumer>
        {value => {
          const {addVideo, removeVideo} = value

          const addNewVideo = () => {
            addVideo(tmdbMovieInfo)
            this.setState(prev => ({isVideoAdded: !prev.isVideoAdded}))
          }

          const removeSelectedVideo = () => {
            removeVideo(tmdbMovieInfo)
            this.setState(prev => ({isVideoAdded: !prev.isVideoAdded}))
          }
          return (
            <>
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
                            <iframe
                              src={`https://vidsrc.xyz/embed/${movieInfo.imdbID}`}
                              allowFullScreen
                              frameBorder="0"
                              title="Movie Video"
                              allow="autoplay; encrypted-media"
                            />
                          ) : (
                            <iframe
                              src={`https://www.youtube.com/embed/${movieTrailer.key}`}
                              allowFullScreen
                              frameBorder="0"
                              title="Trailer"
                              allow="autoplay; encrypted-media"
                              height="400px"
                              width="500px"
                            />
                          )}
                        </div>

                        {toggleDescription && (
                          <div className="movie-info-container">
                            <div className="movie-info-1">
                              <div className="heading-zone">
                                <h1
                                  className="title"
                                  style={{fontWeight: 'bold'}}
                                >
                                  {movieInfo.title}
                                </h1>
                              </div>
                              <div className="date-zone">
                                <h1
                                  className="released"
                                  style={{fontWeight: 'bold'}}
                                >
                                  {movieInfo.released}
                                </h1>
                              </div>
                            </div>
                            <div className="hr-line-zone">
                              <hr className="hr" />
                            </div>

                            <div className="movie-info-2">
                              <div className="movie-info-2-sec1">
                                <h1 className="duration">
                                  {movieInfo.runtime}
                                </h1>
                                <h3 className="h3-1">Duration</h3>
                              </div>
                              <div className="movie-info-2-sec1">
                                <h1 className="imdbRating">
                                  {movieInfo.imdbRating}
                                </h1>
                                <h3 className="h3-1">IMDB Rating</h3>
                              </div>
                              <div className="movie-info-2-sec1">
                                <h1 className="runtime">
                                  {movieInfo.boxOffice}
                                </h1>
                                <h3 className="h3-1">Box Office</h3>
                              </div>
                            </div>

                            <div className="hr-line-zone">
                              <hr className="hr" />
                            </div>

                            <div className="movie-info-2">
                              <div className="movie-info-2-sec1">
                                <h1
                                  className="duration"
                                  style={{textAlign: 'start'}}
                                >
                                  {movieInfo.country}
                                </h1>
                                <h3 className="h3-1">Country</h3>
                              </div>
                              <div className="movie-info-2-sec1">
                                <h1 className="imdbRating">
                                  {movieInfo.language}
                                </h1>
                                <h3 className="h3-1">Language</h3>
                              </div>
                            </div>

                            <div className="hr-line-zone">
                              <hr className="hr" />
                            </div>

                            <div className="movie-info-2">
                              <div className="movie-info-2-sec1">
                                <h1 className="imdbRating">
                                  {movieInfo.genre}
                                </h1>
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
                                <h1 className="imdbRating">
                                  {movieInfo.director}
                                </h1>
                                <h3 className="h3-1">Director</h3>
                              </div>
                            </div>

                            <div className="hr-line-zone">
                              <hr className="hr" />
                            </div>

                            <div className="movie-info-2">
                              <div className="movie-info-2-sec1">
                                <h1 className="duration actors">
                                  {movieInfo.actors}
                                </h1>
                                <h3 className="h3-1 ">Actors</h3>
                              </div>
                            </div>

                            <div className="hr-line-zone">
                              <hr className="hr" />
                            </div>

                            <div className="movie-info-2">
                              <div className="movie-info-2-sec1">
                                <h1 className="duration actors">
                                  {movieInfo.writer}
                                </h1>
                                <h3 className="h3-1 ">Writter</h3>
                              </div>
                            </div>

                            <div className="hr-line-zone">
                              <hr className="hr" />
                            </div>

                            <div className="movie-info-2">
                              <div className="movie-info-2-sec1">
                                <h1 className="duration actors">
                                  {movieInfo.plot}
                                </h1>
                                <h3 className="h3-1 ">Plot</h3>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                      <div className="save-video-button-container">
                        {isVideoAdded ? (
                          <button
                            type="button"
                            className="saved-video-button"
                            onClick={removeSelectedVideo}
                          >
                            <MdRestore />
                            remove video{' '}
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
                            Save Movie{' '}
                          </button>
                        )}
                      </div>

                      <div className="search-suggestion-container">
                        <ul className="suggested-movies-container">
                          {suggestedMovies.map(eachMovie => (
                            <Link
                              key={eachMovie.id}
                              to={`/trending/${eachMovie.title}/${eachMovie.id}`}
                              style={{textDecoration: 'none'}}
                            >
                              <li
                                className="indivisual-movie-container"
                                style={{
                                  marginBottom: '20px',
                                  listStyle: 'none',
                                  backgroundImage: `url(https://image.tmdb.org/t/p/original/${eachMovie.backdropPath})`,
                                  backgroundSize: 'cover',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'flex-end',
                                  backgroundPosition: 'center',
                                  padding: '30px 0px',
                                  borderRadius: '10px',
                                  color: 'white',
                                }}
                              >
                                <div className="sm-p">
                                  <div className="sm-div">
                                    <h4 className="movie-title">
                                      {eachMovie.originalTitle}
                                    </h4>
                                  </div>

                                  <div className="sm-div">
                                    <h4>{eachMovie.averageVotes}</h4>
                                  </div>
                                  <div className="sm-div">
                                    <h4>{eachMovie.releaseDate}</h4>
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
            </>
          )
        }}
      </SavedVideosContext.Consumer>
    )
  }
}

export default EachMovie
