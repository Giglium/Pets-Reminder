<template>
    <!-- App -->
    <f7-app :params="f7params">
        <f7-panel left cover>
            <f7-view url="/sidebar/" links-view=".view-main" />
        </f7-panel>
        <f7-view url="/" :main="true"  :componentCache="false" class="ios-edges"><!-- Page body --></f7-view>
    </f7-app>
</template>
<script>
// Import Framework 7 components
import { f7App, f7Panel, f7View, } from 'framework7-vue';
// Import Application Routes
import routes from './routes.js';
// Import Application Facades
import applicationFacades from './assets/js/applicationFacades';

// Get the theme of the application
const theme = applicationFacades.getTheme();

export default {
    components: {
      f7App,
      f7Panel,
      f7View,
    },
    
    data() {
        return {
            f7params: {
                theme,
                routes,
                id: 'it.unipd.math.cs.PetsReminder',
                touch: {
                    tapHold: true,
                },
                panel: {
                    swipe: true,
                }
            },
        }      
    },
    methods:{
        updateColorTheme(color){
            //const app = this.$f7;
            this.$f7ready((app) => {
                const currentColorClass = app.root[0].className.match(/color-theme-([a-z]*)/);
                if (currentColorClass) app.root.removeClass(currentColorClass[0]);
                app.root.addClass(`color-theme-${color}`);
            });
        },
        updateLayoutTheme(theme){
            this.$f7ready((app) => {
                app.root.removeClass('theme-dark theme-light').addClass(`theme-${theme}`);
            });
        },
        updateLanguage(language){
            document.querySelector('html').setAttribute('lang', language);
        },
        bindEvents(){
            document.addEventListener(applicationFacades.events.CHANGE_COLOR_THEME, (e)=>{
                this.updateColorTheme(e.detail.color);
            });
            document.addEventListener(applicationFacades.events.CHANGE_GLARE_THEME, (e)=>{
               this.updateLayoutTheme(e.detail.darkMode ? 'dark' : 'light');
            });
            document.addEventListener(applicationFacades.events.CHANGE_LANGUAGE, (e) =>{
                this.updateLanguage(e.detail.lang);
            });
            document.addEventListener(applicationFacades.events.DEVICE_READY, (e)=> {
                this.$f7ready((app) => {
                    let $$ = this.$$;
                    // Listen to Cordova's backbutton event
                    document.addEventListener(applicationFacades.events.BACK_BUTTON, function navigateBack() {
                            // Use Framework7's router to navigate back
                            const mainView = app.views.main;

                            const leftp = app.panel.left && app.panel.left.opened;
                            const rightp = app.panel.right && app.panel.right.opened;

                            if (leftp || rightp) {

                                app.panel.close();
                                return false;
                            } else if ($$('.modal-in').length > 0) {

                                app.dialog.close();
                                app.popup.close();
                                return false;
                            } else if (app.views.main.router.url === '/') {
                                navigator.app.exitApp();
                            } else {
                                mainView.router.back();
                            }

                        }
                        , false)
                });
            });
        },
    },
    mounted() {
        this.bindEvents();
    },
}

</script>
