window.dropElements = []

export const drop = {
  inserted (el, binding) {
    // add to window
    window.dropElements.push(el)

    // set parent to relative if not absolute
    if (getComputedStyle(el).position !== 'absolute' && el.style.position !== 'absolute') {
      el.style.position = 'relative'
    }

    // leave start
    el.onStart = (dragObj, data) => {
      if (binding.value) {
        if (binding.value.onStart) {
          binding.value.onStart(dragObj, el, data)
        }
      }
    }
    // leave drag
    el.onDrag = (dragObj, data) => {
      if (binding.value) {
        if (binding.value.onDrag) {
          binding.value.onDrag(dragObj, el, data)
        }
      }
    }
    // leave end
    el.onEnd = (dragObj, data) => {
      if (binding.value) {
        if (binding.value.onEnd) {
          binding.value.onEnd(dragObj, el, data)
        }
      }
    }

    // enter event
    el.onEnter = (dragObj, data) => {
      if (binding.value) {
        if (binding.value.onEnter) {
          binding.value.onEnter(dragObj, el, data)
        }
      }
    }

    // move event
    el.onMove = (dragObj, data) => {
      if (binding.value) {
        if (binding.value.onMove) {
          binding.value.onMove(dragObj, el, data)
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

    // drop event
    el.onDrop = (dragObj, data) => {
      if (binding.value) {
        if (binding.value.onDrop) {
          binding.value.onDrop(dragObj, el, data)
        }
      }
    }
  },
  unbind (el) {
    // remove from window
    window.dropElements = window.dropElements.filter(o => o !== el)
  }
}
