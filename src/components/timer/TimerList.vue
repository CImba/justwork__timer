<template>
  <div class="list">
    <div class="list__sector" v-for="item in timersList" :key="item.id">
      <p class="list__date" v-if="idList.includes(item.id)">{{ formatDate(item.dateStart) }}</p>
      <p class="list__item">
        {{ item.id }}. {{ formatDate(item.dateStart) }} - {{ formatDate(item.dateEnd) }}, works time - {{ formatTime(item.size) }}
      </p>
    </div>
  </div>
</template>

<script>
export default {
  name: "TimerList",
  props: {
    timersList: Array,
    idList: Array
  },

  data() {
    return {
    }
  },
  computed: {
    uniqDate() {
      let list = [];
      this.timersList.forEach(el => {
        if (!(list.includes(this.formatDate(el.dateStart))))
          list.push(el.dateStart)
      });
      return list;
    }
  },
  methods: {
    onTest() {},
    formatDate(date) {
      date = new Date(date);
      return `${this.onAddZero(date.getDate())}-${this.onAddZero(date.getMonth())}-${date.getFullYear()}`;
    },
    formatTime(time) {
      let ours = Number(Math.trunc(time/(60*60)));
      let minutes = Number(Math.trunc((time - ours*60*60)/60));
      let seconds = Number(time - ours*60*60 - minutes*60);
      return `${this.onAddZero(ours)}:${this.onAddZero(minutes)}:${this.onAddZero(seconds)}`
    },
    onAddZero(val) {
      return val < 10 ? `0${val}` : val;
    }
  }
}
</script>

<style scoped>
.list {
  width: 550px;
  max-width: 100%;
  font-size: 14px;
  padding: 10px 20px;
}
.list__sector {
  position: relative;
}
.list__date {
  color: #999;
  font-size: 1.1em;
  position: absolute;
  top: -10px;
  left: 10px;
  margin: 0;
  background: #fff;
  padding: 1px 5px;
}
.list__item {
  margin: 0 0 10px 0;
}
</style>