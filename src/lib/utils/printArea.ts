export const printArea = (filename?: string) => {
  const previousTitle = document.title;
  if (filename) {
    document.title = filename;
  }

  const restore = () => {
    document.title = previousTitle;
    window.removeEventListener("afterprint", restore);
  };

  window.addEventListener("afterprint", restore);
  window.print();
};
