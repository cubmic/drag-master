function rectOverlapRect (a, b) {
  return Math.max(a.x, b.x) < Math.min(a.right, b.right) &&
    Math.max(a.y, b.y) < Math.min(a.bottom, b.bottom)
}

function relativePos (a, b) {
  let aPos = globalPos(a)
  let bPos = globalPos(b)
  return { x: aPos.x - bPos.x, y: aPos.y - bPos.y }
}

function appendTo (obj, newParent) {
  let oldParent = obj.parentNode
  let parentDistancePos = relativePos(oldParent, newParent)
  let localPos = relativePos(obj, oldParent)
  newParent.appendChild(obj)
  obj.style.left = (localPos.x + parentDistancePos.x) + 'px'
  obj.style.top = (localPos.y + parentDistancePos.y) + 'px'
}

function globalPos (obj) {
  let objStyle = getComputedStyle(obj)
  let pos = { x: 0, y: 0 }
  pos.x = obj.getBoundingClientRect().x
  pos.y = obj.getBoundingClientRect().y

  // for relative element also add margin from class and style to the mouse position to drag object position
  if (objStyle.position !== 'absolute' && obj.style.position !== 'absolute') {
    let x = parseInt(objStyle.marginLeft.substr(0, objStyle.marginLeft.length - 2))
    let y = parseInt(objStyle.marginTop.substr(0, objStyle.marginTop.length - 2))
    if (obj.style.left !== '' && obj.style.left !== 'auto') {
      x = parseInt(obj.style.left.substr(0, obj.style.left.length - 2))
    }
    if (obj.style.top !== '' && obj.style.top !== 'auto') {
      y = parseInt(obj.style.top.substr(0, obj.style.top.length - 2))
    }
    pos.x -= x
    pos.y -= y
  }
  return pos
}

export const drag = {
  inserted (el, binding) {
    // init
    var posInDragObj = null
    var relative = false
    var hoverObj = null
    var data = null

    // add move cursor
    el.style.cursor = 'move'

    function hoverCheck () {
      // hover & leave
      if (window.dropElements) {
        // leave
        if (hoverObj) {
          if (!rectOverlapRect(hoverObj.getBoundingClientRect(), data.dragObj.getBoundingClientRect())) {
            hoverObj.onLeave(data)
            hoverObj = null
          } else {
            // move
            hoverObj.onMove(data)
          }
        }
        // enter (find overlap item)
        if (!hoverObj) {
          for (let item of window.dropElements) {
            if (item !== data.dragObj && rectOverlapRect(item.getBoundingClientRect(), data.dragObj.getBoundingClientRect())) {
              hoverObj = item
              hoverObj.onEnter(data)
              break
            }
          }
        }
      }
    }

    function setPos () {
      let top = event.pageY - posInDragObj.y
      let left = event.pageX - posInDragObj.x

      if (binding.value) {
        // grid
        if (binding.value.grid) {
          let grid = binding.value.grid()
          if (grid > 0) {
            top -= top % grid
            left -= left % grid
          }
        }
      }

      // lock axis
      if (binding.value === undefined || binding.value.lockX === undefined) {
        data.dragObj.style.left = left + 'px'
      }
      if (binding.value === undefined || binding.value.lockY === undefined) {
        data.dragObj.style.top = top + 'px'
      }
    }

    // start drag event
    function startDrag (event) {
      if (!event.target || event.target !== el) {
        return
      }

      data = {
        dragData: null,
        dragObj: null,
        dragParentObj: null
      }

      data.dragObj = event.target
      data.dragParentObj = data.dragObj.parentNode
      let newParent = document.body
      if (binding.value && binding.value.parent) {
        newParent = binding.value.parent()
      }

      // get from parent the data and start index before the parent change
      if (data.dragParentObj.onInit) {
        data = data.dragParentObj.onInit(data)
      }

      // set parent to relative if not absolute
      if (getComputedStyle(newParent).position !== 'absolute' && newParent.style.position !== 'absolute') {
        newParent.style.position = 'relative'
      }

      // append to parent
      appendTo(data.dragObj, newParent)

      // if relative change to absolute
      let dragStyle = getComputedStyle(data.dragObj)
      relative = dragStyle.position !== 'absolute'
      if (relative) {
        data.dragObj.style.width = data.dragObj.offsetWidth + 'px'
        data.dragObj.style.position = 'absolute'
      }

      // store the distance from the mouse position to the clicked object left,top position
      // to remove it on drag from mouse position
      let dragObjPos = globalPos(data.dragObj)
      let newParentPos = globalPos(newParent)
      posInDragObj = {
        x: event.pageX - dragObjPos.x + newParentPos.x,
        y: event.pageY - dragObjPos.y + newParentPos.y
      }

      if (binding.value) {
        // related data
        if (binding.value.data) {
          data.dragData = binding.value.data
        }
        // onEnd function call
        if (binding.value.onStart) {
          binding.value.onStart(data)
        }
      }

      // for all drop elements
      if (window.dropElements) {
        for (let item of window.dropElements) {
          item.onStart(data)
        }
      }

      //setPos()
      hoverCheck()

      event.stopPropagation()
    }
    el.addEventListener('mousedown', startDrag)

    // drag event
    function onDrag (event) {
      if (data) {
        setPos()
        hoverCheck()

        if (binding.value) {
          // onDrag function call
          if (binding.value.onDrag) {
            binding.value.onDrag(data)
          }
        }

        // for all drop elements
        if (window.dropElements) {
          for (let item of window.dropElements) {
            item.onDrag(data)
          }
        }
      }
      event.stopPropagation()
    }
    window.addEventListener('mousemove', onDrag)

    // stop drag event
    function stopDrag (event) {
      if (data) {
        if (binding.value) {
          // drop
          if (hoverObj && rectOverlapRect(hoverObj.getBoundingClientRect(), data.dragObj.getBoundingClientRect())) {
            hoverObj.onDrop(data)
          }

          // onEnd function call
          if (binding.value.onEnd) {
            if (binding.value.onEnd(data) === false) {
              appendTo(data.dragObj, data.dragParentObj)
            }
          }
        }

        // for all drop elements
        if (window.dropElements) {
          for (let item of window.dropElements) {
            item.onEnd(data)
          }
        }

        // style reset
        if (relative) {
          data.dragObj.style.position = 'relative'
          data.dragObj.style.width = 'auto'
          data.dragObj.style.left = '0px'
          data.dragObj.style.top = '0px'
        }
      }
      posInDragObj = null
      relative = false
      hoverObj = null
      data = null
      event.stopPropagation()
    }
    window.addEventListener('mouseup', stopDrag)

    // store to remove on unbind
    el.events = { startDrag, onDrag, stopDrag }
  },
  unbind (el) {
    el.removeEventListener('mousedown', el.events.startDrag)
    el.removeEventListener('touchstart', el.events.startDrag)
    window.removeEventListener('mouseup', el.events.stopDrag)
  }
}
