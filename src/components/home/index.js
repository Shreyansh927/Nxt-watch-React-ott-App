import {Component} from 'react'
import {Link} from 'react-router-dom'
import {FaPlayCircle, FaArrowCircleRight} from 'react-icons/fa'

import Slider from 'react-slick'

import Header from '../header/index'

import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import './index.css'

class Home extends Component {
  state = {
    carouselMoviesArray: [],
    randomPage: 10,
    carouselDocumentaryArray: [],
    carouselAnimeArray: [],
    carouselTvArray: [],
  }

  componentDidMount() {
    const randomPage = Math.floor(Math.random() * 100)
    this.setState({randomPage}, () => {
      this.getTrendingMoviesData()
      this.getTrendingAnimeData()
      this.getTrendingDocumentaryData()
      this.getTrendingTvData()
    })
  }

  getTrendingMoviesData = async () => {
    const {randomPage} = this.state
    const apiUrl = `https://thingproxy-760k.onrender.com/fetch/https://api.themoviedb.org/3/discover/movie?api_key=04c35731a5ee918f014970082a0088b1&page=${randomPage}`
    try {
      const response = await fetch(apiUrl)
      const jsonData = await response.json()
      const formattedData = jsonData.results
        .filter(each => each.backdrop_path)
        .map(each => ({
          id: each.id,
          title: each.title,
          backdropPath: each.backdrop_path,
          posterPath: each.poster_path,
          originalName: each.original_title,
        }))

      this.setState({carouselMoviesArray: formattedData})
    } catch (error) {
      console.log('Error fetching data', error)
    }
  }

  getTrendingDocumentaryData = async () => {
    const {randomPage} = this.state
    const apiUrl = `https://thingproxy-760k.onrender.com/fetch/https://api.themoviedb.org/3/discover/movie?api_key=04c35731a5ee918f014970082a0088b1&page=${randomPage}&with_genres=99`
    try {
      const response = await fetch(apiUrl)
      const jsonData = await response.json()
      const formattedData = jsonData.results
        .filter(each => each.backdrop_path)
        .map(each => ({
          id: each.id,
          title: each.title,
          backdropPath: each.backdrop_path,
          posterPath: each.poster_path,
          originalName: each.original_title,
        }))

      this.setState({carouselDocumentaryArray: formattedData})
    } catch (error) {
      console.log('Error fetching data', error)
    }
  }

  getTrendingAnimeData = async () => {
    const {randomPage} = this.state
    const apiUrl = `https://thingproxy-760k.onrender.com/fetch/https://api.themoviedb.org/3/discover/movie?api_key=04c35731a5ee918f014970082a0088b1&page=${randomPage}&with_genres=16`
    try {
      const response = await fetch(apiUrl)
      const jsonData = await response.json()
      const formattedData = jsonData.results
        .filter(each => each.backdrop_path)
        .map(each => ({
          id: each.id,
          title: each.title,
          backdropPath: each.backdrop_path,
          posterPath: each.poster_path,
          originalName: each.original_title,
        }))

      this.setState({carouselAnimeArray: formattedData})
    } catch (error) {
      console.log('Error fetching data', error)
    }
  }

  getTrendingTvData = async () => {
    const {randomPage} = this.state
    const apiUrl = `https://thingproxy-760k.onrender.com/fetch/https://api.themoviedb.org/3/discover/movie?api_key=04c35731a5ee918f014970082a0088b1&page=${randomPage}&with_genres=10770`
    try {
      const response = await fetch(apiUrl)
      const jsonData = await response.json()
      const formattedData = jsonData.results
        .filter(each => each.backdrop_path)
        .map(each => ({
          id: each.id,
          title: each.title,
          backdropPath: each.backdrop_path,
          posterPath: each.poster_path,
          originalName: each.original_title,
        }))

      this.setState({carouselTvArray: formattedData})
    } catch (error) {
      console.log('Error fetching data', error)
    }
  }

