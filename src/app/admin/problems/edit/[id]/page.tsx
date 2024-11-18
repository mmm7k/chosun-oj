import ContestEdit from '@/components/admin/contest/ContestEdit';
import ProblemEdit from '@/components/admin/problems/ProblemEdit';
import { Suspense } from 'react';

export default function ProblemEditPage() {
  return (
    <Suspense>
      <ProblemEdit />
    </Suspense>
  );
}
