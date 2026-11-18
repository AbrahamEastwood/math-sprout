const storageKeys = {
  theme: "math-sprout.theme",
  username: "math-sprout.username",
  language: "math-sprout.language",
};

export function storeTheme(theme, storage = localStorage) {
  storage.setItem(storageKeys.theme, JSON.stringify(theme));
}

export function storeLanguage(language, storage = localStorage) {
  storage.setItem(storageKeys.language, language);
}

export function getStoredLanguage(storage = localStorage) {
  const language = storage.getItem(storageKeys.language);
  return language === "en" || language === "nl-BE" ? language : null;
}

export function storeUsername(username, storage = localStorage) {
  storage.setItem(storageKeys.username, username);
}

export function removeStoredUsername(storage = localStorage) {
  storage.removeItem(storageKeys.username);
}

export function getStoredUsername(storage = localStorage) {
  const savedUsername = storage.getItem(storageKeys.username);
  if (!savedUsername) return null;

  const username = savedUsername.trim();
  if (!username) {
    removeStoredUsername(storage);
    return null;
  }
  return username;
}