  renderTrendingMoviesCarousel = () => {
    const {carouselMoviesArray} = this.state

    const settings = {
      dots: true,
      infinite: true,
      speed: 800,
      slidesToShow: 6,
      slidesToScroll: 2,
      autoplay: true,
      autoplaySpeed: 3500,
      pauseOnHover: true,
      arrows: true,
      responsive: [
        {
          breakpoint: 1024,
          settings: {
            slidesToShow: 3,
            slidesToScroll: 2,
          },
        },
        {
          breakpoint: 900,
          settings: {
            slidesToShow: 2,
            slidesToScroll: 2,
          },
        },
        {
          breakpoint: 1024,
          settings: {
            slidesToShow: 3,
            slidesToScroll: 2,
          },
        },
        {
          breakpoint: 600,
          settings: {
            slidesToShow: 2,
            slidesToScroll: 1,
          },
        },
        {
          breakpoint: 400,
          settings: {
            slidesToShow: 1,
            slidesToScroll: 1,
          },
        },
      ],
    }

    return (
      <Slider {...settings} className="slider-wrapper">
        {carouselMoviesArray.map(movie => (
          <Link
            to={`/trending/${movie.title}/${movie.id}`}
            style={{textDecoration: 'none'}}
            key={movie.id}
          >
            <div className="poster-card">
              <img
                src={`https://image.tmdb.org/t/p/w500/${movie.posterPath}`}
                alt={movie.title}
                className="poster-img"
              />
              <div className="poster-card-content">
                <p
                  className="poster-title"
                  style={{marginBottom: '20px', fontSize: '19px'}}
                >
                  {movie.title}
                </p>

                <button
                  style={{cursor: 'pointer'}}
                  type="button"
                  className="colorful-reddish-button"
                >
                  {' '}
                  <FaPlayCircle
                    style={{
                      marginRight: '10px',
                      fontSize: '13px',
                      transform: 'scale(1.2)',
                    }}
                  />
                  Watch Now
                </button>
              </div>
            </div>
          </Link>
        ))}
      </Slider>
    )
  }

  renderTrendingDocumentaryCarousel = () => {
    const {carouselDocumentaryArray} = this.state

    const settings = {
      dots: true,
      infinite: true,
      speed: 800,
      slidesToShow: 6,
      slidesToScroll: 2,
      autoplay: true,
      autoplaySpeed: 3500,
      pauseOnHover: true,
      arrows: true,
      responsive: [
        {
          breakpoint: 1024,
          settings: {
            slidesToShow: 3,
            slidesToScroll: 2,
          },
        },
        {
          breakpoint: 900,
          settings: {
            slidesToShow: 2,
            slidesToScroll: 2,
          },
        },
        {
          breakpoint: 1024,
          settings: {
            slidesToShow: 3,
            slidesToScroll: 2,
          },
        },
        {
          breakpoint: 600,
          settings: {
            slidesToShow: 2,
            slidesToScroll: 1,
          },
        },
        {
          breakpoint: 400,
          settings: {
            slidesToShow: 1,
            slidesToScroll: 1,
          },
        },
      ],
    }

    return (
      <Slider {...settings} className="slider-wrapper">
        {carouselDocumentaryArray.map(movie => (
          <Link
            to={`/trending/${movie.title}/${movie.id}`}
            style={{textDecoration: 'none'}}
            key={movie.id}
          >
            <div className="poster-card">
              <img
                src={`https://image.tmdb.org/t/p/w500/${movie.posterPath}`}
                alt={movie.title}
                className="poster-img"
              />
              <div className="poster-card-content">
                <p
                  className="poster-title"
                  style={{marginBottom: '20px', fontSize: '19px'}}
                >
                  {movie.title}
                </p>

                <button
                  style={{cursor: 'pointer'}}
                  type="button"
                  className="colorful-reddish-button"
                >
                  {' '}
                  <FaPlayCircle
                    style={{
                      marginRight: '10px',
                      fontSize: '13px',
                      transform: 'scale(1.2)',
                    }}
                  />
                  Watch Now
                </button>
              </div>
            </div>
          </Link>
        ))}
      </Slider>
    )
  }

  renderTrendingAnimeCarousel = () => {
    const {carouselAnimeArray} = this.state

    const settings = {
      dots: true,
      infinite: true,
      speed: 800,
      slidesToShow: 6,
      slidesToScroll: 2,
      autoplay: true,
      autoplaySpeed: 3500,
      pauseOnHover: true,
      arrows: true,
      responsive: [
        {
          breakpoint: 1024,
          settings: {
            slidesToShow: 3,
            slidesToScroll: 2,
          },
        },
        {
          breakpoint: 900,
          settings: {
            slidesToShow: 2,
            slidesToScroll: 2,
          },
        },
        {
          breakpoint: 1024,
          settings: {
            slidesToShow: 3,
            slidesToScroll: 2,
          },
        },
        {
          breakpoint: 600,
          settings: {
            slidesToShow: 2,
            slidesToScroll: 1,
          },
        },
        {
          breakpoint: 400,
          settings: {
            slidesToShow: 1,
            slidesToScroll: 1,
          },
        },
      ],
    }

    return (
      <Slider {...settings} className="slider-wrapper">
        {carouselAnimeArray.map(movie => (
          <Link
            to={`/trending/${movie.title}/${movie.id}`}
            style={{textDecoration: 'none'}}
            key={movie.id}
          >
            <div className="poster-card">
              <img
                src={`https://image.tmdb.org/t/p/w500/${movie.posterPath}`}
                alt={movie.title}
                className="poster-img"
              />
              <div className="poster-card-content">
                <p
                  className="poster-title"
                  style={{marginBottom: '20px', fontSize: '19px'}}
                >
                  {movie.title}
                </p>

                <button
                  style={{cursor: 'pointer'}}
                  type="button"
                  className="colorful-reddish-button"
                >
                  {' '}
                  <FaPlayCircle
                    style={{
                      marginRight: '10px',
                      fontSize: '13px',
                      transform: 'scale(1.2)',
                    }}
                  />
                  Watch Now
                </button>
              </div>
            </div>
          </Link>
        ))}
      </Slider>
    )
  }

