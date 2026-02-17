export const formatDateTime = (iso?: string) => {
  if (!iso) return 'TBD';
  const date = new Date(iso);
  return `${date.toLocaleDateString()} ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
};

export const formatTimeOnly = (iso?: string) => {
  if (!iso) return 'TBD';
  return new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

export const timeUntil = (iso?: string) => {
  if (!iso) return 'No end time';
  const end = new Date(iso).getTime();
  const diffMs = end - Date.now();
  if (diffMs <= 0) return 'Ended';
  const mins = Math.floor(diffMs / 60000);
  if (mins < 60) return `${mins}m left`;
  const hours = Math.floor(mins / 60);
  return `${hours}h ${mins % 60}m left`;
};
