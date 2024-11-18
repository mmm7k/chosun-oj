import ProblemEdit from '@/components/professor/problems/ProblemEdit';
import { Suspense } from 'react';

export default function ProblemEditPage() {
  return (
    <Suspense>
      <ProblemEdit />
    </Suspense>
  );
}
