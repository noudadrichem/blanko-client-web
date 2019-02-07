import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'

import { login, fetchProjects } from '../../actions'

// Styles
import './Login.scss'

class Login extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      username: '',
      password: '',
      message: '',
      success: false,
      forgotPassword: false
    }
  }

  login = () => {
    const { login, fetchProjects, history } = this.props
    const { success, username, password } = this.state

    const userBody = {
      username,
      password
    }


    login(userBody)
      .then(({ payload }) => {
        this.setState({
          success: payload.success
        }, () => {
          if (success) {
            window.localStorage.setItem('USER_TOK', payload.token)
            setTimeout(() => {
              fetchProjects()
              history.push('/')
            }, 1100)
          } else {
            this.setState({
              message: payload.message
            })
          }
        })
      })
  }

  onEnter = (e) => {
    const { username, password } = this.state
    if (e.key === 'Enter' && username !== '' && password !== '') {
      this.login()
    }
  }

  onType = (e) => {
    this.setState({ [e.target.name]: e.target.value })
  }

  toggleForgotPassword = () => {
    this.setState(({ forgotPassword }) => ({
      forgotPassword: !forgotPassword
    }))
  }

  // sendForgotUsernameMail = () => {
  //   const { username } = this.state
  // }

  render() {
    const {
      success,
      message,
      username,
      password,
      forgotPassword
    } = this.state

    const transitionOptions = {
      transitionName: 'fade',
      transitionEnterTimeout: 0,
      transitionEnter: true,
      transitionLeave: false
    }

    return (
      <div className="login" onKeyUp={this.onEnter}>
        <div className="sidebar-left">
          <div className="blanko">Blanko.</div>
          <ReactCSSTransitionGroup {...transitionOptions}>
            {
              !forgotPassword ? (
                <div className="input-fields" key={1}>
                  <input
                    type="text"
                    onChange={this.onType}
                    name="username"
                    value={username}
                    placeholder="Username"
                    autoFocus
                    className={message.length > 0 ? 'error' : ''}
                  />

                  <input
                    type="password"
                    onChange={this.onType}
                    value={password}
                    name="password"
                    placeholder="Password"
                    className={message.length > 0 ? 'error' : ''}
                  />

                  <button
                    type="submit" onClick={this.login}
                    className="login-button"
                  >
                    Login
                  </button>

                  <span className="links">
                    <a href="https://noudadrichem.com" className="link small">Sign up</a>
                    <button
                      className="link small"
                      onClick={this.toggleForgotPassword}
                      type="submit"
                    >
                      Forgot password
                    </button>
                  </span>
                </div>
              ) : (
                <div className="forgot-password" key={2}>
                  <button
                    className="link move-to-left"
                    onClick={this.toggleForgotPassword}
                    type="submit"
                  >
                    ← Go back to login
                  </button>

                  <p>Please provide the email your account is registerd with so we can send you a recovery email.</p>

                  <input
                    type="text"
                    onChange={this.onType}
                    name="username"
                    placeholder="Email address"
                    autoFocus
                    className={message.length > 0 ? 'error' : ''}
                  />

                  <button
                    onClick={this.sendForgotUsernameMail}
                    className="login-button"
                    type="submit"
                  >
                    Send reset email
                  </button>
                </div>
              )
            }
          </ReactCSSTransitionGroup>
        </div>

        <div className={`skeleton ${success ? 'login-success' : ''}`} />
      </div>
    )
  }
}

Login.propTypes = {
  login: PropTypes.func,
  fetchProjects: PropTypes.func,
  history: PropTypes.shape()
}

const mapStateToProps = ({ authenticationReducer }) => ({
  authenticated: authenticationReducer.authenticated
})

const mapActionsToProps = { login, fetchProjects }

export default withRouter(connect(mapStateToProps, mapActionsToProps)(Login))
