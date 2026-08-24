export const getInitials = (email, username) => {
  if ((!email || typeof email !== 'string') && (!username || typeof username !== 'string')) return '??';
  if (username) return username.split('-').map(name => name.charAt(0).toUpperCase()).join('');
  return email.substring(0, 2).toUpperCase();
};
