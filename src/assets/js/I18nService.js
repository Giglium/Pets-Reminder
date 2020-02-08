// Import Vue
import Vue from 'vue'

// Import Vue I18n
import VueI18n from 'vue-i18n'

import messages from './../../static/lang/en'

Vue.use(VueI18n)

/**
 * Base class for manage all the localizations
 */
export default class I18NService {
  /**
   * Class constructor fon initialize the class with the right attribute.
   */
  constructor () {
    this.languages = {
      EN: 'en',
      IT: 'it'
    }

    this.loadedLanguages = [this.languages.EN] // our default language that is preloaded
    this.i18n = new VueI18n({
      locale: this.languages.EN, // set locale
      fallbackLocale: this.languages.EN,
      messages // set locale messages
    })
  }

  /**
   * @param {String} lang new language to set into the application
   * @return {String} the @lang params
   */
  setI18nLanguage (lang) {
    this.i18n.locale = lang
    return lang
  }

  /**
   * @param {String} lang new language to set into the application
   * @return {String} the @lang params when the language file have been updated
   */
  async loadLanguageAsync (lang) {
    // If the same language
    if (this.i18n.locale === lang) {
      return Promise.resolve(this.setI18nLanguage(lang))
    }

    // If the language was already loaded
    if (this.loadedLanguages.includes(lang)) {
      return Promise.resolve(this.setI18nLanguage(lang))
    }

    // If the language hasn't been loaded yet
    const messages = await import(/* webpackChunkName: "lang-[request]" */ `./../../static/lang/${lang}.js`)
    this.i18n.setLocaleMessage(lang, messages.default)
    this.loadedLanguages.push(lang)
    return this.setI18nLanguage(lang)
  }

  /**
   * @return {VueI18n} current i18n obj in use
   */
  getI18n () {
    return this.i18n
  }

  /**
   * @param {String} property of the localization
   * @param {Array} params with all the value tu insert inside the message
   * @return {String} the localization string translated in the current locale language
   */
  getLocaleString (property, params) {
    return this.i18n.t(property, params)
  }
}
