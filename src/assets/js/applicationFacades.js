/* global device */
import IOService from './IOService'
import I18nService from './I18nService'
import SettingsService from './settingsService'

/**
 * Base class that controller all the other controller. Every call to a controller function from external source must this class
 */
class ApplicationFacades {
  /**
   * Class constructor fon initialize the class with the right attribute.
   */
  constructor () {
    this.localStorage = {
      APPLICATION: 'APPLICATION',
      ANIMALS: 'ANIMALS',
      SETTINGS: 'SETTINGS'
    }

    this.events = {
      DEVICE_READY: 'deviceready',
      ACQUIRED_IMAGE: 'acquiredimage',
      INPUT_OUTPUT_ERROR: 'ioerror',
      CHANGE_COLOR_THEME: 'changecolortheme',
      CHANGE_GLARE_THEME: 'changeglaretheme',
      CHANGE_LANGUAGE: 'changelanguage',
      UPDATE_ANIMALS: 'updateanimals',
      UPDATE_ALARM: 'updatealarm',
      UPDATE_WEIGHT: 'updateweight',
      LONG_PRESS: 'long-press',
      BACK_BUTTON: 'backbutton'
    }

    if (window.localStorage.getItem(this.localStorage.APPLICATION) == null) {
      const defaultLocalStorage = JSON.parse(IOService.defaultAppJsonSchema())
      // Create also the local storage
      window.localStorage.setItem(this.localStorage.APPLICATION, JSON.stringify(defaultLocalStorage.application))
      window.localStorage.setItem(this.localStorage.ANIMALS, JSON.stringify(defaultLocalStorage.animals))
      window.localStorage.setItem(this.localStorage.SETTINGS, JSON.stringify(defaultLocalStorage.settings))
    }

    this.i18nService = new I18nService()

    this.settingsService = new SettingsService()

    this.themes = this.settingsService.themes
    this.colors = this.settingsService.colors
    this.dateFormats = this.settingsService.dateFormats
    this.timeFormats = this.settingsService.timeFormats
    this.languages = this.i18nService.languages

    this.imageCacheMap = new Map()
  }

  /**
   * Save the current application data, stored on local storage into the persistent file
   */
  saveLocalStorageData () {
    const defaultJson = {}

    // Populate json
    defaultJson.application = window.localStorage.getItem(this.localStorage.APPLICATION)
    defaultJson.animals = window.localStorage.getItem(this.localStorage.ANIMALS)
    defaultJson.settings = window.localStorage.getItem(this.localStorage.SETTINGS)

    this.ioService.saveDataFile(JSON.stringify(defaultJson))
  }

  /**
   * Generate unique IDs for Animals, the ID is complex enough that it is highly unlikely to be accidentally duplicated also with other strings generated by this function.
   */
  generateUniqueId () {
    return '_' + (
      Number(String(Math.random()).slice(2)) +
      Date.now() +
      Math.round(performance.now())
    ).toString(36)
  }

  /**
   * @return {VueI18n} the current i18n obj in use
   */
  getI18n () {
    return this.i18nService.getI18n()
  }

  /**
   * @param {String} property of the localization
   * @return {String} the localization string translated in the current locale language
   */
  getLocaleString (property) {
    return this.i18nService.getLocaleString(property, [])
  }

  /**
   * @param {String} property of the localization
   * @param {Array} params with all the value tu insert inside the message
   * @return {String} the localization string translated in the current locale language
   */
  getLocaleStringWithParams (property, params) {
    return this.i18nService.getLocaleString(property, params)
  }

  /**
   * @param {String} imageName of the media, inside the img folder
   * @param {any} id if not null return the image from cache if it existed
   * @return {String} the correct path to that media
   */
  async getStaticImageOnRender (imageName, id = null) {
    return {
      then: (resolve, _reject) => {
        document.addEventListener(this.events.DEVICE_READY, () => {
          resolve(this.getStaticImage(imageName, id))
        })
      }
    }
  }

  /**
   * @param {String} imageName of the media, inside the img folder
   * @param {any} id if not null return the image from cache if it existed
   * @return {String} the correct path to that media
   */
  getStaticImage (imageName, id = null) {
    let result

    if (id != null && this.imageCacheMap.has(id)) {
      result = this.imageCacheMap.get(id)
    } else {
      result = device.platform === 'browser' ? `./static/img/${imageName}` : `file:./static/img/${imageName}`
      this.imageCacheMap.set(id, result)
    }

    return result
  }

  /**
   * Set in the application cache an image
   * @param imageUri the uri of the image to save
   * @param id the unique identifier of the image
   */
  setStaticImage (imageUri, id) {
    this.imageCacheMap.set(id, imageUri)
  }

  /**
   * @throws {acquiredimage} event with the imageUri attached to detail
   */
  getCameraImage () {
    this.ioService.getCameraImage()
  }

  /**
   * @throws {acquiredimage} event with the imageUri attached to detail
   */
  getAlbumImage () {
    this.ioService.getAlbumImage()
  }

  /**
   * @returns {string} the name of the current theme in use, can be: ios, md, aurora, auto
   */
  getTheme () {
    return this.settingsService.getTheme()
  }

  /**
   * @param {String} theme to save in the persistent file
   */
  setTheme (theme) {
    this.settingsService.setTheme(theme)
  }

  /**
   * @returns {string} the name of the current color theme in use
   */
  getColor () {
    return this.settingsService.getColor()
  }

