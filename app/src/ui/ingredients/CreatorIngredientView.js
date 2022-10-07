import { Observable, Event } from '../../utils/Observable.js'

const INGREDIENT_ELEMENT_TEMPLATE = document.getElementById('creator-ingredient-template').innerHTML.trim()

function createIngredientElementForView () {
  const el = document.createElement('div')
  el.innerHTML = INGREDIENT_ELEMENT_TEMPLATE
  return el.querySelector('.creator-ingredient')
}

class CreatorIngredientView extends Observable {
  constructor (ingredient) {
    super()

    this.ingredient = ingredient
    this.el = createIngredientElementForView()
    // this.el.textContent = ingredient.displayName;
    this.el.textContent = ingredient

    this.el.addEventListener('click', () => this.notifyAll(new Event('INGREDIENT CLICKED', [this.el, this.ingredient])))
  }

  appendTo (parent) {
    parent.append(this.el)
  }

  remove () {
    this.el.remove()
  }
}

export default CreatorIngredientView
