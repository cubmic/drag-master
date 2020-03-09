window.dropElements = []

/**
 * css classes:
 * - .placeholder
 * - .hide
 */

function sort (dragObj, dropObj, placeholder) {
  let y = dragObj.getBoundingClientRect().y - dropObj.getBoundingClientRect().y
  placeholder.style.position = 'absolute'
  placeholder.style.top = (y - dragObj.getBoundingClientRect().height / 2) + 'px'
  // sort list items
  let list = [...dropObj.childNodes]
  list.sort((a, b) => a.offsetTop > b.offsetTop ? 1 : -1).map(node => dropObj.appendChild(node))
  placeholder.style.position = 'relative'
  placeholder.style.top = 'auto'
}
function togglePlaceholder (dragObj, placeholder) {
  let y = placeholder.getBoundingClientRect().y - dragObj.getBoundingClientRect().y
  y = Math.max(-y, y)
  if (y > 60) {
    placeholder.classList.add('hide')
  } else {
    placeholder.classList.remove('hide')
  }
}
function index (parent, child) {
  let index = -1
  let array = [...parent.children]
  array.find((o, i) => {
    if (o === child) {
      index = i
      return true
    }
    return false
  })
  return index
}

export const drop = {
  inserted (el, binding) {
    // add to window
    window.dropElements.push(el)

    var dropData = null
    var placeholder = null

    if (binding.value) {
      if (binding.value.data) {
        dropData = binding.value.data
      }
    }

    // set parent to relative if not absolute
    if (getComputedStyle(el).position !== 'absolute' && el.style.position !== 'absolute') {
      el.style.position = 'relative'
    }

    /*
    data = {
      dragData: null,
      dragObj: null,
      oldParentObj: null,
      startIndex: null,
      dropObj: null, // update from drop directive
      dropData: null // update from drop directive
    }
    */
    function addDropData (data) {
      data.dropObj = el
      data.dropData = dropData
      return data
    }

    el.onInit = (data) => {
      data.oldParentData = dropData
      data.startIndex = index(el, data.dragObj)
      return data
    }

    // on start for all
    el.onStart = (data) => {
      if (binding.value) {
        // add placeholder
        if (binding.value.placeholder) {
          placeholder = document.createElement('li')
          placeholder.classList.add('placeholder')
          placeholder.classList.add('hide')
          el.appendChild(placeholder)
        }
        if (binding.value.onStart) {
          addDropData(data)
          binding.value.onStart(data)
        }
      }
    }
    // on drag for all
    el.onDrag = (data) => {
      if (binding.value) {
        if (binding.value.onDrag) {
          addDropData(data)
          binding.value.onDrag(data)
        }
      }
    }
    // on end for all
    el.onEnd = (data) => {
      if (binding.value) {
        if (binding.value.placeholder && placeholder) {
          el.removeChild(placeholder)
        }
        if (binding.value.onEnd) {
          addDropData(data)
          binding.value.onEnd(data)
        }
      }
    }

    // enter event
    el.onEnter = (data) => {
      if (binding.value) {
        if (binding.value.placeholder) {
          placeholder.classList.remove('hide')
          sort(data.dragObj, el, placeholder)
        }
        if (binding.value.onEnter) {
          addDropData(data)
          binding.value.onEnter(data)
        }
      }
    }

    // move event
    el.onMove = (data) => {
      if (binding.value) {
        // sort placeholder
        if (binding.value.placeholder) {
          togglePlaceholder(data.dragObj, placeholder)
          sort(data.dragObj, el, placeholder)
        }
        if (binding.value.onMove) {
          addDropData(data)
          binding.value.onMove(data)
        }
      }
    }

    // leave event
    el.onLeave = (data) => {
      if (binding.value) {
        if (binding.value.placeholder) {
          placeholder.classList.add('hide')
        }
        if (binding.value.onLeave) {
          addDropData(data)
          binding.value.onLeave(data)
        }
      }
    }

    // drop event
    el.onDrop = (data) => {
      if (binding.value) {
        if (binding.value.onDrop) {
          addDropData(data)
          data.endIndex = index(el, placeholder)
          el.insertBefore(data.dragObj, placeholder)
          binding.value.onDrop(data)
        }
      }
    }
  },
  unbind (el) {
    // remove from window
    window.dropElements = window.dropElements.filter(o => o !== el)
  }
}