  /**
   * @returns {string} the hex value of the current color theme in use
   */
  getHexColor () {
    let hexColor

    switch (this.settingsService.getColor()) {
      case this.settingsService.colors.RED:
        hexColor = '#ff3b30'
        break
      case this.settingsService.colors.GREEN:
        hexColor = '#4cd964'
        break
      case this.settingsService.colors.PINK:
        hexColor = '#ff2d55'
        break
      case this.settingsService.colors.YELLOW:
        hexColor = '#ffcc00'
        break
      case this.settingsService.colors.ORANGE:
        hexColor = '#ff5500'
        break
      case this.settingsService.colors.GRAY:
        hexColor = '#8e8e93'
        break
      case this.settingsService.colors.BLACK:
        hexColor = '#000'
        break
      case this.settingsService.colors.BLUE:
      default:
        hexColor = '#2196f3'
    }

    return hexColor
  }

  /**
   * @param {String} color to save in the persistent file
   * @throws {changecolortheme} event for notify the change
   */
  setColor (color) {
    this.settingsService.setColor(color)
  }

  /**
   * @returns {string} the name of the current language in use
   */
  getLanguage () {
    return this.settingsService.getLanguage()
  }

  /**
   * @returns {string} the format of the date in use
   */
  getDateFormat () {
    return this.settingsService.getDateFormat()
  }

  /**
   * @returns {string} the format of the time in use
   */
  getTimeFormat () {
    return this.settingsService.getTimeFormat()
  }

  /**
   * @returns {boolean} if the current theme is in dark mode
   */
  isDarkMode () {
    return this.settingsService.isDarkMode()
  }

  /**
   * @param {boolean} boolean that indicate if the theme need to be dark: true or light: false  to save in the persistent file
   * @throws {changeglaretheme} event for notify the change
   */
  setDarkMode (boolean) {
    this.settingsService.setDarkMode(boolean)
  }

  /**
   * @param {String} language to save in the persistent file
   * @throws {changelanguage} event for notify the change
   */
  setLanguage (language) {
    this.i18nService.loadLanguageAsync(language)
    this.settingsService.setLanguage(language)
  }

  /**
   * @param {String} dateFormat to save in the persistent file
   */
  setDateFormat (dateFormat) {
    this.settingsService.setDateFormat(dateFormat)
  }

  /**
   * @param {String} timeFormat to save in the persistent file
   */
  setTimeFormat (timeFormat) {
    this.settingsService.setTimeFormat(timeFormat)
  }

  /**
   * @param {String} time to convert
   * @returns {String} return the given time with a format HH:MM or HH:MM TT depending on current time format
   */
  getUserPreferredTime (time) {
    switch (this.settingsService.getTimeFormat()) {
      case this.settingsService.timeFormats.HH_MM_TT:
        // eslint-disable-next-line no-case-declarations
        let hours = time.split(':')[0]
        // eslint-disable-next-line no-case-declarations
        let minutes = time.split(':')[1]
        // eslint-disable-next-line no-case-declarations
        const ampm = hours >= 12 ? 'pm' : 'am'

        hours = hours % 12
        hours = hours || 12
        minutes = ('0' + minutes).slice(-2)
        return hours + ':' + minutes + ' ' + ampm
      case this.settingsService.timeFormats.HH_MM:
      default:
        return time
    }
  }

  /**
   * @param {String} date to convert
   * @returns {String} return the given date with a format YYYY/MM/DD or MM/DD/YYYY or DD/MM/YYYY depending on current date format
   */
  getUserPreferredDate (date) {
    date = new Date(date)

    let result = this.settingsService.getDateFormat()

    result = result.replace('dd', date.getDay())
    result = result.replace('mm', date.getMonth() + 1)
    result = result.replace('yyyy', date.getFullYear())

    return result
  }

  /**
   * Create a notification with the given param
   * @param {String} id the unique identifier of the notification
   * @param {String} month of the notification
   * @param {String} day of the notification
   * @param {String} hour of the notification
   * @param {String} minute of the notification
   * @param {String} text to show into the notification
   * @param {Boolean} repeat the notification need to repeat every day
   * @param {Boolean} birthday if is the animal birthday
   */
  scheduleNotificationForPreciseInstant (id, month, day, hour, minute, text, repeat, birthday) {
    const application = JSON.parse(window.localStorage.getItem(this.localStorage.APPLICATION))

    const notification = {}

    notification.id = application.notification.length + 1
    notification.objId = id

    application.notification.push(notification)

    this.ioService.scheduleNotificationForPreciseInstant(notification.id, month, day, hour, minute, text, repeat, birthday)

    window.localStorage.setItem(this.localStorage.APPLICATION, JSON.stringify(application))
  }

  /**
   * Delete a notification
   * @param {String} id of the notification to clear
   */
  clearNotificationForPreciseInstant (id) {
    const application = JSON.parse(window.localStorage.getItem(this.localStorage.APPLICATION))

    application.notification.forEach(notification => {
      if (notification.objId === id) {
        id = notification.id
      }
    })

    if (id != null) {
      this.ioService.clearNotification(id)
    }
  }

  /**
   * Bind all the service events
   */
  bindEvents () {
    document.addEventListener(this.events.DEVICE_READY, () => {
      this.render()
    })
  }

  /**
   * Start the application Flow, it might be call on page render
   */
  render () {
    this.ioService = new IOService()

    if (window.localStorage.getItem(this.localStorage.APPLICATION) == null) {
      this.ioService.render()
    }

    console.log(window.localStorage.getItem(this.localStorage.ANIMALS))

    // Update application with user preference
    this.setLanguage(this.settingsService.getLanguage())
    this.setColor(this.settingsService.getColor())
    this.setDarkMode(this.settingsService.isDarkMode())

    window.screen.orientation.lock('portrait').then(r => {
    })
  }
}

export default new ApplicationFacades()
