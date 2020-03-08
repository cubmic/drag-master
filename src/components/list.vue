<template>
  <div>
    <div v-for="list in lists" :key="list.id">
      <h2>{{ list.title }}</h2>
      <ul v-drop="dropDefs()">
        <li
          v-for="item in list.items"
          :key="item.id"
          v-drag="dragDefs(item)"
          :style="'background: #' + list.color"
        >
          {{ item.name }}
        </li>
      </ul>
      <br />
    </div>
    <pre>{{ lists }}</pre>
  </div>
</template>

<style>
ul {
  margin: 0;
  padding: 0;
}
li {
  box-sizing: border-box;
  height: 30px;
  margin: 5px 0;
  padding: 5px;
  color: #FFF;
  list-style-type: none;
  user-select: none;
}
.placeholder {
  background: transparent;
  border: 2px dashed #666;
  /* box-shadow: 5px 5px 10px #666 inset; */
  transition: all 1s;
  opacity: 1.0;
}
.placeholder.hide {
  margin: 0 0;
  padding: 0;
  height: 0;
  opacity: 0;
  border: 0;
}
.drag {
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
  z-index: 2;
}
</style>

<script>
export default {
  name: 'PageIndex',
  computed: {
    lists () {
      return [...this.data].sort((a, b) => {
        return b.sort - a.sort
      })
    }
  },
  data () {
    return {
      data: [
        {
          id: 1,
          color: '975',
          title: 'Items',
          items: [
            { id: 1, sort: 1, name: 'Coke' },
            { id: 2, sort: 5, name: 'Orange Juice' },
            { id: 3, sort: 3, name: 'Apple' },
            { id: 4, sort: 4, name: 'Cornflakes' },
            { id: 5, sort: 2, name: 'Banana' }
          ]
        },
        {
          id: 2,
          color: '579',
          title: 'Shopping list',
          items: [
            { id: 6, sort: 1, name: 'Wine' },
            { id: 7, sort: 2, name: 'Milk' }
          ]
        }
      ],
      sortDefs: {
        byY: true
      },
      dropDefs: () => {
        let placeholder
        let mouseMove = (dragObj) => {
          let y = this.globalPos(placeholder).y - this.globalPos(dragObj).y
          y = Math.max(-y, y)
          if (y > 60) {
            placeholder.classList.add('hide')
          } else {
            placeholder.classList.remove('hide')
          }
        }
        return {
          onStart: (dragObj, dropObj) => {
            // add placeholder
            placeholder = document.createElement('li')
            placeholder.classList.add('placeholder')
            placeholder.classList.add('hide')
            dropObj.appendChild(placeholder)
          },
          onDrag: (dragObj) => {
            mouseMove(dragObj)
          },
          onEnd: (dragObj, dropObj) => {
            // remove placeholder
            dropObj.removeChild(placeholder)
          },
          onEnter: (dragObj, dropObj) => {
            placeholder.classList.remove('hide')
            this.sort(dragObj, dropObj, placeholder)
          },
          onMove: (dragObj, dropObj) => {
            this.sort(dragObj, dropObj, placeholder)
          },
          onDrop: (dragObj, dropObj) => {
            // remove placeholder
            dropObj.insertBefore(dragObj, placeholder)
          }
        }
      },
      dragDefs: (defData) => {
        return {
          parent: () => this.$el,
          lockX: true,
          data: defData,
          onStart: (dragObj) => {
            // add drag class
            dragObj.classList.add('drag')
          },
          onEnd: (dragObj) => {
            // remove drag class
            dragObj.classList.remove('drag')
            return false
          }
        }
      }
    }
  },
  methods: {
    sort (dragObj, dropObj, placeholder) {
      let y = this.globalPos(dragObj).y - this.globalPos(dropObj).y
      placeholder.style.position = 'absolute'
      placeholder.style.top = (y - dragObj.getBoundingClientRect().height / 2) + 'px'
      // sort list items
      let list = [...dropObj.childNodes]
      list.sort((a, b) => a.offsetTop > b.offsetTop ? 1 : -1).map(node => dropObj.appendChild(node))
      placeholder.style.position = 'relative'
      placeholder.style.top = 'auto'
    },
    globalPos (obj) {
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
  }
}
</script>
