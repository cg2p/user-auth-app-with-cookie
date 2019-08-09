import { Component } from 'react'
import fetch from 'isomorphic-unfetch'
import Layout from '../components/layout'
import { login } from '../utils/auth'

class Login extends Component {
  constructor (props) {
    super(props)

    this.state = { email: '', password: '', error: '' }
    this.handleEmailChange = this.handleEmailChange.bind(this)
    this.handlePasswordChange = this.handlePasswordChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  handleEmailChange (event) {
    this.setState({ email: event.target.value })
  }
  handlePasswordChange (event) {
    this.setState({ password: event.target.value })
  }

  async handleSubmit (event) {
    event.preventDefault()
    this.setState({ error: '' })
    const email = this.state.email
    const password = this.state.password
    const url = `http://localhost:3001/api/users/login`;

    var myheaders = new Headers({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': 'http://localhost:3000'
    });

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: myheaders,
        body: JSON.stringify({ email, password })
      })
      if (response.ok) {
        const { userid } = await response.json()
        login({ userid })
      } else {
        console.log('Login failed.')
        let error = new Error(response.statusText)
        error.response = response
        throw error
      }
    } catch (error) {
      console.error(
        'You have an error in your code or there are Network issues.',
        email, password, 
        error
      )
      this.setState({ error: error.message })
    }
  }

  render () {
    return (
      <Layout>
        <div className='login'>
          <form onSubmit={this.handleSubmit}>
            <label htmlFor='email login'>User Auth</label>

            <input
              type='text'
              id='email'
              name='email'
              value={this.state.email}
              onChange={this.handleEmailChange}
            />
            <input
              type='text'
              id='password'
              name='password'
              value={this.state.password}
              onChange={this.handlePasswordChange}
            />

            <button type='submit'>Login</button>

            <p className={`error ${this.state.error && 'show'}`}>
              {this.state.error && `Error: ${this.state.error}`}
            </p>
          </form>
        </div>
        <style jsx>{`
          .login {
            max-width: 340px;
            margin: 0 auto;
            padding: 1rem;
            border: 1px solid #ccc;
            border-radius: 4px;
          }

          form {
            display: flex;
            flex-flow: column;
          }

          label {
            font-weight: 600;
          }

          input {
            padding: 8px;
            margin: 0.3rem 0 1rem;
            border: 1px solid #ccc;
            border-radius: 4px;
          }

          .error {
            margin: 0.5rem 0 0;
            display: none;
            color: brown;
          }

          .error.show {
            display: block;
          }
        `}</style>
      </Layout>
    )
  }
}

export default Login
