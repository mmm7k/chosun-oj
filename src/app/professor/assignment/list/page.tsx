import AssignmentList from '@/components/professor/assignment/AssignmentList';
import { Suspense } from 'react';

export default function AssignmentListPage() {
  return (
    <Suspense>
      <AssignmentList />
    </Suspense>
  );
}
