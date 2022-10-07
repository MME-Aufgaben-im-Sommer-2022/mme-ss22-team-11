import { Observable, Event } from '../utils/Observable.js'

const LOGIN_SECTION_TEMPLATE = document.getElementById('login-modal-template').innerHTML.trim()

function createLoginView () {
  const el = document.createElement('div')
  el.innerHTML = LOGIN_SECTION_TEMPLATE
  return el.querySelector('.login-section')
}

function toggleSignUpLogin (el) {
  if (!el.classList.contains('login')) {
    // toggle to Login
    el.querySelector('#login-field-username').style.display = 'none'
    el.querySelector('.login-question').textContent = 'Hast du noch keinen Account?'
    el.querySelector('.login-link').textContent = 'Sign Up'

    el.querySelector('.signup-button').textContent = 'Login'
    el.classList.add('login')
  } else {
    // toggle to SignUp
    el.querySelector('#login-field-username').style.display = 'flex'
    el.querySelector('.login-question').textContent = 'Hast du schon einen Account?'
    el.querySelector('.login-link').textContent = 'Login'

    el.querySelector('.signup-button').textContent = 'Sign Up'
    el.classList.remove('login')
  }
}

function getUserData (el) {
  let username // muss nicht als undefined initialisiert werden, ist so schon undefined
  const email = el.querySelector('.login-email-input').value
  const password = el.querySelector('.login-password-input').value

  if (el.querySelector('.signup-button').textContent.trim() === 'Sign Up') {
    username = el.querySelector('.login-username-input').value
  }

  return [username, email, password]
}

class LoginView extends Observable {
  constructor () {
    super()
    this.el = createLoginView()
  }

  initializeLoginView () {
    this.el.querySelector('.login-link').addEventListener('click', () => {
      toggleSignUpLogin(this.el)
    })

    this.el.querySelector('.signup-button').addEventListener('click', () => {
      const userData = getUserData(this.el)
      this.notifyAll(new Event('USER_SUBMIT', userData))
    })

    document.querySelector('body').addEventListener('click', (event) => {
      if (!this.el.querySelector('.login-container').contains(event.target) && !document.querySelector('header').contains(event.target) && !document.querySelector('.new-recipe-fab').contains(event.target)) {
        this.removeLoginView()
      }
    })
  }

  showLoginView () {
    document.querySelector('body').append(this.el)
    document.querySelector('body').style.overflow = 'hidden'
  }

  removeLoginView () {
    this.el.remove()
    document.querySelector('body').style.overflow = 'scroll'
  }
}

export { LoginView }
