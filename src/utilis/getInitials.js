export const getInitials = (email) => {
  if (!email || typeof email !== 'string') return '??';
  return email.substring(0, 2).toUpperCase();
};
