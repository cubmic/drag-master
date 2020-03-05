window.dropElements = []

export const drop = {
  inserted (el, binding) {
    // add to window
    window.dropElements.push(el)

    // set parent to relative if not absolute
    if (getComputedStyle(el).position !== 'absolute' && el.style.position !== 'absolute') {
      el.style.position = 'relative'
    }

    // enter event
    el.onEnter = (dragObj, data) => {
      if (binding.value) {
        if (binding.value.onEnter) {
          binding.value.onEnter(dragObj, el, data)
        }
      }
    }

    // leave event
    el.onLeave = (dragObj, data) => {
      if (binding.value) {
        if (binding.value.onLeave) {
          binding.value.onLeave(dragObj, el, data)
        }
      }
    }
  },
  unbind (el) {
    // remove from window
    window.dropElements = window.dropElements.filter(o => o !== el)
  }
}
