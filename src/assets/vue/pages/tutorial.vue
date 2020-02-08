<template>
  <f7-page>
    <f7-navbar :title="$t('message.tutorial.tutorial')" :back-link="$t('message.back')"><!-- Back Button --></f7-navbar>
        <f7-list>
            <f7-list-item v-for="number in Array.from({length: 3}, (v, k) => k+1)" :key="number" popup-open=".tutorial-popup-swipe" :title="$t('message.tutorial.tutorial' + number)" @click="updateSheet(number)" link="#"><!-- list item --></f7-list-item>
        </f7-list>
        <f7-popup class="tutorial-popup-swipe" swipe-to-close>
            <f7-page>
                <f7-navbar :title="$t('message.tutorial.tutorial' + tutorial)">
                    <f7-nav-right>
                        <f7-link popup-close>{{$t("message.alarm.close")}}</f7-link>
                    </f7-nav-right>
                </f7-navbar>
                <div class="c-height-100 c-justify">
                    <f7-block v-for="number in Array.from({length: length}, (v, k) => k+1)" :key="number">
                        <f7-block-title>{{$t("message.tutorial.t" + tutorial + "_" + number)}}</f7-block-title>
                        <p>{{$t("message.tutorial.c" + tutorial + "_" + number)}}</p>
                        <hr>
                    </f7-block>
                </div>
            </f7-page>
        </f7-popup>
  </f7-page>
</template>
<script>
export default {
  components: {},
    data() {
        return {
            tutorial: "",
            length: 0,
        }
    },
    methods: {
      updateSheet(number){
          this.tutorial = number;
          switch (number) {
              case 1:
                  this.length = 5;
                  break;
              case 2:
                  this.length = 3;
                  break;
              case 3:
                  this.length = 2;
                  break;
              default:
                  this.length = 0;
          }
      },
    },
};
</script>
