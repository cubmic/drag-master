<template>
  <div>
    <div v-for="list in lists" :key="list.id">
      <h2>{{ list.title }}</h2>
      <ul v-drop="dropDefs(list)">
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
  transition: height 1s, opacity 1s, margin 1s, padding 1s, border 1s;
  opacity: 1.0;
}
.hide {
  opacity: 0;
  margin: 0;
  padding: 0;
  height: 0;
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
      dropDefs: (dropData) => {
        return {
          data: dropData,
          placeholder: true,
          onDrop: (data) => {
            data.oldParentData.items.splice(data.startIndex, 1)
            data.dropData.items.splice(data.endIndex, 0, data.dragData)
          }
        }
      },
      dragDefs: (dragData) => {
        return {
          parent: () => this.$el,
          lockX: true,
          data: dragData,
          onStart: (data) => {
            // add drag class
            data.dragObj.classList.add('drag')
          },
          onEnd: (data) => {
            // remove drag class
            data.dragObj.classList.remove('drag')
          }
        }
      }
    }
  }
}
</script>
