import {Component} from 'react'
import {Redirect} from 'react-router-dom'
import Cookies from 'js-cookie'
import './index.css'

class Login extends Component {
  state = {
    isPassordVisible: false,
    username: '',
    password: '',
    errorMessage: false,
  }

  toggleVisible = () => {
    this.setState(prev => ({isPassordVisible: !prev.isPassordVisible}))
  }

  changeName = event => {
    this.setState({username: event.target.value})
  }

  changePassword = event => {
    this.setState({password: event.target.value})
  }

  loginSuccess = jwtToken => {
    const {history} = this.props
    Cookies.set('jwt_token', jwtToken, {expires: 30})
    history.replace('/home')
  }

  submitUserData = async e => {
    e.preventDefault()
    const {username, password} = this.state
    const userDetails = {username, password}
    const url = 'https://apis.ccbp.in/login'
    const options = {
      method: 'POST',
      body: JSON.stringify(userDetails),
    }

    try {
      const response = await fetch(url, options)
      const data = await response.json()

      if (response.ok === true) {
        this.loginSuccess(data.jwt_token)
        this.setState({errorMessage: false})
      } else {
        this.setState({errorMessage: true})
      }
    } catch {
      this.setState({errorMessage: true})
    }
  }

  render() {
    const {isPassordVisible, username, password, errorMessage} = this.state
    const getc = Cookies.get('jwt_token')
    if (getc !== undefined) {
      return <Redirect to="/home" />
    }
    return (
      <>
        <div className="main-login-container">
          <div className="big-login-image-container">
            <img
              src="https://i.gifer.com/AuEx.gif"
              alt="bigImage"
              className="big-login-image"
            />
          </div>
          <div className="login-container">
            <div className="login-page">
              <div className="logo-container">
                <img
                  src="https://assets.ccbp.in/frontend/react-js/nxt-watch-logo-light-theme-img.png"
                  alt="light"
                  className="logo"
                />
              </div>
              <div>
                <form onSubmit={this.submitUserData}>
                  <div className="name-field">
                    <label htmlFor="username" className="label-name">
                      Username
                    </label>
                    <br />
                    <input
                      type="text"
                      id="username"
                      placeholder="Enter your name..."
                      className="name-input"
                      value={username}
                      onChange={this.changeName}
                      required
                    />
                  </div>

                  <div className="password-field">
                    <label htmlFor="password" className="label-name">
                      Password
                    </label>
                    <br />
                    <input
                      type={isPassordVisible ? 'text' : 'password'}
                      id="password"
                      placeholder="Enter your password..."
                      className="name-input"
                      value={password}
                      onChange={this.changePassword}
                      required
                    />
                  </div>
                  <div className="show-passowrd-container">
                    <input type="checkbox" id="show" />
                    <label
                      onClick={this.toggleVisible}
                      htmlFor="show"
                      className="label-name"
                    >
                      {' '}
                      Show Password
                    </label>
                  </div>
                  <div className="login-button-container">
                    <button type="submit" className="login-button">
                      Login
                    </button>
                  </div>
                  {errorMessage && (
                    <p className="error-message">*Error in the Data*</p>
                  )}
                </form>
              </div>
            </div>
          </div>
        </div>
      </>
    )
  }
}
export default Login
