export const useRandomAnimation = () => {
  const randomOpacity = () =>
    Array(5)
      .fill()
      .map(() => Math.random() * 0.5 + 0.5);
  const randomScale = () =>
    Array(5)
      .fill()
      .map(() => Math.random() * 0.1 + 0.95);
  const randomFilter = () =>
    Array(5)
      .fill()
      .map(() => `drop-shadow(0 0 ${Math.floor(Math.random() * 10)}px rgba(248, 178, 42, ${Math.random() * 0.7}))`);

  return {
    opacity: randomOpacity(),
    scale: randomScale(),
    filter: randomFilter(),
  };
};
