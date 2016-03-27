import Immutable from 'immutable';

import Engines from './index';
const {Engine} = Engines;

export default class LoginEngine extends Engine {
  static NAME = 'login';

  init() {
    const session = localStorage.getItem('session');

    if (session) {
      return {
        'login': this.getState('login').set('loggingIn', true)
      };
    } else {
      return null;
    }
  }

  loginWithUsernamePassword({username, password}) {
    this.updateState('login', state => state
      .set('loggingIn', true));

    _getGraphQl('mutation', 'login', {
      username,
      password,
    }, {
      user: {
        id: true,
      },
      session: true
    }).then(data => {
      if (data && data.login) {
        this.succeedLogin(data.login);
      } else {
        this.failLogin('Invalid username or password');
      }
    }).catch(err => { this.failLogin(err); });
  }

  loginWithSession({session}) {
    _getGraphQl('query', 'login', {
      username,
      password,
    }, {
      user: {
        id: true,
      },
      session: true
    }).then(data => {
      if (data && data.login) {
        this.succeedLogin(data.login);
      } else {
        this.failLogin('Invalid username or password');
      }
    }).catch(err => { this.failLogin(err); });
  }

  succeedLogin(data) {
    const {user, session} = data;

    console.log('successfully logged in', {user, session}); // XXX

    localStorage.setItem('session', session);

    this.updateState('login', state => state
      .set('user', user)
      .set('session', session)
      .set('loggedIn', true)
      .set('loggingIn', false)
      .set('error', null));
  }

  failLogin(err) {
    console.log('error logging in', JSON.stringify(String(err))); // XXX

    this.updateState('login', state => state
      .set('loggingIn', false)
      .set('error', String(err)));
  }

  clearError() {
    this.updateState('login', state => state
      .set('error', null));
  }

  startCreateAccount() {
    this.updateState('login', state => state
      .set('creatingAccount', true));
  }

  endCreateAccount() {
    this.updateState('login', state => state
      .set('creatingAccount', false));
  }

  createAccount({username, password, gender}) {
    this.updateState('login', state => state
      .set('loggedIn', true)
      .set('loggingIn', false)
      .set('creatingAccount', false));
  }
}

function _getGraphQl(type, method, args, fields) {
  const query = _makeGraphQlQuery(type, method, args, fields);
  const body = JSON.stringify({query});

  return fetch('/api/graphql', { // XXX sync this with the backend
    method: 'post',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body,
    // credentials: 'include',
  }).then(response => {
    if (response.status >= 200 && response.status < 300) {
      return response.text().then(responseText => {
        const responseJson = _jsonParse(responseText);
        const responseData = _getGraphQlResultData(responseJson);
        return responseData;
      });
    } else {
      return null;
    }
  });
}

function _makeGraphQlQuery(type, method, args, fields) {
  function _stringifyMethod(method) {
    return method;
  }
  function _stringifyArgs(args) {
    return Object.keys(args).map(k => { return k + ':' + JSON.stringify(String(args[k])); }).join(', ');
  }
  function _stringifyFields(fields) {
    let acc = [];
    for (let k in fields) {
      const v = fields[k];
      if (typeof v === 'object') {
        acc.push(k + ' { ' + _stringifyFields(v) + ' }');
      } else {
        acc.push(k);
      }
    }
    return acc.join(', ');
  }

  return type + ' { ' + _stringifyMethod(method) + '(' + _stringifyArgs(args) + ') { ' + _stringifyFields(fields) + ' } }';
}

function _jsonParse(s) {
  try {
    return JSON.parse(s);
  } catch(err) {
    return null;
  }
}

function _getGraphQlResultData(result) {
  if (result && result.data) {
    return result.data;
  } else {
    return null;
  }
}

module.exports = LoginEngine;
