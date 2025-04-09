function setItem(key: string, value: any): void {
  localStorage.setItem(key, JSON.stringify(value));
}

function getitem(key: string): string | null {
  return localStorage.getItem(key);
}

function removeItem(key: string): void {
  return localStorage.removeItem(key);
}

export const storage = {
  setItem,
  getitem,
  removeItem,
};
