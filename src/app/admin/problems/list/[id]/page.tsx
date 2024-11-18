import ProblemDetail from '@/components/admin/problems/ProblemDetail';
import { Suspense } from 'react';

export default function ProblemDetailPage() {
  return (
    <Suspense>
      <ProblemDetail />
    </Suspense>
  );
}
