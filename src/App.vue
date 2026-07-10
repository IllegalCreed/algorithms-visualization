<script setup lang="ts">
import { useRouteSeo } from '@/seo/useRouteSeo';
import { useRouteAnalytics } from '@/analytics/useRouteAnalytics';

useRouteSeo();
useRouteAnalytics();
</script>

<template>
  <RouterView></RouterView>
</template>

<style>
body {
  margin: 0;
}

* {
  box-sizing: border-box;
}
</style>
