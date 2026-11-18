import { Directory, File } from 'expo-file-system';

export function formatBytes(bytes) {
  if (bytes == null || isNaN(bytes)) return '—';
  if (bytes < 1024) return `${bytes} Б`;
  const units = ['КБ', 'МБ', 'ГБ', 'ТБ'];
  let value = bytes / 1024;
  let i = 0;
  while (value >= 1024 && i < units.length - 1) {
    value /= 1024;
    i++;
  }
  return `${value.toFixed(2)} ${units[i]}`;
}

export function formatDate(ms) {
  if (!ms) return '—';
  return new Date(ms).toLocaleString('uk-UA');
}

export function cleanPath(uri) {
  return decodeURIComponent(uri).replace('file://', '');
}

export function getMeta(item) {
  try {
    if (item instanceof Directory) {
      const info = item.info();
      return {
        name: item.name,
        type: 'Папка',
        size: formatBytes(info.size ?? item.size),
        modified: formatDate(info.modificationTime),
      };
    }
    const ext = item.name.includes('.') ? item.name.split('.').pop() : '';
    return {
      name: item.name,
      type: item.type ? `${item.type} (.${ext})` : ext ? `.${ext}` : 'Файл',
      size: formatBytes(item.size),
      modified: formatDate(item.modificationTime),
    };
  } catch (e) {
    return { name: item.name, type: '—', size: '—', modified: '—' };
  }
}

export const isTxt = (item) => item instanceof File && item.name.toLowerCase().endsWith('.txt');