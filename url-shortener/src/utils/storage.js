export const getAllURLs = () =>
    JSON.parse(localStorage.getItem("shortenedURLs") || "[]");
  
  export const saveURL = (entry) => {
    const urls = getAllURLs();
    urls.push(entry);
    localStorage.setItem("shortenedURLs", JSON.stringify(urls));
  };
  
  export const updateClicks = (shortCode, clickData) => {
    const urls = getAllURLs();
    const index = urls.findIndex(u => u.shortCode === shortCode);
    if (index !== -1) {
      urls[index].clicks.push(clickData);
      localStorage.setItem("shortenedURLs", JSON.stringify(urls));
    }
  };
  
  export const getURLByCode = (shortCode) =>
    getAllURLs().find((url) => url.shortCode === shortCode);