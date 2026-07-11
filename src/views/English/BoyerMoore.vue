<script setup lang="ts">
import EnglishAlgorithmArticle from './EnglishAlgorithmArticle.vue';
import { englishBoyerMooreModule } from '@/i18n/en/modules/boyer-moore';
</script>

<template>
  <EnglishAlgorithmArticle
    slug="boyer-moore"
    :module="englishBoyerMooreModule"
    idea="Compare the pattern from right to left. A mismatch uses knowledge of the mismatching text character, and in the full algorithm the matched suffix, to shift past alignments that cannot work."
    visualization="The pattern row slides beneath the text. Comparisons move left within one window, while a mismatch highlights the bad-character lookup and the resulting multi-position jump."
    invariant="Every skipped alignment is impossible under the preprocessing rule used for the mismatch."
    applications="Boyer-Moore is excellent for long patterns over sizable alphabets and often reads fewer text characters than the text length. Small alphabets or adversarial inputs reduce its advantage."
  />
</template>
