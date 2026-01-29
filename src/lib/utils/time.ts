import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';

dayjs.extend(duration);

export const calculateTotalDuration = (durations: string[]): string => {
  if (durations.length === 0) {
    return '00:00:00';
  }

  const totalSeconds = durations.reduce((acc, time) => {
    const [minutes, seconds] = time.split(':').map(Number);
    return acc + (minutes * 60) + seconds;
  }, 0);

  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}; 