export const formatCamelCase = (text: string): string => {
  const spaced = text?.replace(/([a-z])([A-Z])/g, "$1 $2");
  return spaced?.charAt(0)?.toUpperCase() + spaced?.slice(1)?.toLowerCase();
};
