<template>
  <div class="timerControlBlock">
    <p v-if="status === 'stop'" style="text-align: left">New timer</p>
    <div class="timer" v-if="status !== 'stop'">{{ formatTimer(currentTimer) }}</div>
    <button
        v-for="(el, idx) in controlsElements"
        :key="idx"
        @click="onActionTimer(el.name)"
        :disabled="el.disable"
    >
      {{ el.name }}
    </button>
    <div v-if="status === 'stop'" class="setting">
      <input v-model="myTimerOurs" value="123" class="time" type="number" min="0" />
      <span>:</span>
      <input v-model="myTimerMinutes" class="time" type="number" min="0" max="59" />
      <span>:</span>
      <input v-model="myTimerSeconds" class="time" type="number" min="0" max="59" />
      <span class="longSpace"> - </span>
      <input v-model="myTimerControl" type="number" min="0" />
      <p class="hint">HH:mm:ss - time in seconds</p>
    </div>
    <p v-if="status !== 'stop'"> {{ activeTimer.description }}</p>
    <textarea v-else v-model="newTimer.description" class="desc" placeholder="Description"></textarea>
  </div>
</template>

<script>
export default {
  name: "TimerControl",
  props: {
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
        { name: 'play', icon: '', disable: false },
        { name: 'stop', icon: '', disable: true },
        { name: 'pause', icon: '', disable: true }
      ],
      newTimer: {
        status: '',
        dateStart: '',
        dateEnd: '',
        plannedTime: 60*60,
        description: '',
        size: 0
      },
      currentTimer: {
        ours: 0,
        minutes: 0,
        seconds: 0,
        controlTime: 0
      },
      myTimerOurs: 0,
      myTimerMinutes: 0,
      myTimerSeconds: 0,
      myTimerControl: 0,
    }
  },
  computed: {
    status() {
      return this.activeTimer.status;
    },
  },
  watch: {
    status(val) {
      this.controlsElements[0].disable = val !== 'stop';
      this.controlsElements[1].disable = val === 'stop';
      this.controlsElements[2].disable = val === 'stop';
      if (val !== 'stop')
        this.currentTimer = this.onSetTimeByControl(this.activeTimer.plannedTime);
      if (val === 'play')
        setTimeout(this.onTimerStep, 1000);
      // if (val === 'play') {
      //   this.currentTimer = this.onSetTimeByControl(this.activeTimer.plannedTime);
      //   setTimeout(this.onTimerStep, 1000);
      //   this.controlsElements[0].disable = true;
      //   this.controlsElements[1].disable = false;
      //   this.controlsElements[2].disable = false;
      // } else if (val === 'stop') {
      //   this.controlsElements[0].disable = false;
      //   this.controlsElements[1].disable = true;
      //   this.controlsElements[2].disable = true;
      // } else {
      //   this.currentTimer = this.onSetTimeByControl(this.activeTimer.plannedTime);
      //   this.controlsElements[0].disable = true;
      //   this.controlsElements[1].disable = true;
      //   this.controlsElements[2].disable = false;
      // }
    },
    myTimerOurs(val) {
      val = this.onCheckTimeVal(val, 'long');
      this.myTimerOurs = val;
      this.myTimerControl = this.myTimerOurs*60*60 + this.myTimerMinutes*60 + this.myTimerSeconds;
    },
    myTimerMinutes(val) {
      val = this.onCheckTimeVal(val, 'short');
      this.myTimerMinutes = val;
      this.myTimerControl = this.myTimerOurs*60*60 + this.myTimerMinutes*60 + this.myTimerSeconds;
    },
    myTimerSeconds(val) {
      val = this.onCheckTimeVal(val, 'short');
      this.myTimerSeconds = val;
      this.myTimerControl = this.myTimerOurs*60*60 + this.myTimerMinutes*60 + this.myTimerSeconds;
    },
    myTimerControl(val) {
      const tmpVal = this.myTimerOurs*60*60 + this.myTimerMinutes*60 + this.myTimerSeconds;
      if (val !== tmpVal) {
        val = this.onCheckTimeVal(val, 'long');
        this.myTimerControl = val;
        let tmpTimer = this.onSetTimeByControl(val);
        this.myTimerOurs = tmpTimer.ours;
        this.myTimerMinutes = tmpTimer.minutes;
        this.myTimerSeconds = tmpTimer.seconds;
      }
    }
  },
  methods: {
    /**
     * Проверка и обрезание значения времени
     * @param val Значение
     * @param type short - не больше 60, long - не ограничен по длине
     * @returns {number|number|number} Положительное значение (<= 60, если было указано)
     */
    onCheckTimeVal(val = 0, type = 'short') {
      val = Number(val);
      val = val < 0 ? -1*val : val;
      if (type === 'long')
        return val;
      return val < 60 ? val : 59;
    },
    /**
     * Форматирование времени
     * @param time Объект времени (часы, минуты. секунды, общее в секундах)
     * @returns {string} Строка в формате hh:mm:ss
     */
    formatTimer(time = this.currentTimer) {
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
        if (this.currentTimer.controlTime < 1)
          this.$emit('stop-timer');
      }
    },
    onActionTimer(action = '') {
      switch (action) {
        case 'play':
          this.newTimer.plannedTime = this.myTimerControl > 0 ? this.myTimerControl : 60*60;
          this.newTimer.status = 'play';
          this.newTimer.dateStart = new Date();
          this.$emit('start-timer', this.newTimer);
          break;

        case 'pause':
          this.$emit('pause-timer');
          break;

        case 'stop':
          this.$emit('stop-timer');
          break;

        default:
          console.error('some new controls');
          break;
      }
    },
    onSetTimeByControl(time = 0) {
      const ours = Number(Math.trunc(time / (60 * 60)));
      const minutes = Number(Math.trunc((time - ours*60*60) / 60));
      const second = Number(time - ours * 60 * 60 - minutes * 60);
      return {
        ours: ours,
        minutes: minutes,
        seconds: second,
        controlTime: time
      };
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
    margin: 20px 0;
  }
  button {
    border: 1px solid #eee;
    padding: 5px 10px;
    margin: 10px 5px;
    border-radius: 6px;
    color: #333;
  }
  button:hover, button:focus {
    background: #fff;
    cursor: pointer;
  }
  button:disabled {
    cursor: not-allowed;
    opacity: 0.7;
  }
  .timer {
    font-size: 24px;
    padding: 10px 0;
    margin: 0 0 30px 0;
  }
  .desc {
    width: 100%;
    min-height: 40px;
    margin: 10px 0 0 0;
    border-radius: 6px;
    border: 1px solid #999;
    padding: 5px 10px;
    box-sizing: border-box;
  }
  .longSpace {
    display: inline-block;
    width: 30px;
    text-align: center;
  }
  .time {
    min-width: 30px;
  }
  input {
    font-size: 14px;
    padding: 3px 0 3px 5px;
    box-sizing: border-box;
  }
  .hint {
    margin: 5px 0 10px 0px;
    font-size: 0.9em;
  }
  .setting {
    margin: 10px 0 0 0;
  }
</style>