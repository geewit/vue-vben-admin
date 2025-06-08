<script setup lang="ts">
import type { DialogContentEmits, DialogContentProps } from 'radix-vue';

import { computed } from 'vue';

import { cn } from '@vben-core/shared/utils';

import { X } from 'lucide-vue-next';
import {
  DialogClose,
  DialogContent,
  DialogOverlay,
  DialogPortal,
  useForwardPropsEmits
} from 'radix-vue';

type PointerDownOutsideEvent = CustomEvent<{
  originalEvent: PointerEvent;
}>;

const props = withDefaults(
  defineProps<DialogContentProps & { class?: any; zIndex?: number }>(),
  { zIndex: 1000 }
);
const emits = defineEmits<DialogContentEmits>();

const delegatedProps = computed(() => {
  const { class: _, ...delegated } = props;

  return delegated;
});

const forwarded = useForwardPropsEmits(delegatedProps, emits);

function handlePointerDownOutside(event: PointerDownOutsideEvent) {
  const originalEvent = event.detail.originalEvent as PointerEvent;
  const target = originalEvent.target as HTMLElement;
  // 如果点击位置在 target 边界之外，就阻止默认关闭行为
  if (
    originalEvent.offsetX > target.clientWidth ||
    originalEvent.offsetY > target.clientHeight
  ) {
    event.preventDefault();
  }
}
</script>

<template>
  <DialogPortal>
    <DialogOverlay
      :style="{ zIndex }"
      class="data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 border-border absolute inset-0 grid place-items-center overflow-y-auto border bg-black/80"
    >
      <DialogContent
        :class="
          cn(
            'border-border bg-background relative z-50 my-8 grid w-full max-w-lg gap-4 border p-6 shadow-lg duration-200 sm:rounded-lg md:w-full',
            props.class
          )
        "
        :style="{ zIndex }"
        v-bind="forwarded"
        @pointer-down-outside="handlePointerDownOutside"
      >
        <slot></slot>

        <DialogClose
          class="hover:bg-secondary absolute right-4 top-4 rounded-md p-0.5 transition-colors"
        >
          <X class="h-4 w-4" />
          <span class="sr-only">Close</span>
        </DialogClose>
      </DialogContent>
    </DialogOverlay>
  </DialogPortal>
</template>
