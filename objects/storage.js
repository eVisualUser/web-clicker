class Storage {
  static get(name) {
    return localStorage.getItem(name);
  }

  static set(name, value) {
    localStorage.setItem(name, value);
  }

  static remove(name) {
    localStorage.removeItem(name);
  }

  static exist(name) {
    return localStorage.getItem(name) != null;
  }
}
