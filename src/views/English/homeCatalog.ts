import type { Category } from '@/views/Home/Main/types';
import { getEnglishHomeSections } from '@/i18n/catalog';
import { ENGLISH_ICON_BY_KEY } from '@/i18n/en/icons';

export function getEnglishHomeCategories(): Category[] {
  return getEnglishHomeSections().map((section) => ({
    title: section.title,
    desc: section.description,
    children: section.pages.map((page) => ({
      title: page.en.heading,
      desc: page.en.description,
      icon: ENGLISH_ICON_BY_KEY[page.en.iconKey],
      url: page.en.name,
    })),
  }));
}
