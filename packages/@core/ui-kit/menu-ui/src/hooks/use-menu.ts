import type { SubMenuProvider } from '../types';

import { computed, getCurrentInstance } from 'vue';

import { findComponentUpward } from '../utils';

function useMenu() {
  const instance = getCurrentInstance();
  if (!instance) {
    throw new Error('instance is required');
  }

  /**
   * @zh_CN 获取所有父级菜单链路
   */
  const parentPaths = computed(() => {
    let parent = instance.parent;
    const paths: string[] = [instance.props.path as string];
    while (parent?.type.name !== 'Menu') {
      if (parent?.props.path) {
        paths.unshift(parent.props.path as string);
      }
      parent = parent?.parent ?? null;
    }

    return paths;
  });

  const parentMenu = computed(() => {
    return findComponentUpward(instance, ['Menu', 'SubMenu']);
  });

  return {
    parentMenu,
    parentPaths
  };
}

function useMenuStyle(menu?: SubMenuProvider) {
  return computed(() => {
    return {
      '--menu-level': menu ? (menu?.level ?? 1) : 0
    };
  });
}

export { useMenu, useMenuStyle };
