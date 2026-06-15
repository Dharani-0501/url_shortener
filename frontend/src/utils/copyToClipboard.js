export const copyToClipboard = (text) => {
  if (!navigator.clipboard) return false;
  navigator.clipboard.writeText(text);
  return true;
};
