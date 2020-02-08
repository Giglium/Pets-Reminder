/**
 * Base class for manage all the user settings
 */
export default class SettingsService {
  /**
   * Class constructor fon initialize the class with the right attribute.
   */
  constructor () {
    // load user preferences
    const settings = JSON.parse(window.localStorage.getItem('SETTINGS'))

    this.theme = settings.theme !== '' ? settings.theme : 'auto'
    this.color = settings.color
    this.language = settings.language
    this.darkMode = settings.darkMode
    this.dateFormat = settings.dateFormat
    this.timeFormat = settings.timeFormat

    this.themes = {
      AUTOMATIC: 'auto',
      IOS: 'ios',
      MATERIAL: 'md'
    }

    this.dateFormats = {
      YYYY_MM_DD: 'yyyy/mm/dd',
      MM_DD_YYYY: 'mm/dd/yyyy',
      DD_MM_YYYY: 'dd/mm/yyyy'
    }

    this.timeFormats = {
      HH_MM: 'hh:mm',
      HH_MM_TT: 'hh:mm tt'
    }

    this.colors = {
      RED: 'red',
      GREEN: 'green',
      BLUE: 'blue',
      PINK: 'pink',
      YELLOW: 'yellow',
      ORANGE: 'orange',
      GRAY: 'gray',
      BLACK: 'black'
    }
  }

  /**
   * @returns {string} the name of the current theme in use, can be: ios, md, aurora, auto
   */
  getTheme () {
    return this.theme
  }

  /**
   * @returns {string} the name of the current color theme in use
   */
  getColor () {
    return this.color
  }

  /**
   * @returns {string} the name of the current language in use
   */
  getLanguage () {
    return this.language
  }

  /**
   * @returns {string} the format of the date in use
   */
  getDateFormat () {
    return this.dateFormat
  }

  /**
   * @returns {string} the format of the time in use
   */
  getTimeFormat () {
    return this.timeFormat
  }

  /**
   * @returns {boolean} if the current theme is in dark mode
   */
  isDarkMode () {
    return this.darkMode
  }

  /**
   * @param {boolean} boolean that indicate if the theme need to be dark: true or light: false to save in the persistent file
   * @throws {changeglaretheme} event for notify the change
   */
  setDarkMode (boolean) {
    this.darkMode = boolean
    // update settings
    const settings = JSON.parse(window.localStorage.getItem('SETTINGS'))

    if (settings != null) {
      settings.darkMode = boolean

      window.localStorage.setItem('SETTINGS', JSON.stringify(settings))
    }

    document.dispatchEvent(new CustomEvent('changeglaretheme', { detail: { darkMode: boolean } }))
  }

  /**
   * @param {String} theme to save in the persistent file
   */
  setTheme (theme) {
    this.theme = theme
    // update settings
    const settings = JSON.parse(window.localStorage.getItem('SETTINGS'))

    if (settings != null) {
      settings.theme = theme

      window.localStorage.setItem('SETTINGS', JSON.stringify(settings))
    }
  }

  /**
   * @param {String} color to save in the persistent file
   * @throws {changecolortheme} event for notify the change
   */
  setColor (color) {
    this.color = color
    // update settings
    const settings = JSON.parse(window.localStorage.getItem('SETTINGS'))

    if (settings != null) {
      settings.color = color

      window.localStorage.setItem('SETTINGS', JSON.stringify(settings))
    }

    document.dispatchEvent(new CustomEvent('changecolortheme', { detail: { color } }))
  }

  /**
   * @param {String} language to save in the persistent file
   * @throws {changelanguage} event for notify the change
   */
  setLanguage (language) {
    this.language = language
    // update settings
    const settings = JSON.parse(window.localStorage.getItem('SETTINGS'))

    if (settings != null) {
      settings.language = language

      window.localStorage.setItem('SETTINGS', JSON.stringify(settings))
    }

    document.dispatchEvent(new CustomEvent('changelanguage', { detail: { lang: language } }))
  }

  /**
   * @param {String} dateFormat to save in the persistent file
   */
  setDateFormat (dateFormat) {
    this.dateFormat = dateFormat

    // update settings
    const settings = JSON.parse(window.localStorage.getItem('SETTINGS'))

    if (settings != null) {
      settings.dateFormat = dateFormat

      window.localStorage.setItem('SETTINGS', JSON.stringify(settings))
    }
  }

  /**
   * @param {String} timeFormat to save in the persistent file
   */
  setTimeFormat (timeFormat) {
    this.timeFormat = timeFormat

    // update settings
    const settings = JSON.parse(window.localStorage.getItem('SETTINGS'))

    if (settings != null) {
      settings.timeFormat = timeFormat

      window.localStorage.setItem('SETTINGS', JSON.stringify(settings))
    }
  }
}
