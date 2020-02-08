<template>
  <f7-page>
    <f7-navbar :title="$t('message.new')" :back-link="$t('message.back')"><!-- Back arrow Link --></f7-navbar>
        <infoForm />
  </f7-page>
</template>
<script>
import infoForm from '../form/info-form';

export default {
  components: {
      infoForm
  }
};
</script>
