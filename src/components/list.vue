<template>
  <div>
    <template v-for="list in lists">
      <ul :key="list.id" v-drop="dropDefs(list)">
        <li
          v-for="item in list.items"
          :key="item.id"
          v-drag="dragDefs(item)"
        >
          {{ item.name }}
        </li>
      </ul>
      <br :key="list.id + 'br'" />
    </template>
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
          items: [
            { id: 1, name: 'Tamara' },
            { id: 2, name: 'Michel' },
            { id: 3, name: 'Jessica' },
            { id: 4, name: 'Jan' },
            { id: 5, name: 'Anina' }
          ]
        },
        {
          id: 2,
          color: '579',
          items: [
            { id: 6, name: 'Musterman' },
            { id: 7, name: 'Trudi' }
          ]
        }
      ],
      sortDefs: {
        byY: true
      },
      dropDefs: () => {
        return {
          onEnter: () => {
            console.log('enter')
          },
          onLeave: () => {
            console.log('leave')
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
