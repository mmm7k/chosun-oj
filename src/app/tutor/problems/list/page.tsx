import ProblemList from '@/components/tutor/problems/ProblemList';
import { Suspense } from 'react';

export default function List() {
  return (
    <Suspense>
      <ProblemList />
    </Suspense>
  );
}
