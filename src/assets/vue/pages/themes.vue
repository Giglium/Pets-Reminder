<template>
    <f7-page>
        <f7-navbar :title="$t('message.settings.settings')" :back-link="$t('message.back')"><!-- title--></f7-navbar>
        <f7-block-title>{{$t('message.settings.theme')}}</f7-block-title>
        <f7-block>
            <f7-row class="c-theme">
                <f7-col class="c-columns-align-center" @click="setTheme('md')">
                    <f7-icon class="c-icon-android" ios="f7:logo_android" aurora="f7:logo_android" md="material:android"><!-- Android --></f7-icon>
                </f7-col>
                <f7-col class="c-columns-align-center" @click="setTheme('ios')">
                    <f7-icon class="c-icon-apple" ios="f7:logo_apple" aurora="f7:logo_apple"
                             md="f7:logo_apple"><!-- IOS --></f7-icon>
                </f7-col>
            </f7-row>
        </f7-block>
        <f7-block-title>{{$t('message.settings.colorTheme')}}</f7-block-title>
        <f7-block>
            <f7-row class="c-color-theme">
                <f7-col width="33" v-for="color in colors" :key="color">
                    <f7-button class="c-color-button" fill round raised
                               :color="color" @click="setColorTheme(color)">
                        {{ $t('message.settings.color.' + color) }}
                    </f7-button>
                </f7-col>
                <f7-col width="33"><!-- I need this empty col because we have 8 colors and not 9 --></f7-col>
            </f7-row>
        </f7-block>
        <f7-list>
            <f7-list-item>
                <span>{{$t('message.settings.darkMode')}}</span>
                <f7-toggle @change="setLayoutTheme" :checked="isDarkMode"><!-- dark Mode --></f7-toggle>
            </f7-list-item>
            <f7-list-item :title="$t('message.settings.language.language')" smart-select :smart-select-params="{openIn: 'sheet', sheetSwipeToClose: true, closeOnSelect:true}">
                <select @change="setLanguage" name="language" v-model="currentLanguage">
                    <option v-for="language in languages" :key="language" :value="language">{{$t('message.settings.language.' + language)}}</option>
                </select>
            </f7-list-item>
            <f7-list-item :title="$t('message.settings.dateFormat')" smart-select :smart-select-params="{openIn: 'sheet', sheetSwipeToClose: true, closeOnSelect: true}">
                <select @change="setDateFormat" name="dateFormat" v-model="currentDateFormat">
                    <option v-for="dateFormat in dateFormats" :key="dateFormat" :value="dateFormat">{{dateFormat}}</option>
                </select>
            </f7-list-item>
            <f7-list-item :title="$t('message.settings.timeFormat')" smart-select :smart-select-params="{openIn: 'sheet', sheetSwipeToClose: true, closeOnSelect: true}">
                <select @change="setTimeFormat" name="timeFormat" v-model="currentTimeFormat">
                    <option v-for="timeFormat in timeFormats" :key="timeFormat" :value="timeFormat">{{timeFormat}}</option>
                </select>
            </f7-list-item>
        </f7-list>
    </f7-page>
</template>
<script>
    import applicationFacades from '../../js/applicationFacades';

    const constants = {
            DEFAULT_ID: "new"
        },
        selectors = {
            ANDROID_ICON: ".c-icon-android",
            IOS_ICON: ".c-icon-apple",
            COLOR_CLASS_PREFIX: ".color-",
            LANGUAGE_CLASS_PREFIX: ".language-",
            LANGUAGE_SELECT: "[name=language]",
            OPTIONS: "option",
        },
        classes = {
            ACTIVE: "c-active",
        };

    export default {
        components: {},
        data() {
            return {
                colors: applicationFacades.colors,
                languages: applicationFacades.languages,
                dateFormats: applicationFacades.dateFormats,
                timeFormats: applicationFacades.timeFormats,
                colorsAmount: applicationFacades.colors.length,
                isDarkMode: false,
                currentTheme: "",
                currentColor: "",
                currentLanguage: "",
                currentTimeFormat: "",
                currentDateFormat: "",
            };
        },
        methods: {
            setLayoutTheme(event) {
                this.isDarkMode = event.target.checked;
                applicationFacades.setDarkMode(this.isDarkMode);
            },
            setColorTheme(color) {
                if(this.currentColor !== color) {
                    document.querySelector(selectors.COLOR_CLASS_PREFIX + this.currentColor).classList.remove(classes.ACTIVE);
                    this.currentColor = color;
                    document.querySelector(selectors.COLOR_CLASS_PREFIX + this.currentColor).classList.add(classes.ACTIVE);
                    applicationFacades.setColor(color);
                }
            },
            setTheme(theme) {
                if (theme !== this.currentTheme) {

                    this.$f7.dialog.confirm(applicationFacades.getLocaleString("message.settings.reload.text"),applicationFacades.getLocaleString("message.settings.reload.title"), () => {
                                            this.currentTheme = theme;
                    applicationFacades.setTheme(theme);

                    switch (this.currentTheme) {
                        case applicationFacades.themes.IOS:
                            document.querySelector(selectors.IOS_ICON).classList.add(classes.ACTIVE);
                            document.querySelector(selectors.ANDROID_ICON).classList.remove(classes.ACTIVE);
                            break;
                        case applicationFacades.themes.MATERIAL:
                            document.querySelector(selectors.ANDROID_ICON).classList.add(classes.ACTIVE);
                            document.querySelector(selectors.IOS_ICON).classList.remove(classes.ACTIVE);
                            break;
                        case applicationFacades.themes.AUTOMATIC:
                        default:
                            break;
                    }

                    document.location.reload(); // Force reload all the component without cache
                    });
                }
            },
            setLanguage() {
                applicationFacades.setLanguage(this.currentLanguage);
            },
            setTimeFormat(){
                applicationFacades.setTimeFormat(this.currentTimeFormat);
            },
            setDateFormat(){
                applicationFacades.setDateFormat(this.currentDateFormat);
            }
        },
        mounted() {
            this.currentTheme = applicationFacades.getTheme();
            this.currentColor = applicationFacades.getColor();
            this.currentLanguage = applicationFacades.getLanguage();
            this.isDarkMode = applicationFacades.isDarkMode();
            this.currentDateFormat = applicationFacades.getDateFormat();
            this.currentTimeFormat = applicationFacades.getTimeFormat();

            switch (this.currentTheme) {
                case applicationFacades.themes.IOS:
                    document.querySelector(selectors.IOS_ICON).classList.add(classes.ACTIVE);
                    break;
                case applicationFacades.themes.MATERIAL:
                    document.querySelector(selectors.ANDROID_ICON).classList.add(classes.ACTIVE);
                    break;
                case applicationFacades.themes.AUTOMATIC:
                default:
                    break;
            }

            document.querySelector(selectors.COLOR_CLASS_PREFIX + this.currentColor).classList.add(classes.ACTIVE);
        }
    };
</script>
