import {Component} from 'react'
import {Link} from 'react-router-dom'
import Loader from 'react-loader-spinner'
import './index.css'

import Header from '../header/index'

const genresList = [
  {
    genreId: 35,
    genreName: 'Comedy',
  },
  {
    genreId: 9648,
    genreName: 'Mystery',
  },
  {
    genreId: 28,
    genreName: 'Action',
  },
  {
    genreId: 27,
    genreName: 'Horror',
  },
  {
    genreId: 878,
    genreName: 'Sci-Fi',
  },
  {
    genreId: 10762,
    genreName: 'Kids',
  },
]

class Trending extends Component {
  state = {
    allTrendingMovies: [],
    currentPage: 1,
    input: '',
    searchOn: false,
    currentGenre: '',
  }

  componentDidMount() {
    this.getAllTrendingMovies()
  }

  getAllTrendingMovies = async () => {
    const {currentPage, input, currentGenre} = this.state
    const isSearch = input.trim() !== ''
    const endpoint = isSearch ? 'search/movie' : 'discover/movie'

    try {
      const url = `https://thingproxy-760k.onrender.com/fetch/https://api.themoviedb.org/3/${endpoint}?api_key=04c35731a5ee918f014970082a0088b1&page=${currentPage}&query=${input}&with_genres=${currentGenre}`

      const options = {method: 'GET'}
      const response = await fetch(url, options)
      const jsonData = await response.json()

      const formatttedAllTrendingMovies = jsonData.results.map(eachMovie => ({
        originalTitle: eachMovie.original_title,
        overview: eachMovie.overview,
        id: eachMovie.id,
        posterPath: eachMovie.poster_path,
        releaseDate: eachMovie.release_date,
        averageVotes: eachMovie.vote_average,
        backdropPath: eachMovie.backdrop_path,
        title: eachMovie.title,
      }))

      this.setState({allTrendingMovies: formatttedAllTrendingMovies})
    } catch {
      this.setState({allTrendingMovies: ['error']})
    }
  }

  renderAllTrendingMovies = () => {
    const {allTrendingMovies} = this.state

    if (allTrendingMovies.length === 0) {
      return (
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
      )
    }

    if (allTrendingMovies[0] === 'error') {
      return <p>Error fetching movies</p>
    }

    return (
      <ul className="grid-container">
        {allTrendingMovies.map(movie => (
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
                backgroundImage: `url(https://image.tmdb.org/t/p/original/${movie.backdropPath})`,
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
    )
  }

  nextPage = () => {
    this.setState(
      prev => ({currentPage: prev.currentPage + 1}),
      this.getAllTrendingMovies,
    )
  }

  prevPage = () => {
    const {currentPage} = this.state
    if (currentPage > 1) {
      this.setState(
        prev => ({currentPage: prev.currentPage - 1}),
        this.getAllTrendingMovies,
      )
    }
  }

  inputChange = e => {
    this.setState({input: e.target.value}, this.getAllTrendingMovies)
  }

  toggleSearchbar = () => {
    this.setState(prev => ({searchOn: !prev.searchOn}))
  }

  changeGenre = currentGenre1 => {
    this.setState(
      {currentGenre: currentGenre1.genreId},
      this.getAllTrendingMovies,
    )
  }

  render() {
    const {currentPage, input, searchOn, currentGenre} = this.state
    return (
      <>
        <div>
          <Header />

          <div className="trending-query-container">
            <div className="search-section lg-search-container">
              <input
                onChange={this.inputChange}
                value={input}
                placeholder="Search any movie, series, anime of your choice..."
                className="trending-searchbar"
              />
            </div>

            {searchOn && (
              <div className="search-section sm-search-section ts">
                <input
                  onChange={this.inputChange}
                  value={input}
                  placeholder="Search..."
                  className="trending-searchbar tsx"
                />
              </div>
            )}

            <div className="genre-section">
              <div className="genre-div">
                <ul className="genre-container">
                  <li
                    className="indivisual-genre lg-search-button"
                    onClick={this.toggleSearchbar}
                  >
                    <p className="eachGenre">Search</p>
                  </li>
                  {genresList.map(eachGenre => (
                    <li
                      key={eachGenre.genreId}
                      className={
                        eachGenre.genreId === currentGenre
                          ? 'newCss'
                          : 'indivisual-genre'
                      }
                      onClick={() => this.changeGenre(eachGenre)}
                    >
                      <p className="eachGenre">{eachGenre.genreName}</p>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
          <div className="main-movie-content">
            <div>{this.renderAllTrendingMovies()}</div>
          </div>
          <div className="pages-section">
            <button
              className="cool-button"
              type="button"
              onClick={this.prevPage}
            >
              Prev
            </button>
            <div className="page-num">
              <h1 className="currentPage-num">{currentPage}</h1>
            </div>
            <button
              className="cool-button"
              type="button"
              onClick={this.nextPage}
            >
              Next
            </button>
          </div>
        </div>
      </>
    )
  }
}

export default Trending
