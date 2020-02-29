window.dropElements = []

export const drop = {
  inserted (el, binding) {
    // add to window
    window.dropElements.push(el)
    // enter event
    el.onEnter = (dragObj, data) => {
      if (binding.value) {
        if (binding.value.onEnter) {
          binding.value.onEnter(dragObj, data)
        }
      }
    }
    // leave event
    el.onLeave = (dragObj, data) => {
      if (binding.value) {
        if (binding.value.onLeave) {
          binding.value.onLeave(dragObj, data)
        }
      }
    }
  },
  unbind (el) {
    // remove from window
    window.dropElements = window.dropElements.filter(o => o !== el)
  }
}
