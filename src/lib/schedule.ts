export type Schedule = () => void;

export function setSchedule(f: (t: Date) => void, epoch: Date, intervalMs: number): Schedule {
  const timeout = setTimeout(
    () => {
      f(new Date((epoch.getTime() / intervalMs) * intervalMs));
      const interval = setInterval(f, intervalMs);
      return () => {
        clearInterval(interval);
      };
    },
    epoch.getTime() + intervalMs - new Date().getTime()
  );
  return () => {
    clearTimeout(timeout);
  };
}
