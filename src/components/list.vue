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
  border: 2px dashed #F00;
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
      return this.data
      /*
      return this.data.sort((a, b) => {
        return b.sort - a.sort
      })
      */
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
            { id: 2, sort: 2, name: 'Orange Juice' },
            { id: 3, sort: 3, name: 'Apple' },
            { id: 4, sort: 4, name: 'Cornflakes' },
            { id: 5, sort: 5, name: 'Banana' }
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
        return {
          onEnter: (dragObj, dropObj) => {
            if (dragObj.parentNode !== dropObj) {
              dropObj.appendChild(dragObj)
            }
          }
        }
      },
      dragDefs: (defData) => {
        let placeholder
        return {
          lockX: true,
          data: defData,
          sortBy: 'offsetTop',
          onStart: (dragObj) => {
            // add placeholder
            placeholder = document.createElement('li')
            placeholder.classList.add('placeholder')
            dragObj.parentNode.insertBefore(placeholder, dragObj)

            // add drag class
            dragObj.classList.add('drag')
          },
          onDrag: (dragObj) => {
            dragObj.parentNode.insertBefore(placeholder, dragObj)
          },
          onEnd: (dragObj) => {
            // remove placeholder
            dragObj.parentNode.removeChild(placeholder)

            // remove drag class
            dragObj.classList.remove('drag')
          }
        }
      }
    }
  }
}
</script>
