import Immutable from 'immutable';

import Engines from './index';
const {Engine} = Engines;

export default class LoginEngine extends Engine {
  static NAME = 'login';

  init() {
    const session = localStorage.getItem('session');

    if (session) {
      // XXX log in with session here
      const loginState = this.getState('login').set('loggingIn', true);
      return {
        'login': loginState
      };
    } else {
      return null;
    }
  }

  loginWithUsernamePassword({username, password}) {
    this.updateState('login', state => state
      .set('loggingIn', true));

    _getGraphQl({
      login: {
        username,
        password
      }
    }).then(({user, session}) => {
      console.log('successfully logged in', {user, session});

      localStorage.setItem('session', session);

      this.updateState('login', state => state
        .set('user', user)
        .set('session', session)
        .set('loggedIn', true)
        .set('loggingIn', false)
        .set('error', err));
    }).catch(err => {
      console.log('error logging in', {err});

      this.updateState('login', state => state
        .set('loggingIn', false)
        .set('error', err));
    });
  }

  loginWithSession({session}) {
    // XXX
  }
}

function _getGraphQl(query) {
  return fetch('/api/graphql', { // XXX sync this with the backend
    method: 'post',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(query),
    // credentials: 'include',
  }).then(response => _jsonParse(response.text()));
}

function _jsonParse(s) {
  try {
    return JSON.parse(s);
  } catch(err) {
    return null;
  }
}

module.exports = LoginEngine;
