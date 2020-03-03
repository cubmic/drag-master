<template>
  <div id="app">
    <span @click="page = 'Drag&Drop'">Drag&Drop</span>
    <span @click="page = 'List'">List</span>
    <div class="page">
      <drag v-if="page === 'Drag&Drop'" />
      <list v-if="page === 'List'" />
    </div>
  </div>
</template>

<style>
#app * {
  font-family: Verdana, Geneva, Tahoma, sans-serif;
  box-sizing: border-box;
}
#app span {
  background: #697;
  margin: 5px 5px 5px 0;
  padding: 5px;
  cursor: pointer;
  color: #FFF;
}
#app span:hover {
  background: #7A8;
}
#app .page {
  margin-top: 30px;
}
</style>

<script>
import drag from './components/drag.vue'
import list from './components/list.vue'

export default {
  name: 'App',
  components: {
    drag,
    list
  },
  data () {
    return {
      page: 'Drag&Drop'
    }
  }
}
</script>
