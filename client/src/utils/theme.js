// Light/dark theme: the choice is saved and written to <html data-theme="..."> (see styles/theme.css)
const KEY = 'link.theme'

export function getStoredTheme() {
  try {
    return localStorage.getItem(KEY) === 'dark' ? 'dark' : 'light'
  } catch {
    return 'light'
  }
}

export function applyTheme(theme) {
  document.documentElement.dataset.theme = theme
  try {
    localStorage.setItem(KEY, theme)
  } catch {
    /* storage unavailable: the choice just won't survive a refresh */
  }
}
