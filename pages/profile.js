import Router from 'next/router'
import fetch from 'isomorphic-unfetch'
import nextCookie from 'next-cookies'
import Layout from '../components/layout'
import { withAuthSync } from '../utils/auth'

const Profile = props => {
  const { name, result } = props.data
  
  return (
    <Layout>
      <h1>Profile</h1>
      <br/>
      <p className='lead'>{name}</p>
      <p>API success = {result}</p>

      <style jsx>{`
        img {
          max-width: 200px;
          border-radius: 0.5rem;
        }

        h1 {
          margin-bottom: 0;
        }

        .lead {
          margin-top: 0;
          font-size: 1.5rem;
          font-weight: 300;
          color: #666;
        }

        p {
          color: #6a737d;
        }
      `}</style>
    </Layout>
  )
}

	
Profile.getInitialProps = async ctx => {
  const { token } = nextCookie(ctx);
  const userid = token;
  const url = `http://localhost:3001/api/users/profile`;

  const redirectOnError = () =>
    typeof window !== 'undefined'
      ? Router.push('/login')
      : ctx.res.writeHead(302, { Location: '/login' }).end()

  try {
    const response = await fetch(url, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': 'http://localhost:3000',
        Authorization: JSON.stringify({ userid })
      }
    })
    console.log("userid = %s", userid);
    if (response.ok) {
      // get the data back from the API call
      const js = await response.json();

      // then extract the items you need and build them into a json object
      // json object needs 'data: { ..., ...}
      const d = Object.assign( {}, { data: { name: js.name, result: JSON.stringify(js.success) } } );
      
      console.log("response ok data = %s", d.data.name);
      return d;
    }
  
    console.log(response);
    return redirectOnError();
  } catch (error) {
    // Implementation or Network error
    console.error(error);
    return redirectOnError();
  }
}

export default withAuthSync(Profile);