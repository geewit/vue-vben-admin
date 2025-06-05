import { requestClient } from '#/api/request';
import type { PageFetchParams } from '#/api/request';

export namespace LegalApi {
  export interface Law {
    id: number;
    title: string;
    status: string;
    publishDate: string;
  }

  export interface Article {
    id: number;
    index: number;
    content: string;
  }
}

export function uploadLaw(data: FormData) {
  return requestClient.post('/legal/laws/upload', data);
}

export function getLawList(params: PageFetchParams) {
  return requestClient.get<{ items: LegalApi.Law[]; total: number }>('/legal/laws', { params });
}

export function updateLaw(lawId: number, data: Omit<LegalApi.Law, 'id'>) {
  return requestClient.put(`/legal/laws/${lawId}`, data);
}

export function deleteLaw(lawId: number) {
  return requestClient.delete(`/legal/laws/${lawId}`);
}

export function getLawArticles(lawId: number) {
  return requestClient.get<LegalApi.Article[]>(`/legal/laws/${lawId}/articles`);
}

export function updateArticle(articleId: number, data: Omit<LegalApi.Article, 'id'>) {
  return requestClient.put(`/legal/articles/${articleId}`, data);
}

export function deleteArticle(articleId: number) {
  return requestClient.delete(`/legal/articles/${articleId}`);
}
