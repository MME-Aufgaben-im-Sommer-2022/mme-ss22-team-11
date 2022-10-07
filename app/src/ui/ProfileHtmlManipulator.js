import { Observable, Event } from '../utils/Observable.js'

const SETTINGS_NAV_LINKS = document.querySelectorAll('#settings-nav .nav-link')

class HtmlManipulator extends Observable {
  constructor () {
    super()

    for (const item of SETTINGS_NAV_LINKS) {
      item.addEventListener('click', (event) => {
        this.notifyAll(new Event('CHANGE_PROFILE_CONTENT', item.id))
        for (const item of SETTINGS_NAV_LINKS) {
          if (item.classList.contains('active')) {
            item.classList.remove('active')
          }
        }
        item.classList.add('active')
      })
    }
  }
}

export { HtmlManipulator }
