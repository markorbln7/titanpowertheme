import { initComponent } from 'lib/components'
import BundleBuilder from 'modules/bundle-builder/bundle-builder.js'

document.addEventListener('DOMContentLoaded', () => {
  initComponent(BundleBuilder, 'BundleBuilder')
})
