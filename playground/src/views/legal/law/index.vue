<script lang="ts" setup>
import { ref } from 'vue';

import { Page } from '@vben/common-ui';

import { Button, DatePicker, message, Upload } from 'ant-design-vue';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import {
  deleteArticle,
  deleteLaw,
  getLawArticles,
  getLawList,
  uploadLaw,
} from '#/api';
import { $t } from '#/locales';

const uploadDate = ref<string>('');
const currentLawId = ref<number>();

const [LawGrid, lawGridApi] = useVbenVxeGrid({
  gridOptions: {
    columns: [
      { type: 'seq', width: 60 },
      { field: 'title', title: $t('legal.name') },
      { field: 'status', title: $t('legal.status') },
      { field: 'publishDate', title: $t('legal.publishDate') },
      {
        field: 'operation',
        title: $t('system.role.operation'),
        width: 160,
        align: 'center',
        cellRender: {
          name: 'CellOperation',
          attrs: {
            nameField: 'title',
            onClick: onLawAction,
            options: [
              { code: 'articles', text: $t('legal.article.list') },
              'delete',
            ],
          },
        },
      },
    ],
    rowConfig: { keyField: 'id' },
    height: 'auto',
    pagerConfig: {},
    proxyConfig: {
      ajax: {
        query: async ({
          page,
        }: {
          page: { currentPage: number; pageSize: number };
        }) =>
          await getLawList({
            pageNo: page.currentPage,
            pageSize: page.pageSize,
          }),
      },
    },
    toolbarConfig: { refresh: { code: 'query' }, custom: true },
  },
});

const [ArticleGrid, articleGridApi] = useVbenVxeGrid({
  gridOptions: {
    columns: [
      { type: 'seq', width: 60 },
      { field: 'index', title: $t('legal.article.index') },
      { field: 'content', title: $t('legal.article.content'), minWidth: 200 },
      {
        field: 'operation',
        title: $t('system.role.operation'),
        width: 100,
        align: 'center',
        cellRender: {
          name: 'CellOperation',
          attrs: { nameField: 'index', onClick: onArticleAction },
        },
      },
    ],
    rowConfig: { keyField: 'id' },
    height: 'auto',
    pagerConfig: {},
  },
});

async function onLawAction({ code, row }: any) {
  if (code === 'delete') {
    await deleteLaw(row.id);
    await lawGridApi.query();
  } else if (code === 'articles') {
    currentLawId.value = row.id;
    const list = await getLawArticles(row.id);
    articleGridApi.reloadData({ items: list, total: list.length });
  }
}

async function onArticleAction({ code, row }: any) {
  if (code === 'delete') {
    await deleteArticle(row.id);
    if (currentLawId.value) {
      const list = await getLawArticles(currentLawId.value);
      articleGridApi.reloadData({ items: list, total: list.length });
    }
  }
}

async function handleUpload({ file }: any) {
  if (!uploadDate.value) {
    message.error($t('common.inputRequired'));
    return;
  }
  const form = new FormData();
  form.append('file', file as any);
  form.append('publishDate', uploadDate.value);
  await uploadLaw(form);
  message.success($t('common.uploadSuccess'));
  await lawGridApi.query();
}
</script>

<template>
  <Page auto-content-height>
    <div class="mb-4 flex items-end gap-2">
      <DatePicker v-model:value="uploadDate" />
      <Upload :custom-request="handleUpload" :show-upload-list="false">
        <Button type="primary">{{ $t('legal.upload') }}</Button>
      </Upload>
    </div>
    <LawGrid :table-title="$t('legal.list')" />
    <ArticleGrid
      v-if="currentLawId"
      :table-title="$t('legal.article.list')"
      class="mt-4"
    />
  </Page>
</template>
