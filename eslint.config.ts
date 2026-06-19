import { globalIgnores } from 'eslint/config';
import { defineConfigWithVueTs, vueTsConfigs } from '@vue/eslint-config-typescript';
import pluginVue from 'eslint-plugin-vue';
import skipFormatting from '@vue/eslint-config-prettier/skip-formatting';

// ESLint flat config：eslint-plugin-vue 管 .vue 模板与脚本，typescript-eslint 管类型，
// skip-formatting 关闭与 Prettier 冲突的格式化规则（格式交给 Prettier）。
export default defineConfigWithVueTs(
  {
    name: 'app/files-to-lint',
    files: ['**/*.{ts,mts,tsx,vue}'],
  },

  globalIgnores(['**/dist/**', '**/dist-ssr/**', '**/coverage/**', '**/.remember/**']),

  pluginVue.configs['flat/essential'],
  vueTsConfigs.recommended,

  {
    name: 'app/rules',
    rules: {
      // 页面与布局组件采用单字命名（Home/Master/List 等），是本项目惯例
      'vue/multi-word-component-names': 'off',
    },
  },

  skipFormatting,
);
