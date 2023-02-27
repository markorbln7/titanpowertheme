import { set, isIEorEdge, isTouch } from 'lib/utils'
import { initComponent } from 'lib/components'

import ProductTemplate from 'modules/product-template/product-template'

import 'styles/main.css'

initComponent(ProductTemplate, 'ProductTemplate')

document.addEventListener('DOMContentLoaded', () => {
  if (isIEorEdge()) set(document.body, 'ie')

  if (isTouch()) {
    document.body.classList.remove('no-touch')
  }
})
