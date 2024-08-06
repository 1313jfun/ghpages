import React, { useState, useEffect } from 'react';
import './BurnDeck.css';

function BurnDeck() {
  const [board, setBoard] = useState({
    handZone: 0,
    monsterZone: 0,
    extraMonsterZone: 0,
    spellTrapZone: 0,
    fieldSpellZone: 0,
    graveyardZone: 0,
    banishedZone: 0,
    deckZone: 0,
    extraDeckZone: 0
  });
  const [startTime, setStartTime] = useState(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [finalElapsedTime, setFinalElapsedTime] = useState(0);
  const [secretBarrelDamage, setSecretBarrelDamage] = useState();
  const [secretBlastDamage, setSecretBlastDamage] = useState();
  const [justDessertsDamage, setJustDessertsDamage] = useState();
  const [chainStrikeDamage, setChainStrikeDamage] = useState();
  const [totalDamage, setTotalDamage] = useState();
  const [clicked, setClicked] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRuleModalOpen, setIsRuleModalOpen] = useState(false);

  const closeRuleModal = () => {
    setIsRuleModalOpen(false);
  };

  const openRuleCreateModal = () => {
    if (!isRuleModalOpen) setIsRuleModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const openCreateModal = () => {
    if (!isModalOpen) setIsModalOpen(true);
  };

  useEffect(() => {
    let timer;
    if (startTime) {
      timer = setInterval(() => {
        setElapsedTime(((Date.now() - startTime) / 1000).toFixed(3));
      }, 1);
    }
    return () => clearInterval(timer);
  }, [startTime]);

  const getRandomInt = (max) => Math.floor(Math.random() * max);

  const startGame = () => {
    const newBoard = {
      handZone: getRandomInt(8),
      monsterZone: getRandomInt(6),
      extraMonsterZone: getRandomInt(2),
      spellTrapZone: getRandomInt(6),
      fieldSpellZone: getRandomInt(2),
      graveyardZone: getRandomInt(41),
      deckZone: getRandomInt(41),
      banishedZone: getRandomInt(41),
      chainLinkZone: getRandomInt(10),
      extraDeckZone: getRandomInt(16)
    };
    setBoard(newBoard);
    setStartTime(Date.now());
    setElapsedTime(0);
    setClicked(1);
  };
  const calculateTotalDamage = () => {
    calculateSecretBarrelDamage();
    calculateSecretBlastDamage();
    calculateJustDessertsDamage();
    calculateChainStrikeDamage();
    setTotalDamage(secretBarrelDamage + secretBlastDamage + justDessertsDamage + chainStrikeDamage);
    setFinalElapsedTime(elapsedTime); // Store the elapsed time when "Guess!" is clicked
    openCreateModal();
  };

  const calculateSecretBarrelDamage = () => {
    const secretBarrelTotalCards =
      board.handZone +
      board.monsterZone +
      board.extraMonsterZone +
      board.spellTrapZone +
      board.fieldSpellZone;
    setSecretBarrelDamage(secretBarrelTotalCards * 200);
  };

  const calculateSecretBlastDamage = () => {
    const secretBlastTotalCards =
      board.monsterZone +
      board.extraMonsterZone +
      board.spellTrapZone +
      board.fieldSpellZone;
    setSecretBlastDamage(secretBlastTotalCards * 300);
  };

  const calculateJustDessertsDamage = () => {
    const justDessertsTotalCards =
      board.monsterZone +
      board.extraMonsterZone;
    setJustDessertsDamage(justDessertsTotalCards * 500);
  };

  const calculateChainStrikeDamage = () => {
    const chainStrikeTotalCards =
      board.chainLinkZone;
    setChainStrikeDamage(chainStrikeTotalCards * 400);
  };

  const resetGame = () => {
    setBoard({
      handZone: 0,
      monsterZone: 0,
      extraMonsterZone: 0,
      spellTrapZone: 0,
      fieldSpellZone: 0,
      extraDeckZone: 0,
      graveyardZone: 0,
      banishedZone: 0,
      chainLinkZone: 0,
      deckZone: 0
    });
    setStartTime(null);
    setElapsedTime(0);
    setFinalElapsedTime(0);
    setSecretBlastDamage(null);
    setSecretBarrelDamage(null);
    setJustDessertsDamage(null);
    setTotalDamage(null);
    setClicked(0);
    closeModal();
  };

  return (
    <div className="burn-deck-practice-tool">
      <h1>Yugioh Burn Deck Practice Tool</h1>
      <div className="game-board">
        <div className="handZone">Hand: {board.handZone}</div>
        <div className="mainMonsterZone">Monster Zones: {board.monsterZone}</div>
        <div className="extraMonsterZone">Extra Monster Zones: {board.extraMonsterZone}</div>
        <div className="spellAndTrapZone">Spell & Trap Zones: {board.spellTrapZone}</div>
        <div className="fieldSpellZone">Field Spell Zone: {board.fieldSpellZone}</div>
        <div className="graveyardZone">Graveyard: {board.graveyardZone}</div>
        <div className="banishedZone">Banished: {board.banishedZone}</div>
        <div className="extraDeckZone">Extra Deck: {board.extraDeckZone}</div>
        <div className="deckZone">Main Deck: {board.deckZone}</div>
        <div className="chainLinkZone">Chain Links: {board.chainLinkZone}</div>
      </div>
      <button onClick={openRuleCreateModal} className="btn btn-primary">
        How to Play
      </button>
      {isRuleModalOpen && (
        <div className="modal d-block">
                    <span className="close" onClick={closeRuleModal}>
              &times;
            </span>
            <br></br>
            <br></br>
            <br></br>
          <p>This is a Practice Tool designed to assist Chain Burn players in being able to look at the game board quickly and determine how much damage their cards will do.</p>
          <p>Currently this Tool supports the cards: <br></br> Chain Strike - 400 Damage per Chain Link.<br>
          </br> Just Desserts - 500 damage per monster on the opponent's field.<br>
          </br> Secret Barrel - 200 damage per card on the opponent's hand and the field.<br>
          </br>Secret Blast - 300 damage per card on the opponent's field.</p>
          <p>To Play: <br></br>-Click on the 'Ready?' Button, and a timer will begin counting forward. <br>
          </br>-Try to calculate the amount of damage each card will do in your head. <br>
          </br>-When you are ready click the 'Guess!' button<br>
          </br>-A pop-up will appear showing the totals, and how long it took you to answer. Click 'Try Again?' to well... try again.</p>
        </div>
      )}
      <button onClick={startGame} className="btn btn-primary">
        {clicked === 0 ? 'Ready?' : 'Start Over...'}
      </button>
      <button onClick={calculateTotalDamage} className="btn btn-primary">
        Guess!
      </button>
      {totalDamage !== null && totalDamage !== 0 && isModalOpen && (
        <div className="modal d-block">
          <p>Secret Barrel did {secretBarrelDamage} damage!</p>
          <p>Secret Blast did {secretBlastDamage} damage!</p>
          <p>Just Desserts did {justDessertsDamage} damage!</p>
          <p>Chain Strike did {chainStrikeDamage} damage!</p>
          <br></br>
          <p>It took you {finalElapsedTime}s to guess.</p>
          <button onClick={resetGame} className="btn btn-primary">Try Again</button>
        </div>
      )}
      <div className="timer">Time: {elapsedTime}s</div>
    </div>
  );
}

export default BurnDeck;