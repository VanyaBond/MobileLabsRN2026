import React, { createContext, useContext, useState, useEffect } from 'react';

const GameContext = createContext(null);

const INITIAL_QUESTS = [
  { id: 'q1', title: '10 кліків', desc: 'Зробити 10 одиночних натискань', target: 10, current: 0, completed: false },
  { id: 'q2', title: 'Подвійний удар', desc: 'Зробити подвійний клік 5 разів', target: 5, current: 0, completed: false },
  { id: 'q3', title: 'Силове утримання', desc: 'Утримувати сферу 3 секунди', target: 1, current: 0, completed: false },
  { id: 'q4', title: 'Вільний рух', desc: 'Перетягнути об’єкт по екрану (Pan)', target: 1, current: 0, completed: false },
  { id: 'q5', title: 'Двосторонній свайп', desc: 'Зробити Fling вправо та вліво', target: 2, current: 0, completed: false, leftDone: false, rightDone: false },
  { id: 'q6', title: 'Масштабування', desc: 'Змінити розмір об’єкта (Pinch)', target: 1, current: 0, completed: false },
  { id: 'q7', title: 'Перша сотня', desc: 'Набрати сумарно 100 очок', target: 100, current: 0, completed: false },
  { id: 'q8', title: 'Синхронний трюк (Власне)', desc: 'Виконати Pinch під час перетягування (Pan)', target: 1, current: 0, completed: false },
];

export const GameProvider = ({ children }) => {
  const [score, setScore] = useState(0);
  const [clickCount, setClickCount] = useState(0);
  const [doubleClickCount, setDoubleClickCount] = useState(0);
  const [quests, setQuests] = useState(INITIAL_QUESTS);
  const [lastAction, setLastAction] = useState('Торкніться сфери для старту');

  // Оновлення прогресу завдання
  const updateQuestProgress = (questId, updateFn) => {
    setQuests((prev) =>
      prev.map((q) => {
        if (q.id === questId && !q.completed) {
          const updated = updateFn(q);
          const isDone = updated.current >= updated.target;
          return { ...updated, completed: isDone };
        }
        return q;
      })
    );
  };

  // 1) Одиночний тап (+1 очко)
  const handleSingleTap = () => {
    setScore((s) => s + 1);
    setClickCount((c) => c + 1);
    setLastAction('Одиночний клік: +1 очко');
    updateQuestProgress('q1', (q) => ({ ...q, current: q.current + 1 }));
  };

  // 2) Подвійний тап (+2 очки)
  const handleDoubleTap = () => {
    setScore((s) => s + 2);
    setDoubleClickCount((c) => c + 1);
    setLastAction('Подвійний клік: +2 очки');
    updateQuestProgress('q2', (q) => ({ ...q, current: q.current + 1 }));
  };

  // 3) Довге утримання (3 секунди)
  const handleLongPress = () => {
    setScore((s) => s + 15);
    setLastAction('3 сек утримання: Бонус +15 очок!');
    updateQuestProgress('q3', (q) => ({ ...q, current: 1 }));
  };

  // 4) Перетягування (Pan)
  const handlePan = () => {
    setLastAction('Сферу переміщено по екрану!');
    updateQuestProgress('q4', (q) => ({ ...q, current: 1 }));
  };

  // 5) Швидкий свайп (Fling)
  const handleFling = (direction) => {
    const randomBonus = Math.floor(Math.random() * 20) + 5;
    setScore((s) => s + randomBonus);
    setLastAction(`Свайп ${direction === 'right' ? 'вправо' : 'вліво'}: +${randomBonus} очок!`);

    setQuests((prev) =>
      prev.map((q) => {
        if (q.id === 'q5' && !q.completed) {
          const leftDone = direction === 'left' ? true : q.leftDone;
          const rightDone = direction === 'right' ? true : q.rightDone;
          const current = (leftDone ? 1 : 0) + (rightDone ? 1 : 0);
          return { ...q, leftDone, rightDone, current, completed: current >= 2 };
        }
        return q;
      })
    );
  };

  // 6) Масштабування (Pinch)
  const handlePinch = () => {
    setScore((s) => s + 5);
    setLastAction('Масштабування (Pinch): +5 очок!');
    updateQuestProgress('q6', (q) => ({ ...q, current: 1 }));
  };

  // 8) Власне комбіноване завдання (Pinch під час Pan)
  const handleSimultaneousPanPinch = () => {
    setScore((s) => s + 25);
    setLastAction('🔥 СУПЕР-КОМБО: Pan + Pinch (+25 очок)');
    updateQuestProgress('q8', (q) => ({ ...q, current: 1 }));
  };

  // Синхронізація завдання 100 очок
  useEffect(() => {
    updateQuestProgress('q7', (q) => ({ ...q, current: Math.min(score, 100) }));
  }, [score]);

  // Скидання всього прогресу
  const resetGame = () => {
    setScore(0);
    setClickCount(0);
    setDoubleClickCount(0);
    setQuests(INITIAL_QUESTS);
    setLastAction('Гру та прогрес скинуто');
  };

  return (
    <GameContext.Provider
      value={{
        score,
        clickCount,
        doubleClickCount,
        quests,
        lastAction,
        handleSingleTap,
        handleDoubleTap,
        handleLongPress,
        handlePan,
        handleFling,
        handlePinch,
        handleSimultaneousPanPinch,
        resetGame,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) throw new Error('useGame must be used inside GameProvider');
  return context;
};