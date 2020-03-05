function rectOverlapRect (a, b) {
  return Math.max(a.x, b.x) < Math.min(a.right, b.right) &&
    Math.max(a.y, b.y) < Math.min(a.bottom, b.bottom)
}
/*
function appendTo (obj, newParent) {
  let pos = { x: 0, y: 0 }
  pos.x = obj.offsetLeft
  pos.y = obj.offsetTop
  let oldParentPos = globalPos(obj.parentNode)
  let newParentPos = globalPos(newParent)
  pos.x += newParentPos.x - oldParentPos.x
  pos.y += newParentPos.y - oldParentPos.y
  newParent.appendChild(obj)
  obj.style.left = pos.x + 'px'
  obj.style.top = pos.y + 'px'
}
*/
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
    var startParent = null
    var relative = false
    var data = null
    var hoverObj = null

    // add move cursor
    el.style.cursor = 'move'

    // start drag event
    function startDrag (event) {
      if (!event.target || event.target !== el) {
        return
      }

      dragObj = event.target
      startParent = dragObj.parentNode
      let dragStyle = getComputedStyle(dragObj)

      // set parent to relative if not absolute
      if (getComputedStyle(startParent).position !== 'absolute' && startParent.style.position !== 'absolute') {
        startParent.style.position = 'relative'
      }

      // store the distance from the mouse position to the clicked object left,top position
      // to remove it on drag from mouse position
      let dragObjPos = globalPos(dragObj)
      let startParentPos = globalPos(startParent)
      posInDragObj = {
        x: event.pageX - dragObjPos.x + startParentPos.x,
        y: event.pageY - dragObjPos.y + startParentPos.y
      }

      // if relative change to absolute
      relative = dragStyle.position !== 'absolute'
      if (relative) {
        dragObj.style.width = dragObj.offsetWidth + 'px'
        dragObj.style.position = 'absolute'
      }

      dragObj.style.top = (event.pageY - posInDragObj.y) + 'px'
      dragObj.style.left = (event.pageX - posInDragObj.x) + 'px'

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
      event.stopPropagation()
    }
    el.addEventListener('mousedown', startDrag)
    el.addEventListener('touchstart', startDrag)

    // drag event
    function onDrag (event) {
      if (dragObj) {
        // hover & leave
        if (window.dropElements) {
          // leave
          if (hoverObj && !rectOverlapRect(hoverObj.item.getBoundingClientRect(), dragObj.getBoundingClientRect())) {
            hoverObj.item.onLeave(hoverObj.item, hoverObj.data)
            hoverObj = null
          }
          // enter (find overlap item)
          if (!hoverObj) {
            for (let item of window.dropElements) {
              if (item !== dragObj && rectOverlapRect(item.getBoundingClientRect(), dragObj.getBoundingClientRect())) {
                item.onEnter(dragObj, data)
                hoverObj = { data: data, item: item }
                break
              }
            }
          }
        }

        // on parent changed update the distance to start position
        if (startParent !== dragObj.parentNode) {
          let startParentPos = globalPos(startParent)
          let newParentPos = globalPos(dragObj.parentNode)
          posInDragObj.x += newParentPos.x - startParentPos.x,
          posInDragObj.y += newParentPos.y - startParentPos.y
          startParent = dragObj.parentNode
        }

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

        if (binding.value) {
          // sort
          if (binding.value.sortBy) {
            let key = binding.value.sortBy
            let list = [...startParent.childNodes]
            list.sort((a, b) => a[key] > b[key] ? 1 : -1).map(node => startParent.appendChild(node))
          }

          // onDrag function call
          if (binding.value.onDrag) {
            binding.value.onDrag(dragObj, data)
          }
        }
      }
      event.stopPropagation()
    }
    window.addEventListener('mousemove', onDrag)
    window.addEventListener('touchmove', onDrag)

    // stop drag event
    function stopDrag (event) {
      if (dragObj) {
        // style reset
        if (relative) {
          dragObj.style.position = 'relative'
          dragObj.style.width = 'auto'
          dragObj.style.left = '0px'
          dragObj.style.top = '0px'
        }

        if (binding.value) {
          // onEnd function call
          if (binding.value.onEnd) {
            binding.value.onEnd(dragObj, data)
          }
        }
      }
      dragObj = null
      posInDragObj = null
      data = null
      event.stopPropagation()
    }
    window.addEventListener('mouseup', stopDrag)
    window.addEventListener('touchend', stopDrag)
    window.addEventListener('touchcancel', stopDrag)

    // store to remove on unbind
    el.events = { startDrag, onDrag, stopDrag }
  },
  unbind (el) {
    el.removeEventListener('mousedown', el.events.startDrag)
    el.removeEventListener('touchstart', el.events.startDrag)
    window.removeEventListener('mousemove', el.events.onDrag)
    window.removeEventListener('touchmove', el.events.onDrag)
    window.removeEventListener('mouseup', el.events.stopDrag)
    window.removeEventListener('touchend', el.events.stopDrag)
    window.removeEventListener('touchcancel', el.events.stopDrag)
  }
}
