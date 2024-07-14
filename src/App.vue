<template>
  <div class="main">
    <TimerControl
        :active-timer="activeTimer"
        @pause-timer="onPause"
        @start-timer="onStart"
        @stop-timer="onStop"
    />

    <TimerList :timers-list="timersList" />
  </div>
</template>

<script>
import TimerControl from "@/components/timer/TimerControl";
import TimerList from "@/components/timer/TimerList";
import { ApiServiceTimers } from "@/sevices/api/ApiServiceTimers";

export default {
  name: 'App',
  components: {
    TimerList,
    TimerControl
  },
  data() {
    return {
      timersList: [],
      activeTimer: {
        id: 0,
        status: 'stop',
        dateStart: '',
        dateEnd: '',
        plannedTime: 60*60,
        description: '',
        size: 0
      }
    }
  },
  mounted() {
    this.onGetTimersList();
  },
  methods: {
    onPause() {
      if (this.activeTimer.status === 'play') {
        this.activeTimer.status = 'pause';
        this.onUpdateActiveTimer();
        ApiServiceTimers.updateTimer(this.activeTimer, this.activeTimer.id);
      } else {
        this.activeTimer.status = 'play';
      }
    },
    onStart(newTimer) {
      ApiServiceTimers.setNewTimer(newTimer)
          .then(() => {
            this.onGetTimersList();
          })
          .catch(error => {
            console.error(error);
          });
    },
    onStop(timer) {
      this.activeTimer.status = 'stop';
      if (timer !== undefined)
        this.activeTimer = { ...timer };
      this.onUpdateActiveTimer();
      ApiServiceTimers.updateTimer(this.activeTimer, this.activeTimer.id)
        .then(() => {
          this.onGetTimersList();
        })
        .catch(error => {
          console.error(error);
        });
    },
    onUpdateActiveTimer() {
      let timeNow = new Date();
      let start = new Date(this.activeTimer.dateStart);
      if (this.activeTimer.dateEnd !== '')
        start = new Date(this.activeTimer.dateEnd);
      let plan = (start.getTime() + this.activeTimer.plannedTime * 1000) - timeNow.getTime();
      this.activeTimer.size += Number(Math.trunc((timeNow - start) / 1000));
      this.activeTimer.dateEnd = new Date();
      this.activeTimer.plannedTime = Math.trunc(plan / 1000);
    },
    onGetTimersList() {
      this.timersList = [];
      ApiServiceTimers.getTimersList()
          .then( (data) => {
            this.timersList = data.data;
          })
          .catch( error => {
            console.error(error);
          });
    }
  }
}
</script>

<style>
#app {
  font-family: Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

.main {
  display: flex;
  align-items: flex-start;
  justify-content: center;
  flex-wrap: wrap;
}
</style>