  renderTrendingTvsCarousel = () => {
    const {carouselTvArray} = this.state

    const settings = {
      dots: true,
      infinite: true,
      speed: 800,
      slidesToShow: 6,
      slidesToScroll: 2,
      autoplay: true,
      autoplaySpeed: 3500,
      pauseOnHover: true,
      arrows: true,
      responsive: [
        {
          breakpoint: 1024,
          settings: {
            slidesToShow: 3,
            slidesToScroll: 2,
          },
        },
        {
          breakpoint: 900,
          settings: {
            slidesToShow: 2,
            slidesToScroll: 2,
          },
        },
        {
          breakpoint: 1024,
          settings: {
            slidesToShow: 3,
            slidesToScroll: 2,
          },
        },
        {
          breakpoint: 600,
          settings: {
            slidesToShow: 2,
            slidesToScroll: 1,
          },
        },
        {
          breakpoint: 400,
          settings: {
            slidesToShow: 1,
            slidesToScroll: 1,
          },
        },
      ],
    }

    return (
      <Slider {...settings} className="slider-wrapper">
        {carouselTvArray.map(movie => (
          <Link
            to={`/trending/${movie.title}/${movie.id}`}
            style={{textDecoration: 'none'}}
            key={movie.id}
          >
            <div className="poster-card">
              <img
                src={`https://image.tmdb.org/t/p/w500/${movie.posterPath}`}
                alt={movie.title}
                className="poster-img"
              />
              <div className="poster-card-content">
                <p
                  className="poster-title"
                  style={{marginBottom: '20px', fontSize: '19px'}}
                >
                  {movie.title}
                </p>

                <button
                  style={{cursor: 'pointer'}}
                  type="button"
                  className="colorful-reddish-button"
                >
                  {' '}
                  <FaPlayCircle
                    style={{
                      marginRight: '10px',
                      fontSize: '13px',
                      transform: 'scale(1.2)',
                    }}
                  />
                  Watch Now
                </button>
              </div>
            </div>
          </Link>
        ))}
      </Slider>
    )
  }

  render() {
    return (
      <>
        <Header />
        <div className="home-page">
          <div className="carousel-section" style={{marginBottom: '50px'}}>
            <div className="trending-text">
              <h1 className="trending-content-text">Trending Movies</h1>
              <Link to="/trending" style={{textDecoration: 'none'}}>
                <h1 type="button">
                  <FaArrowCircleRight className="view-all-button" />
                </h1>
              </Link>
            </div>
            {this.renderTrendingMoviesCarousel()}
          </div>
          <div className="carousel-section" style={{marginBottom: '50px'}}>
            <div className="trending-text">
              <h1 className="trending-content-text">Trending Documentries</h1>
              <Link to="/documentary" style={{textDecoration: 'none'}}>
                <h1 type="button">
                  <FaArrowCircleRight className="view-all-button" />
                </h1>
              </Link>
            </div>
            {this.renderTrendingDocumentaryCarousel()}
          </div>
          <div className="carousel-section" style={{marginBottom: '50px'}}>
            <div className="trending-text">
              <h1 className="trending-content-text">Trending Animes</h1>
              <Link to="/anime" style={{textDecoration: 'none'}}>
                <h1 type="button">
                  <FaArrowCircleRight />
                </h1>
              </Link>
            </div>
            {this.renderTrendingAnimeCarousel()}
          </div>
          <div className="carousel-section" style={{marginBottom: '50px'}}>
            <div className="trending-text">
              <h1 className="trending-content-text">Trending TV Movies</h1>
              <Link to="/tv" style={{textDecoration: 'none'}}>
                <h1 type="button">
                  <FaArrowCircleRight className="view-all-button" />
                </h1>
              </Link>
            </div>
            {this.renderTrendingTvsCarousel()}
          </div>
        </div>
      </>
    )
  }
}

export default Home
