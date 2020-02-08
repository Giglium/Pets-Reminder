/* global cordova Camera LocalFileSystem */
/**
 * Base class for manage all I/O between the application and the file system
 */
export default class IOService {
  /**
   * Class constructor fon initialize the class with the right attribute. don't create this object before deviceready event or it will fail!
   */
  constructor () {
    this.appDataFileName = 'petsReminder.json'
  }

  /**
   * Create or load the application data from the file given with @path. If it create it the file will be created with the default schema.
   * @param {string} path to the file to load
   */
  loadOrCreateData (path) {
    window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, (fileSystem) => {
      fileSystem.root.getFile(path, { create: false }, this.loadDataFile.bind(this), this.createDataFile.bind(this))
    }, IOService.ioException)
  }

  /**
   * Read data from a given file an load the application data into file storage
   * @param {FileEntry} fileEntry the file to read
   */
  loadDataFile (fileEntry) {
    fileEntry.file((file) => {
      const reader = new FileReader()

      reader.onloadend = function () {
        console.log('Successful file read: ' + this.result)
        const json = JSON.parse(this.result)

        window.localStorage.setItem('APPLICATION', JSON.stringify(json.application))
        window.localStorage.setItem('ANIMALS', JSON.stringify(json.animals))
        window.localStorage.setItem('SETTINGS', JSON.stringify(json.settings))
      }

      reader.readAsText(file)
    }, IOService.ioException)
  }

  /**
   * Save the given application configuration into the default persisten file
   * @param {String} json a json into string format
   */
  saveDataFile (json) {
    if (json == null) json = IOService.defaultAppJsonSchema()

    window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, (fs) => {
      fs.root.getFile(this.appDataFileName, { create: true, exclusive: false }, (fileEntry) => {
        fileEntry.createWriter((fileWriter) => {
          fileWriter.onwriteend = (e) => {
            // TODO: Saved Event
            console.log('write')
          }

          const blob = new Blob([json], { type: 'application/json' })
          fileWriter.write(blob)
        }, IOService.ioException)
      }, IOService.ioException)
    })
  }

  /**
   * Create the default persisted file with the default configuration
   */
  createDataFile () {
    this.saveDataFile(null)
  }

  /**
   * @return {String} a json with the default configuration
   */
  static defaultAppJsonSchema () {
    const defaultJson = {}
    const application = {}
    const animals = []
    const settings = {}

    application.name = 'petsReminder'
    application.version = '1.0.0'
    application.notification = []

    // Populate Settings
    settings.language = (navigator.language).substring(0, 2)

    if (settings.language == null) {
      // fail to retrieve user language fallback to default
      settings.language = 'en'
    }

    const now = new Date(2013, 11, 31, 1, 30)
    let dateFormat = now.toLocaleDateString()
    dateFormat = dateFormat.replace('31', 'dd')
    dateFormat = dateFormat.replace('12', 'mm')
    dateFormat = dateFormat.replace('2013', 'yyyy')

    settings.dateFormat = dateFormat

    if (settings.dateFormat == null) {
      // fail to retrieve date format fallback to default
      settings.dateFormat = 'yyyy/mm/dd'
    }

    const timeFormat = now.toLocaleTimeString()
    if (timeFormat.includes('AM') || timeFormat.includes('PM')) {
      settings.timeFormat = 'hh:mm tt'
    } else {
      settings.timeFormat = 'hh:mm'
    }
    settings.color = 'blue'
    settings.theme = ''
    settings.darkMode = false

    // Populate json
    defaultJson.application = application
    defaultJson.animals = animals
    defaultJson.settings = settings

    console.log(settings)

    return JSON.stringify(defaultJson)
  }

  /**
   * @param {PictureSourceType} srcType specify witch channel to use for get the photo.
   * @return {CameraOptions} with all the options for a camera plugin
   */
  static getCameraOptions (srcType) {
    return {
      quality: 30,
      destinationType: Camera.DestinationType.DATA_URL,
      sourceType: srcType,
      encodingType: Camera.EncodingType.JPEG,
      mediaType: Camera.MediaType.PICTURE,
      allowEdit: true,
      correctOrientation: true // Corrects Android orientation
    }
  }

  /**
   * @throws {acquiredimage} event with the imageUri attached to detail
   */
  getCameraImage () {
    this.getImage(Camera.PictureSourceType.CAMERA)
  }

  /**
   * @throws {acquiredimage} event with the imageUri attached to detail
   */
  getAlbumImage () {
    this.getImage(Camera.PictureSourceType.SAVEDPHOTOALBUM)
  }

  /**
   * @param {PictureSourceType} srcType that indicate the source where retrive the image
   * @throws {acquiredimage} event with the imageUri attached to detail
   */
  getImage (srcType) {
    const options = IOService.getCameraOptions(srcType)

    navigator.camera.getPicture(function cameraSuccess (imageUri) {
      document.dispatchEvent(new CustomEvent('acquiredimage', { detail: { imageUri: 'data:image/jpeg;base64,' + imageUri } }))
    }, IOService.ioException, options)
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
    const schedule = {}

    schedule.id = id
    schedule.text = text
    schedule.icon = 'res://icon/android/mdpi.png'
    schedule.smallIcon = 'res://icon/android/mdpi.png'

    if (repeat) {
      if (birthday) {
        schedule.trigger = { every: { month, day, hour, minute }, count: 365 }
      } else {
        schedule.trigger = { every: { hour, minute }, count: 365 }
      }
    } else {
      schedule.trigger = { every: { month, day, hour, minute }, count: 1 }
    }

    cordova.plugins.notification.local.schedule([schedule])
  }

  /**
   * Delete a notification
   * @param {String} id of the notification to clear
   */
  clearNotification (id) {
    cordova.plugins.notification.local.clear(id)
  }

  /**
   * Default error handler: Print the event on the console.
   * @throws {ioerror} event with the error attached to detail
   */
  static ioException (e) {
    document.dispatchEvent(new CustomEvent('ioerror', { detail: { error: e } }))
  }

  /**
   * Erase the current local storage and it will replace it with the data stored on the persistent file
   */
  refreshLocalStorage () {
    this.loadOrCreateData(this.appDataFileName)
  }

  /**
   * Start the Service Flow, it might be call on page render
   */
  render () {
    this.refreshLocalStorage()
  }
}
