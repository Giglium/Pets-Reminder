<template>
    <f7-page class="c-modify">
        <f7-navbar :title="$t('message.credits.credits')" :back-link="$t('message.back')"><!-- title --></f7-navbar>
        <f7-block-title>{{$t('message.credits.avatar')}}</f7-block-title>
        <img :src="img" class="c-responsive-image" :alt="$t('message.credits.avatarAlt')">
        <f7-link external href="http://www.freepik.com">Designed by Freepik</f7-link>
    </f7-page>
</template>
<script>
    import applicationFacades from '../../js/applicationFacades';

    const constants = {
        AVATAR_IMAGE_PATH: "avatar/all.svg",
    };

    export default {
        components: {},
        data() {
            return {
                img: "./static/img/" + constants.AVATAR_IMAGE_PATH,
            }
        },
        mounted() {
            applicationFacades.getStaticImageOnRender(constants.AVATAR_IMAGE_PATH).then((src) => {
                this.img = src;
            });
        }
    };
</script>
