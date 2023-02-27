const initComponent = (Component, selector) => {
  const elements = [].slice.call(document.querySelectorAll(`[data-module="${selector}"]`), 0)

  elements.forEach(element => {
    element.removeAttribute('data-module')
    Component(element)
  })
}

export {
  initComponent
}
