const NAV_LINKS = document.getElementsByClassName('nav-link')
/* TAGS */
const TAGS_CONTAINER = document.getElementsByClassName('tags-container')[0]
const TAGS_ADD = document.getElementsByClassName('tags-add')[0]
/* INGREDIENTS */
const INGREDIENT_CONTAINER = document.getElementsByClassName('ingredients-container')[0]
const FILTER_ING_INPUT_CONTAINER = document.getElementsByClassName('ingredient-input-container')[0]
// FILTER_ING_INPUT = document.getElementsByClassName("ingredient-input")[0],
const FILTER_ING_RESULTS = document.getElementsByClassName('ingredient-search-results')[0]

/* STEPS */
const STEPS_CONTAINER = document.getElementsByClassName('steps-container')[0]
const STEPS_ADD = document.getElementsByClassName('steps-add')[0]

class HtmlManipulator {
  constructor () {
    for (const item of NAV_LINKS) {
      item.addEventListener('click', () => {
        for (const item of NAV_LINKS) {
          if (item.classList.contains('active')) {
            item.classList.remove('active')
          }
        }
        item.classList.add('active')
      })
    }

    /* TAGS */
    TAGS_ADD.addEventListener('click', () => {
      const tag = document.createElement('input')
      tag.setAttribute('type', 'text')
      tag.setAttribute('class', 'steps-input')
      tag.setAttribute('placeholder', 'Füge Tag hinzu...')

      TAGS_CONTAINER.append(tag)
    })

    /* INGREDIENTS */
    FILTER_ING_INPUT_CONTAINER.addEventListener('click', () => {
      if (FILTER_ING_RESULTS.childElementCount !== 0) {
        FILTER_ING_INPUT_CONTAINER.classList.add('extend')
      } else {
        FILTER_ING_INPUT_CONTAINER.classList.add('focus')
      }
    })

    document.addEventListener('click', (event) => {
      if (!FILTER_ING_INPUT_CONTAINER.contains(event.target) && event.target.className !== 'ingredient') {
        if (FILTER_ING_INPUT_CONTAINER.classList.contains('focus')) {
          FILTER_ING_INPUT_CONTAINER.classList.remove('focus')
        } else if (FILTER_ING_INPUT_CONTAINER.classList.contains('extend')) {
          FILTER_ING_INPUT_CONTAINER.classList.remove('extend')
        }
      }
    })

    for (const item of INGREDIENT_CONTAINER.children) {
      item.addEventListener('click', () => {
        item.remove()
      })
    }

    for (const item of FILTER_ING_RESULTS.children) {
      item.addEventListener('click', () => {
        item.remove()
        INGREDIENT_CONTAINER.append(item)
      })
    }

    /* STEPS */

    STEPS_ADD.addEventListener('click', () => {
      const step = document.createElement('input')
      step.setAttribute('type', 'text')
      step.setAttribute('class', 'steps-input')
      step.setAttribute('placeholder', 'Füge Schritt hinzu...')

      STEPS_CONTAINER.append(step)
    })
  }
}

export { HtmlManipulator }
