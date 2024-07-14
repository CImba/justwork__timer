<template>
  <div class="timerControlBlock">
    <div class="timer" v-if="isActiveTimer">{{ formatTimer(currentTimer) }}</div>
    <button v-for="(el, idx) in controlsElements" :key="idx" @click="onActionTimer(el.action)">{{ el.name }}</button>
    <p v-if="isActiveTimer"> {{ activeTimer.description }}</p>
    <input v-else type="textarea" v-model="newTimer.description">
  </div>
</template>

<script>
export default {
  name: "TimerControl",
  props: {
    isActiveTimer: Boolean,
    activeTimer: Object
  },
  emits: {
    'stop-timer': null,
    'start-timer': null,
    'pause-timer': null
  },

  data() {
    return {
      controlsElements: [
        { name: 'play', icon: 'play_circle', action: 'onPlayTimer' },
        { name: 'stop', icon: '', action: 'onStopTimer' },
        { name: 'pause', icon: '', action: 'onPauseTimer' }
      ],
      newTimer: {
        status: '',
        dateStart: '',
        dateEnd: '',
        plannedTime: 60*60,
        currentTime: 60*60,
        description: ''
      },
      currentTimer: {
        ours: 0,
        minutes: 0,
        seconds: 0,
        controlTime: 0
      }
    }
  },
  computed: {
  },
  created() {
    console.log('created');
    console.log(this.activeTimer);
    const timer = this.isActiveTimer ? this.activeTimer : this.newTimer;
    const ours = Math.trunc(timer.currentTime / (60*60));
    const minutes = Math.trunc((timer.currentTime - ours) / 60);
    const second = timer.currentTime - ours*60*60 - minutes*60;
    this.currentTimer = {
      ours: ours,
      minutes: minutes,
      seconds: second,
      controlTime: timer.currentTime
    };
    if (this.isActiveTimer)
      setTimeout(this.onTimerStep, 1000);
  },
  methods: {
    /**
     * Вывод красивого тайме
     * @param time Объект с выводимым временем
     */
    formatTimer(time = this.currentTimer) {
      // return h:mm:ss
      let answer = '';
      answer += time.ours > 0 ? time.ours + ':' : '';
      answer += time.minutes < 10 ? '0' : '';
      answer += time.minutes + ':';
      answer += time.seconds < 10 ? '0' : '';
      answer += time.seconds;
      return answer;
    },
    /**
     * "Тик" таймера
     */
    onTimerStep() {
      if (this.currentTimer.controlTime > 0 && this.activeTimer.status === 'play') {
        setTimeout(this.onTimerStep, 1000);
        this.currentTimer.controlTime--;
        if (this.currentTimer.seconds === 0) {
          this.currentTimer.seconds = 59;
          if (this.currentTimer.minutes === 0) {
            this.currentTimer.ours--;
            this.currentTimer.minutes = 59;
          } else {
            this.currentTimer.minutes--;
          }
        } else {
          this.currentTimer.seconds--;
        }
      } else {
        // stop
        console.log('timer stop');
      }
    },
    /**
     * Управление таймером
     * @param action действие
     */
    onActionTimer(action = '') {
      switch (action) {
        case 'onPlayTimer':
          console.log('play');
          break;

        case 'onPauseTimer':
          console.log('pause');
          this.$emit('pause-timer');
          break;

        case 'onStopTimer':
          console.log('stop');
          break;

          default:
            console.log('default!!!!');
            break;
      }
    }
  }
}
</script>

<style scoped>
  .timerControlBlock {
    display: block;
    width: 500px;
    max-width: 100%;
    padding: 20px 30px;
    border: 1px solid #333;
    margin: 20px 0 0 0;
  }
  button {
    border: 1px solid #eee;
    padding: 5px 10px;
    margin: 10px 5px;
    border-radius: 6px;
    color: #333;
  }
  button:hover, button:focus {
    background: #efefef;
    cursor: pointer;
  }
  .timer {
    font-size: 24px;
    padding: 10px 0;
    margin: 0 0 30px 0;
  }
</style>