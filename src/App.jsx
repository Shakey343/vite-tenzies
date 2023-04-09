import React, { useState, useEffect } from "react";
import Die from "./Die";
import { nanoid } from "nanoid";
import Confetti from "react-confetti";

export default function App() {
  const [dice, setDice] = useState(allNewDice());
  const [tenzies, setTenzies] = useState(false);
  const [rollCount, setRollCount] = useState(0);
  const [bestRoll, setBestRoll] = useState(
    JSON.parse(localStorage.getItem("bestRoll")) || 999
  );
  const [timer, setTimer] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [bestTime, setBestTime] = useState(
    JSON.parse(localStorage.getItem("bestTime")) || 999
  );

  useEffect(() => {
    const allHeld = dice.every((die) => die.isHeld);
    const firstValue = dice[0].value;
    const allSameValue = dice.every((die) => die.value === firstValue);
    if (allHeld && allSameValue) {
      setTenzies(true);
    }
  }, [dice]);

  useEffect(() => {
    let interval = null;
    if (isPlaying && !tenzies) {
      interval = setInterval(() => {
        setTimer((timer) => timer + 1);
      }, 1000);
    } else if (!isPlaying && timer !== 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isPlaying, timer, tenzies]);

  function generateNewDie() {
    return {
      value: Math.ceil(Math.random() * 6),
      isHeld: false,
      id: nanoid(),
    };
  }

  function allNewDice() {
    const newDice = [];
    for (let i = 0; i < 10; i++) {
      newDice.push(generateNewDie());
    }
    return newDice;
  }

  function reset() {
    setTenzies(false);
    setDice(allNewDice());
    if (rollCount < bestRoll) {
      setBestRoll(rollCount);
      localStorage.setItem("bestRoll", JSON.stringify(rollCount));
    }
    if (timer < bestTime) {
      setBestTime(timer);
      localStorage.setItem("bestTime", JSON.stringify(timer));
    }
    setRollCount(0);
    setTimer(0);
    setIsPlaying(false);
  }

  function rollDice() {
    if (!tenzies) {
      setRollCount((prevCount) => prevCount + 1);
      setDice((oldDice) =>
        oldDice.map((die) => {
          return die.isHeld ? die : generateNewDie();
        })
      );
    } else {
      reset();
    }
  }

  function holdDice(id) {
    setDice((oldDice) =>
      oldDice.map((die) => {
        return die.id === id ? { ...die, isHeld: !die.isHeld } : die;
      })
    );
  }

  const startGame = () => {
    setIsPlaying(true)
    rollDice()
  }

  const diceElements = dice.map((die) => (
    <Die
      key={die.id}
      value={die.value}
      isHeld={die.isHeld}
      holdDice={() => holdDice(die.id)}
    />
  ));

  return (
    <main>
      {tenzies && <Confetti />}
      <h1 className="title">Tenzies</h1>
      <p className="instructions">
        Roll until all the dice are the same. Click each die to freeze it at its
        current value between rolls. Simple 😌
      </p>
      <div className="dice-container">{diceElements}</div>
      <div className="bottom-row">
        <div className="roll-info">
          <div>Rolls: {rollCount}</div>
          <div>Best: {bestRoll === 999 ? 0 : bestRoll}</div>
        </div>
        {isPlaying ? (
          <button className="roll-dice" onClick={rollDice}>
            {tenzies ? "New Game" : "Roll"}
          </button>
        ) : (
          <button className="roll-dice" onClick={startGame}>
            Start
          </button>
        )}
        <div className="timer-info">
          <div>Timer: {timer}</div>
          <div>Best: {bestTime === 999 ? 0 : bestTime}</div>
        </div>
      </div>
    </main>
  );
}
