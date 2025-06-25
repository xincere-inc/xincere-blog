'use client';

import { usePathname } from 'next/navigation';

// 存在しないパスを定義する配列
const INVALID_PATHS = ['/categories', '/authors', '/tags'];

export function useBreadcrumbs(title?: string) {
  const pathname = usePathname();
  const segments = pathname.split('/').filter(Boolean);
  const items = [{ label: 'Home', href: '/' }].concat(
    segments.map((seg, idx) => {
      const href = '/' + segments.slice(0, idx + 1).join('/');
      let label = seg.replace(/-/g, ' ').replace(/^\w/, (c) => c.toUpperCase());
      // 最終セグメントかつ title が与えられたらタイトルに置換
      if (title && idx === segments.length - 1) {
        label = title;
      }

      // 存在しないページはパンくずに表示しない
      if (INVALID_PATHS.includes(href)) {
        return { label: '', href: '' };
      }

      return { label, href };
    })
  );
  return items;
}
