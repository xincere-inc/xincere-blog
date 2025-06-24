'use client';

import { useBreadcrumbs } from '@/hooks/useBreadcrumbs';
import Breadcrumb from './Breadcrumb';

interface BreadcrumbsContainerProps {
  title?: string;
}

export default function BreadcrumbsContainer({
  title,
}: BreadcrumbsContainerProps) {
  const items = useBreadcrumbs(title);
  return <Breadcrumb items={items} />;
}
