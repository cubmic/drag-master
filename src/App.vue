<template>
  <div id="app">
    <span @click="page = 1" :class="{ active: page === 1 }">Drag&Drop</span>
    <span @click="page = 2" :class="{ active: page === 2 }">Lists</span>
    <div class="page">
      <drag v-if="page === 1" />
      <list v-if="page === 2" />
    </div>
  </div>
</template>

<style>
#app {
  margin: 10px;
}
#app * {
  font-family: Verdana, Geneva, Tahoma, sans-serif;
}
#app span {
  background: #697;
  margin: 5px 5px 5px 0;
  padding: 5px;
  cursor: pointer;
  color: #FFF;
}
#app span.active {
  background: rgb(20, 104, 48);
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
      page: 2
    }
  }
}
</script>
