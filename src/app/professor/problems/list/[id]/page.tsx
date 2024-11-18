import ProblemDetail from '@/components/professor/problems/ProblemDetail';
import { Suspense } from 'react';

export default function ProblemDetailPage() {
  return (
    <Suspense>
      <ProblemDetail />
    </Suspense>
  );
}
