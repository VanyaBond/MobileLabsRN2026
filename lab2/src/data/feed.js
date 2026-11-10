const TOPICS = ['Наука', 'Освіта', 'Спорт', 'Технології', 'Культура', 'Місто'];

const LOREM =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum feugiat arcu at venenatis, vivamus gravida diam augue non vestibulum eros. Integer commodo tortor in porta ornare, aliquam consectetur justo vel sapien vulputate finibus.';

export const PAGE_SIZE = 20;
export const INITIAL_COUNT = 120;

export function buildPost(index) {
  const day = (index % 28) + 1;
  return {
    id: String(index),
    topic: TOPICS[index % TOPICS.length],
    headline: `Публікація №${index + 1}`,
    published: `${String(day).padStart(2, '0')}.11.2026`,
    teaser: `Короткий анонс публікації ${index + 1}. ${LOREM.slice(0, 70)}…`,
    body: `${LOREM}\n\n${LOREM}`,
    cover: `https://picsum.photos/seed/lab2-${index}/600/300`,
  };
}

export function buildPosts(from, count) {
  return Array.from({ length: count }, (_, i) => buildPost(from + i));
}

export const FAQ_GROUPS = [
  {
    title: 'Акаунт',
    data: [
      { id: 'a1', question: 'Як увійти в застосунок?', answer: 'Введіть будь-яку пошту та пароль від 4 символів на екрані входу.' },
      { id: 'a2', question: 'Як вийти з акаунта?', answer: 'Відкрийте бічне меню та натисніть «Вийти».' },
    ],
  },
  {
    title: 'Стрічка',
    data: [
      { id: 'f1', question: 'Як оновити список?', answer: 'Потягніть стрічку вниз — спрацює Pull-to-Refresh.' },
      { id: 'f2', question: 'Чому підвантажуються нові дописи?', answer: 'При прокрутці до кінця спрацьовує onEndReached і додається наступна порція.' },
      { id: 'f3', question: 'Як відкрити деталі?', answer: 'Натисніть на картку — відкриється екран з динамічним маршрутом.' },
    ],
  },
  {
    title: 'Технічне',
    data: [
      { id: 't1', question: 'Яка навігація використана?', answer: 'Expo Router: Drawer із вкладеним Stack.' },
      { id: 't2', question: 'Що таке віртуалізація?', answer: 'Рендеряться лише елементи біля видимої області екрана.' },
    ],
  },
];
