export const isValidURL = (url) =>
    /^(http|https):\/\/[^ "]+$/.test(url);
  
  export const isAlphanumeric = (text) =>
    /^[a-z0-9]+$/i.test(text);
  
  export const isInteger = (num) =>
    /^\d+$/.test(num);