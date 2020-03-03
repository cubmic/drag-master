<template>
  <div>
    <div v-for="list in lists" :key="list.id">
      <h2>{{ list.title }}</h2>
      <ul v-drop="dropDefs()">
        <li
          v-for="item in list.items"
          :key="item.id"
          v-drag="dragDefs(item)"
        >
          {{ item.name }}
        </li>
      </ul>
      <br />
    </div>
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
  background: #CCC;
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
  data () {
    return {
      lists: [
        {
          id: 1,
          color: '975',
          title: 'Items',
          items: [
            { id: 1, name: 'Coke' },
            { id: 2, name: 'Orange Juice' },
            { id: 3, name: 'Apple' },
            { id: 4, name: 'Cornflakes' },
            { id: 5, name: 'Banana' }
          ]
        },
        {
          id: 2,
          color: '579',
          title: 'Shopping list',
          items: [
            { id: 6, name: 'Wine' },
            { id: 7, name: 'Milk' }
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
              console.log('enter', dragObj, dropObj)
            }
          },
          onLeave: (dragObj, dropObj) => {
            if (dragObj.parentNode !== dropObj) {
              console.log('leave', dragObj, dropObj)
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
            placeholder = document.createElement('li')
            placeholder.classList.add('placeholder')
            dragObj.parentNode.insertBefore(placeholder, dragObj)

            dragObj.classList.add('drag')
          },
          onDrag: (dragObj) => {
            dragObj.parentNode.insertBefore(placeholder, dragObj)
          },
          onEnd: (dragObj) => {
            dragObj.parentNode.removeChild(placeholder)

            dragObj.classList.remove('drag')
          }
        }
      }
    }
  }
}
</script>
