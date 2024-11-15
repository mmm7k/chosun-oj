import ContestEdit from '@/components/admin/contest/ContestEdit';
import { Suspense } from 'react';

export default function ContestEditPage() {
  return (
    <Suspense>
      <ContestEdit />
    </Suspense>
  );
}
