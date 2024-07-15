<template>
  <div class="main">
    <TimerControl
        :active-timer="activeTimer"
        @pause-timer="onPause"
        @start-timer="onStart"
        @stop-timer="onStop"
    />

    <TimerList :timers-list="timersList" :id-list="idList" />
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
      idList: [],
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
        ApiServiceTimers.updateTimer(this.activeTimer, this.activeTimer.id)
            .then(data => {
              this.activeTimer = data.data;
            })
            .catch(error => console.error(error));
      } else {
        this.activeTimer.status = 'play';
      }
    },
    onStart(newTimer) {
      ApiServiceTimers.setNewTimer(newTimer)
          .then((data) => {
            this.activeTimer = newTimer;
            this.activeTimer.id = data.data.id;
          })
          .catch(error => {
            console.error(error);
          });
    },
    onStop(timer) {
      this.activeTimer.status = 'stop';
      if (timer !== undefined)
        this.activeTimer = timer;
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
      let past = timeNow.getTime() - start.getTime();
      this.activeTimer.size += Number(Math.trunc(past / 1000));
      this.activeTimer.dateEnd = new Date();
      this.activeTimer.plannedTime -= Number(Math.trunc(past / 1000));
    },
    onGetTimersList() {
      this.timersList = [];
      this.idList = [];
      ApiServiceTimers.getTimersList()
          .then( (data) => {
            this.timersList = data.data.filter(el => el.status === 'stop');
            let tmpDate = '';
            this.idList = data.data.map(el => {
              if (!this.isEqualDays(tmpDate, el.dateStart)) {
                tmpDate = el.dateStart;
                return el.id;
              }
            });
            let lastTimer = data.data[data.data.length - 1];
            if (lastTimer.status !== 'stop') {
              this.activeTimer = { ...lastTimer };
              let timeNow = new Date();
              let timeStart = new Date(lastTimer.dateStart);
              this.activeTimer.plannedTime =
                  Number(Math.trunc((timeStart.getTime() + lastTimer.plannedTime*1000 - timeNow.getTime())/1000));
            }
          })
          .catch( error => {
            console.error(error);
          });
    },
    isEqualDays(date1, date2) {
      if (date1 === '' || date2 === '')
        return false;
      date1 = new Date(date1);
      date2 = new Date(date2);
      return date1.getDate() === date2.getDate() && date1.getFullYear() === date2.getFullYear() && date1.getMonth() === date2.getMonth();
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
