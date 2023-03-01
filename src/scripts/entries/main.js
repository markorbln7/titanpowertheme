import { set, isIEorEdge, isTouch } from 'lib/utils'
import { initComponent } from 'lib/components'

import Video from 'modules/video/video'
import ContactForm from 'modules/contact-form/contact-form'

import 'styles/main.css'

initComponent(Video, 'video')
initComponent(ContactForm, 'contact-form')

document.addEventListener('DOMContentLoaded', () => {
  if (isIEorEdge()) set(document.body, 'ie')

  if (isTouch()) {
    document.body.classList.remove('no-touch')
  }
})
