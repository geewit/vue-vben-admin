import type { Ref } from 'vue';

import { watch } from 'vue';

import { useDebounceFn } from '@vueuse/core';

interface UseMenuScrollOptions {
  delay?: number;
  enable?: boolean | Ref<boolean>;
}

export function useMenuScroll(
  activePath: Ref<string | undefined>,
  options: UseMenuScrollOptions = {},
) {
  const { enable = true, delay = 320 } = options;

  function scrollToActiveItem() {
    const isEnabled = (enable as Ref<boolean>).value ?? (enable as boolean);
    if (!isEnabled) return;

    const activeElement = document.querySelector(
      `aside li[role=menuitem].is-active`,
    );
    if (activeElement) {
      activeElement.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
        inline: 'center',
      });
    }
  }

  const debouncedScroll = useDebounceFn(scrollToActiveItem, delay);

  watch(activePath, async () => {
    const isEnabled = (enable as Ref<boolean>).value ?? (enable as boolean);
    if (!isEnabled) return;

    try {
      await debouncedScroll();
    } catch (error) {
      console.error('Scroll to active item failed:', error);
    }
  });

  return {
    scrollToActiveItem,
  };
}
