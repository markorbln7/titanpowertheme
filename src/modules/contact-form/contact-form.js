import {
  addClass,
  removeClass
} from 'lib/dom'

const formToJSON = (elements) => {
  return [].reduce.call(elements, function (data, element) {
    data[element.name] = element.value
    return data
  }, {})
}

const getUrlString = (data) => {
  const urlParameters = Object.entries(data).map(function (e) {
    return e.join('=')
  }).join('&')
  return urlParameters
}

export default (el) => {
  const form = el.querySelector('form')
  if (form) {
    const action = form.getAttribute('data-action')
    const inputs = form.querySelectorAll('[name]')
    const alertEl = form.querySelector('.js-form-alert')
    const successEl = form.querySelector('.js-form-success')
    const showAlert = () => {
      if (alertEl) {
        addClass('is-active', alertEl)
      }
    }
    const showSuccess = () => {
      if (alertEl) {
        addClass('is-active', successEl)
      }
    }
    const hideMessage = () => {
      if (successEl) {
        removeClass('is-active', successEl)
      }
      if (alertEl) {
        removeClass('is-active', alertEl)
      }
    }

    form.addEventListener('submit', (e) => {
      e.preventDefault()
      hideMessage()
      window.fetch(action, {
        method: 'POST',
        body: getUrlString(formToJSON(inputs)),
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
          'X-Requested-With': 'XMLHttpRequest'
        }
      }).then((response) => {
        console.log('response', response)
        if (response && response.status === 200) {
          if (response.url.includes('/challenge')) {
            window.location.href = response.url
          } else {
            showSuccess()
          }
        } else {
          showAlert()
        }
      }).catch((err) => {
        console.error(err)
        showAlert()
      })
    })
  }
}
