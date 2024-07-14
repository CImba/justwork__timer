<template>
  <div class="list">
    <div class="list__sector" v-for="(el, idx) in list" :key="idx">
      <p class="list__date">{{ el.date }}</p>
      <p class="list__item" v-for="item in el.list" :key="item.id">
        {{ item.id }}. {{ item.dateStart }} - {{ item.dateEnd }}, works time - {{ item.size }}
      </p>
    </div>
  </div>
</template>

<script>
export default {
  name: "TimerList",
  props: {
    isActiveTimer: Boolean,
    activeTimer: Object
  },

  data() {
    return {
      list: [
        {date: '12-07-2024', list: [
          { id: 1, dateStart: '12-07-2024 16:30', dateEnd: '12-07-2024 16:30', size: '00:00:10' },
          { id: 2, dateStart: '12-07-2024 16:30', dateEnd: '12-07-2024 16:30', size: '00:00:40' },
        ]},
        {date: '13-07-2024', list: [
          { id: 3, dateStart: '13-07-2024 16:30', dateEnd: '13-07-2024 16:30', size: '00:00:10' },
          { id: 4, dateStart: '13-07-2024 17:30', dateEnd: '13-07-2024 17:30', size: '00:00:20' },
          { id: 5, dateStart: '13-07-2024 17:30', dateEnd: '13-07-2024 17:40', size: '00:06:10' },
        ]}
      ]
    }
  },
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
  padding: 20px 20px 0px 20px;
  border: 1px solid #333;
  margin: 10px 0;
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