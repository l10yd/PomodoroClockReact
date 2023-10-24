import './App.css'
import React from 'react';

export default function App() {
  
  const [timer, setTimer] = React.useState({
    work: 25,
    break: 5,
    session: 'Work',
    timer: "25:00",  
    activeButton: "Start",
    block: false,
  });

  //обработка кнопок + и -
  const updateDuration = (key, increment) => {
    //только если таймер остановлен
    if (!timer.block) {
    setTimer((prevState) => {
      const newValue = prevState[key] + increment;
      //не может быть меньше 1 минуты
      if (newValue >= 1) {
        //обновляем значения work или break
        const updatedTimer = { ...prevState, [key]: newValue };
        if (prevState.session.toLowerCase() === key) {
          //меняется также текущий таймер
          updatedTimer.timer = `${newValue < 10 ? "0" : ""}${newValue}:00`;
        }
        return updatedTimer;
      }
      return prevState; 
    });
    }
  };  

  //отслеживаем декремент каждую секунду через интервал
  React.useEffect(() => {
    let intervalId;
    //если таймер запущен    
    if (timer.block) {
      intervalId = setInterval(() => {
        //таймер хранится в строке, режем ее на минуты и секунды
        const timeParts = timer.timer.split(":");
        let minutes = parseInt(timeParts[0], 10);
        let seconds = parseInt(timeParts[1], 10);
        //если таймер дошел до 0, автоматически переключаем сессию
        if (seconds === 0 && minutes === 0) {
          clearInterval(intervalId);
          if (timer.session === "Work") {
            // если текущая сессия - Work, переключаем на Break
            setTimer((prevState) => ({
              ...prevState,
              session: "Break",
              timer: `${timer.break < 10 ? "0" : ""}${timer.break}:00`,
            }));
          } else if (timer.session === "Break") {
            // если текущая сессия - Break, переключаем на Work
            setTimer((prevState) => ({
              ...prevState,
              session: "Work",
              timer: `${timer.work < 10 ? "0" : ""}${timer.work}:00`,
            }));
          }
        } 
          //иначе просто отнимаем 1 секунду
        else {
          if (seconds === 0) {
            minutes -= 1;
            seconds = 59;
          } else {
            seconds -= 1;
          }

          //собираем строку обратно и возвращаем
          const formattedTime = `${minutes < 10 ? "0" : ""}${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;

          setTimer((prevState) => ({
            ...prevState,
            timer: formattedTime,
          }));
        }
        //для теста обновление 0.1 сек
      }, 100);
    }

    return () => {
      clearInterval(intervalId);
    };
    //вызывается при каждом изменении таймера, даже если жать + и - кнопки
  }, [timer]);

  //для запуска таймера
  const startTimer = () => {
    setTimer((prevState) => ({
      ...prevState,
      activeButton: "Stop",
      block: true,
    }));
  };

  //остановка таймера
  const stopTimer = () => {
    setTimer((prevState) => ({
      ...prevState,
      activeButton: "Start",
      block: false,
    }));
  };

  //сброс на дефолт
  const resetTimer = () => {
    setTimer({
      work: 25,
      break: 5,
      session: 'Work',
      timer: "25:00",  
      activeButton: "Start",
      block: false,    
    });
  };
  
  return (
    <div className="App">
      <div id="title">
        Pomodoro
        </div>
      <div id="timer-titles">
        <div id="session-label">Work: {timer.work}</div>
        <div id="break-label">Break: {timer.break}</div>
      </div>
      <div id="button-panel">
        <button id="work-minus" onClick={() => updateDuration('work', -1)}>-</button>
        <button id="work-plus" onClick={() => updateDuration('work', 1)}>+</button>
        <button id="break-minus" onClick={() => updateDuration('break', -1)}>-</button>
        <button id="break-plus" onClick={() => updateDuration('break', 1)}>+</button>
      </div>
      <div id="current-title">
        {timer.session}
      </div>
      <div id="timer">
        {timer.timer}
      </div>
      <div id="start-button">
        {timer.activeButton === "Start" ? (
          <button id="start" onClick={startTimer}>Start</button>
        ) : (
          <button id="stop" onClick={stopTimer}>Stop</button>
        )}
      </div> 
      <div id="reset-button">
        <button id="reset" onClick={resetTimer}>Reset</button>
      </div>
    </div>

  )
}
