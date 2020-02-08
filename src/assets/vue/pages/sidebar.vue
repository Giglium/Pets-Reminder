<template>
    <f7-page>
        <img :src="img" class="c-logo-image" :alt="$t('message.img.avatar.alt')">
        <f7-block-title class="c-title-logo"><span class="c-caveat-logo">Pets</span> <span
                class="c-open-sans-condensed-logo">Reminder</span></f7-block-title>
        <f7-list>
            <f7-list-item link="/themes/" :title="$t('message.sidebar.settings')" panel-close>
                <!-- settings --></f7-list-item>
            <f7-list-item link="/tutorial/" :title="$t('message.sidebar.tutorial')" panel-close>
                <!-- tutorial --></f7-list-item>
            <f7-list-item link="/terms-and-conditions/" :title="$t('message.sidebar.termsAndConditions')" panel-close>
                <!-- tac --></f7-list-item>
            <f7-list-item link="/credits/" :title="$t('message.sidebar.credits')" panel-close>
                <!-- credits --></f7-list-item>
        </f7-list>
    </f7-page>
</template>
<script>
    import applicationFacades from '../../js/applicationFacades';

    const constants = {
        LOGO_IMAGE_PATH: "logo.svg",
    };

    export default {
        components: {},
        data() {
            return {
                img: "./static/img/" + constants.LOGO_IMAGE_PATH,
            }
        },
        mounted() {
            applicationFacades.getStaticImageOnRender(constants.LOGO_IMAGE_PATH).then((src) => {
                this.img = src;
            });
        }
    };
</script>
