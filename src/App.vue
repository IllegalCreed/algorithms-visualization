<script setup lang="ts">
import AnalyticsConsent from '@/components/AnalyticsConsent.vue';
import { useRouteSeo } from '@/seo/useRouteSeo';

useRouteSeo();
</script>

<template>
  <RouterView></RouterView>
  <AnalyticsConsent />
</template>

<style>
body {
  margin: 0;
}

* {
  box-sizing: border-box;
}
</style>
