import React, { createContext, useContext, useState, useCallback } from 'react';

const PortalContext = createContext(null);

const CATEGORIES = ['Політика', 'Технології', 'Економіка', 'Культура', 'Спорт', 'Наука'];
const NEWS_STATUSES = ['Опубліковано', 'Чернетка', 'На перевірці'];
const USER_ROLES = ['Адміністратор', 'Редактор', 'Автор', 'Модератор'];

const generateInitialNews = () => {
  return Array.from({ length: 55 }, (_, i) => {
    const id = `news-${i + 1}`;
    const category = CATEGORIES[i % CATEGORIES.length];
    const status = NEWS_STATUSES[i % NEWS_STATUSES.length];
    return {
      id,
      title: `Новина #${i + 1}: Важливі оновлення у сфері ${category.toLowerCase()}`,
      category,
      status,
      imageUrl: `https://picsum.photos/seed/${id}/600/350`,
      body: `Детальний аналітичний текст публікації #${i + 1}. Подія охоплює широкий спектр питань, актуальних для галузі ${category.toLowerCase()}. Продовжуються експертні обговорення та впровадження нових підходів до вирішення поточних завдань.`,
      createdAt: new Date(Date.now() - i * 3600000 * 5).toLocaleString('uk-UA'),
    };
  });
};


const generateInitialUsers = () => {
  const names = ['Олександр', 'Дмитро', 'Ірина', 'Максим', 'Юлія', 'Андрій', 'Олена', 'Сергій', 'Богдан', 'Марія'];
  const surnames = ['Коваленко', 'Мельник', 'Шевченко', 'Бондар', 'Бойко', 'Кравченко', 'Олійник', 'Ткачук'];
  return Array.from({ length: 55 }, (_, i) => {
    const id = `user-${i + 1}`;
    const name = `${names[i % names.length]} ${surnames[i % surnames.length]}`;
    return {
      id,
      name,
      email: `user${i + 1}@pulseportal.ua`,
      role: USER_ROLES[i % USER_ROLES.length],
      status: i % 6 === 0 ? 'Заблокований' : 'Активний',
    };
  });
};

export const PortalProvider = ({ children }) => {
  const [session, setSession] = useState({
    isAuthenticated: false,
    admin: {
      name: 'Владислав Адмінський',
      email: 'admin@pulsecms.io',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    },
  });

  const [news, setNews] = useState(generateInitialNews());
  const [users, setUsers] = useState(generateInitialUsers());
  const [logs, setLogs] = useState([]);

  const [newsFilterCategory, setNewsFilterCategory] = useState('ALL');
  const [newsFilterStatus, setNewsFilterStatus] = useState('ALL');
  const [userFilterStatus, setUserFilterStatus] = useState('ALL');
  const [userFilterRole, setUserFilterRole] = useState('ALL');

  const recordAuditLog = useCallback((eventType, targetInfo) => {
    const newEntry = {
      id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      action: eventType,
      details: targetInfo,
      timestamp: new Date().toLocaleTimeString('uk-UA', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      date: new Date().toLocaleDateString('uk-UA'),
    };
    setLogs((prev) => [newEntry, ...prev]);
  }, []);

  const authenticate = (email, password) => {
    if (email.includes('@') && password.length >= 4) {
      setSession((prev) => ({ ...prev, isAuthenticated: true }));
      recordAuditLog('Вхід у систему', `Авторизація адміна: ${email}`);
      return true;
    }
    return false;
  };

  const terminateSession = () => {
    recordAuditLog('Вихід із системи', `Сесію завершено для: ${session.admin.email}`);
    setSession((prev) => ({ ...prev, isAuthenticated: false }));
  };

  const createNewsItem = (itemData) => {
    const newItem = {
      ...itemData,
      id: `news-${Date.now()}`,
      createdAt: new Date().toLocaleString('uk-UA'),
    };
    setNews((prev) => [newItem, ...prev]);
    recordAuditLog('Створення новини', `Створено публікацію: "${newItem.title.slice(0, 30)}..."`);
  };

  const updateNewsItem = (id, updatedFields) => {
    setNews((prev) => prev.map((item) => (item.id === id ? { ...item, ...updatedFields } : item)));
    recordAuditLog('Редагування новини', `Оновлено новину [ID: ${id}]`);
  };

  const removeNewsItem = (id) => {
    const item = news.find((n) => n.id === id);
    setNews((prev) => prev.filter((n) => n.id !== id));
    recordAuditLog('Видалення новини', `Видалено новину [${id}]: "${item?.title?.slice(0, 25) || ''}..."`);
  };

  const toggleUserStatus = (userId) => {
    setUsers((prev) =>
      prev.map((user) => {
        if (user.id === userId) {
          const nextStatus = user.status === 'Активний' ? 'Заблокований' : 'Активний';
          recordAuditLog('Зміна статусу користувача', `Користувач [${user.name}] переведений у статус "${nextStatus}"`);
          return { ...user, status: nextStatus };
        }
        return user;
      })
    );
  };

  const filteredNews = news.filter((item) => {
    const matchCategory = newsFilterCategory === 'ALL' || item.category === newsFilterCategory;
    const matchStatus = newsFilterStatus === 'ALL' || item.status === newsFilterStatus;
    return matchCategory && matchStatus;
  });

  const filteredUsers = users.filter((u) => {
    const matchStatus = userFilterStatus === 'ALL' || u.status === userFilterStatus;
    const matchRole = userFilterRole === 'ALL' || u.role === userFilterRole;
    return matchStatus && matchRole;
  });

  return (
    <PortalContext.Provider
      value={{
        session,
        news,
        users,
        logs,
        filteredNews,
        filteredUsers,
        authenticate,
        terminateSession,
        createNewsItem,
        updateNewsItem,
        removeNewsItem,
        toggleUserStatus,
        CATEGORIES,
        NEWS_STATUSES,
        USER_ROLES,
        newsFilterCategory,
        setNewsFilterCategory,
        newsFilterStatus,
        setNewsFilterStatus,
        userFilterStatus,
        setUserFilterStatus,
        userFilterRole,
        setUserFilterRole,
      }}
    >
      {children}
    </PortalContext.Provider>
  );
};

export const usePortal = () => {
  const context = useContext(PortalContext);
  if (!context) throw new Error('usePortal must be used within PortalProvider');
  return context;
};