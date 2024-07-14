import axios from "axios";

class ApiServiceTimers {
    constructor() {
        //super();
    }

    /**
     * Получение списка всех таймеров
     * @returns {Promise<axios.AxiosResponse<any>>}
     */
    getTimersList() {
        return axios.get('https://66939122c6be000fa07c4b8b.mockapi.io/api/JWtimer/timers');
    }

    /**
     * Создание нового таймера
     * @param timer Таймер
     * @returns {Promise<axios.AxiosResponse<any>>}
     */
    setNewTimer(timer = {}) {
        return axios.post('https://66939122c6be000fa07c4b8b.mockapi.io/api/JWtimer/timers', { ...timer });
    }

    /**
     * Обновление таймера в списке существующих
     * @param timer Таймер
     * @param id Номер обновляемого таймера
     * @returns {Promise<axios.AxiosResponse<any>>}
     */
    updateTimer(timer = {}, id) {
        return axios.put(`https://66939122c6be000fa07c4b8b.mockapi.io/api/JWtimer/timers/${id}`, { ...timer });
    }

}

const ApiServiceTimersInstance = new ApiServiceTimers();
export { ApiServiceTimersInstance as ApiServiceTimers };
