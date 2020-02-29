<template>
  <div>
    <template v-for="(item, i) in items">
      <div
        v-if="item.drag && item.drop"
        class="square"
        :key="item.id"
        v-drag="dragDefs(item)"
        v-drop="dropDefs(item)"
        :style="'left:' + (i * 120 + 10) + 'px; top:50px; background: #' + item.color"
      >
        drag & drop
      </div>
      <div
        v-else-if="item.drag"
        class="square"
        :key="item.id"
        v-drag="dragDefs(item)"
        :style="'left:' + (i * 120 + 10) + 'px; top:50px; background: #' + item.color"
      >
        drag
      </div>
      <div
        v-else-if="item.drop"
        class="square"
        :key="item.id"
        v-drop="dropDefs(item)"
        :style="'left:' + (i * 120 + 10) + 'px; top:50px; background: #' + item.color"
      >
        drop
      </div>
    </template>
  </div>
</template>

<style>
.square {
  position: absolute;
  width: 100px;
  height: 100px;
  background: #CCC;
  border: 5px solid #000;
  z-index: 0;
}
</style>

<script>
export default {
  name: 'PageIndex',
  data () {
    return {
      items: [
        { id: 1, color: '579', drag: true },
        { id: 2, color: '975', drag: true },
        { id: 3, color: '597', drag: true },
        { id: 4, color: 'F88', drag: true, drop: true },
        { id: 5, color: '88F', drop: true }
      ],
      dragDefs: (defData) => {
        return {
          data: defData,
          onStart: (dragObj) => {
            dragObj.style.zIndex = 2
          },
          onEnd: (dragObj) => {
            dragObj.style.zIndex = 0
          }
        }
      },
      dropDefs: (defData) => {
        let oldColor = defData.color
        return {
          onEnter: (dragObj, data) => {
            defData.color = data.color
          },
          onLeave: () => {
            defData.color = oldColor
          }
          /*,
          onDrop: (dragObj, data) => {
            // console.log('drop', dragObj, data.id)
          }
          */
        }
      }
    }
  }
}
</script>
