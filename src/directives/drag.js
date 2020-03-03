function rectOverlapRect (a, b) {
  return Math.max(a.x, b.x) < Math.min(a.right, b.right) &&
    Math.max(a.y, b.y) < Math.min(a.bottom, b.bottom)
}

export const drag = {
  inserted (el, binding) {
    // init
    var dragObj = null
    var posInDragObj = null
    var relative = false
    var data = null
    var hoverObj = null

    // start drag event
    function startDrag (event) {
      if (!event.target || event.target !== el) {
        return
      }

      dragObj = event.target

      if (getComputedStyle(dragObj.parentNode).position !== 'absolute' && dragObj.parentNode.style.position !== 'absolute') {
        dragObj.parentNode.style.position = 'relative'
      }

      posInDragObj = {
        x: event.pageX - dragObj.getBoundingClientRect().x + dragObj.parentNode.getBoundingClientRect().x,
        y: event.pageY - dragObj.getBoundingClientRect().y + dragObj.parentNode.getBoundingClientRect().y
      }

      // if relative change to absolute
      relative = getComputedStyle(dragObj).position !== 'absolute'
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
            let parent = dragObj.parentNode
            let list = [...parent.childNodes]
            list.sort((a, b) => a[key] > b[key] ? 1 : -1).map(node => parent.appendChild(node))
          }

          // onDrag function call
          if (binding.value.onDrag) {
            binding.value.onDrag(dragObj, data)
          }
        }

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
