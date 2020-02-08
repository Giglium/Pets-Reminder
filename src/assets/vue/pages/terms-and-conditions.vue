<template>
  <f7-page>
    <f7-navbar :title="$t('message.termsandconditions.termsAndConditions')" :back-link="$t('message.back')"><!-- Back Button --></f7-navbar>
    <f7-block v-for="number in Array.from({length: 3}, (v, k) => k+1)" :key="number" class="c-terms">
        <f7-block-title>{{number}}. {{$t("message.termsandconditions.title" + number)}}</f7-block-title>
        <p>{{$t("message.termsandconditions.paragraph" + number)}}</p>
    </f7-block>
  </f7-page>
</template>
<script>
export default {
  components: {}
};
</script>
