import ContestDetail from '@/components/admin/contest/ContestDetail';
import { Suspense } from 'react';

export default function ContestDetailPage() {
  return (
    <Suspense>
      <ContestDetail />
    </Suspense>
  );
}
