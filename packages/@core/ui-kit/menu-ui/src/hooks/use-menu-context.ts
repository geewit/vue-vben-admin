import type { MenuProvider, SubMenuProvider } from '../types';

import { getCurrentInstance, inject, provide } from 'vue';

import { findComponentUpward } from '../utils';

const menuContextKey = Symbol('menuContext');

/**
 * @zh_CN Provide menu context
 */
function createMenuContext(injectMenuData: MenuProvider) {
  provide(menuContextKey, injectMenuData);
}

/**
 * @zh_CN Provide menu context
 */
function createSubMenuContext(injectSubMenuData: SubMenuProvider) {
  const instance = getCurrentInstance();

  provide(`subMenu:${instance?.uid}`, injectSubMenuData);
}

/**
 * @zh_CN Inject menu context
 */
function useMenuContext() {
  const instance = getCurrentInstance();
  if (!instance) {
    throw new Error('instance is required');
  }
  return inject(menuContextKey) as MenuProvider;
}

/**
 * @zh_CN Inject menu context
 */
function useSubMenuContext() {
  const instance = getCurrentInstance();
  if (!instance) {
    throw new Error('instance is required');
  }
  const parentMenu = findComponentUpward(instance, ['Menu', 'SubMenu']);
  return inject(`subMenu:${parentMenu?.uid}`) as SubMenuProvider;
}

export {
  createMenuContext,
  createSubMenuContext,
  useMenuContext,
  useSubMenuContext,
};
