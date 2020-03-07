function rectOverlapRect (a, b) {
  return Math.max(a.x, b.x) < Math.min(a.right, b.right) &&
    Math.max(a.y, b.y) < Math.min(a.bottom, b.bottom)
}
/*
function testObj (pos, color) {
  let o = document.createElement('div')
  o.style.position = 'absolute'
  o.style.left = pos.x + 'px'
  o.style.top = pos.y + 'px'
  o.style.width = '10px'
  o.style.height = '10px'
  o.style.background = color
  document.body.appendChild(o)
}
*/
function relativePos (a, b) {
  let aPos = globalPos(a)
  let bPos = globalPos(b)
  return { x: aPos.x - bPos.x, y: aPos.y - bPos.y }
}

function appendTo (obj, newParent) {
  let oldParent = obj.parentNode
  let parentDistancePos = relativePos(oldParent, newParent)
  let localPos = relativePos(obj, oldParent)
  console.log(localPos, parentDistancePos)
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
    if (obj.style.left !== '') {
      x = parseInt(obj.style.left.substr(0, obj.style.left.length - 2))
    }
    if (obj.style.top !== '') {
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
    var dragObj = null
    var posInDragObj = null
    var oldParent = null
    var relative = false
    var data = null
    var hoverObj = null

    // add move cursor
    el.style.cursor = 'move'

    function hoverCheck () {
      // hover & leave
      if (window.dropElements) {
        // leave
        if (hoverObj) {
          if (!rectOverlapRect(hoverObj.getBoundingClientRect(), dragObj.getBoundingClientRect())) {
            hoverObj.onLeave(dragObj, data)
            hoverObj = null
          } else {
            // move
            hoverObj.onMove(dragObj, data)
          }
        }
        // enter (find overlap item)
        if (!hoverObj) {
          for (let item of window.dropElements) {
            if (item !== dragObj && rectOverlapRect(item.getBoundingClientRect(), dragObj.getBoundingClientRect())) {
              hoverObj = item
              hoverObj.onEnter(dragObj, data)
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
        dragObj.style.left = left + 'px'
      }
      if (binding.value === undefined || binding.value.lockY === undefined) {
        dragObj.style.top = top + 'px'
      }
    }

    // start drag event
    function startDrag (event) {
      if (!event.target || event.target !== el) {
        return
      }

      dragObj = event.target
      oldParent = dragObj.parentNode
      let newParent = document.body
      if (binding.value && binding.value.parent) {
        newParent = binding.value.parent()
      }

      // set parent to relative if not absolute
      if (getComputedStyle(newParent).position !== 'absolute' && newParent.style.position !== 'absolute') {
        newParent.style.position = 'relative'
      }

      /*
      oldParent.style.boxShadow = '0 0 10px #0F0'
      testObj(globalPos(oldParent), 'linear-gradient(to right bottom, #0F0 50%, rgba(0,0,0,0) 50%)')
      newParent.style.boxShadow = '0 0 10px #00F'
      testObj(globalPos(newParent), 'linear-gradient(to right bottom, rgba(0,0,0,0) 50%, #00F 50%)')
      */

      // append to parent
      appendTo(dragObj, newParent)

      // if relative change to absolute
      let dragStyle = getComputedStyle(dragObj)
      relative = dragStyle.position !== 'absolute'
      if (relative) {
        dragObj.style.width = dragObj.offsetWidth + 'px'
        dragObj.style.position = 'absolute'
      }

      // store the distance from the mouse position to the clicked object left,top position
      // to remove it on drag from mouse position
      let dragObjPos = globalPos(dragObj)
      let newParentPos = globalPos(newParent)
      posInDragObj = {
        x: event.pageX - dragObjPos.x + newParentPos.x,
        y: event.pageY - dragObjPos.y + newParentPos.y
      }

      if (binding.value) {
        // related data
        if (binding.value.data) {
          data = binding.value.data
        }
        // onEnd function call
        if (binding.value.onStart) {
          binding.value.onStart(dragObj, data)
        }
      }

      //setPos()
      hoverCheck()

      event.stopPropagation()
    }
    el.addEventListener('mousedown', startDrag)
    // el.addEventListener('touchstart', startDrag)

    // drag event
    function onDrag (event) {
      if (dragObj) {
        setPos()
        hoverCheck()

        if (binding.value) {
          // onDrag function call
          if (binding.value.onDrag) {
            binding.value.onDrag(dragObj, data)
          }
        }
      }
      event.stopPropagation()
    }
    window.addEventListener('mousemove', onDrag)
    // window.addEventListener('touchmove', onDrag)

    // stop drag event
    function stopDrag (event) {
      if (dragObj) {
        if (binding.value) {
          // onEnd function call
          if (binding.value.onEnd) {
            if (binding.value.onEnd(dragObj, data) === false) {
              appendTo(dragObj, oldParent)
            }
          }

          // drop
          if (hoverObj && rectOverlapRect(hoverObj.getBoundingClientRect(), dragObj.getBoundingClientRect())) {
            hoverObj.onDrop(dragObj, data)
          }
        }
        // style reset
        if (relative) {
          dragObj.style.position = 'relative'
          dragObj.style.width = 'auto'
          dragObj.style.left = '0px'
          dragObj.style.top = '0px'
        }
      }
      oldParent = null
      dragObj = null
      posInDragObj = null
      hoverObj = null
      event.stopPropagation()
    }
    window.addEventListener('mouseup', stopDrag)
    // window.addEventListener('touchend', stopDrag)
    // window.addEventListener('touchcancel', stopDrag)

    // store to remove on unbind
    el.events = { startDrag, onDrag, stopDrag }
  },
  unbind (el) {
    el.removeEventListener('mousedown', el.events.startDrag)
    el.removeEventListener('touchstart', el.events.startDrag)
    window.removeEventListener('mouseup', el.events.stopDrag)
    /*
    window.removeEventListener('mousemove', el.events.onDrag)
    window.removeEventListener('touchmove', el.events.onDrag)
    window.removeEventListener('touchend', el.events.stopDrag)
    window.removeEventListener('touchcancel', el.events.stopDrag)
    */
  }
}
