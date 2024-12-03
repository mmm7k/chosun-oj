import AssignmentList from '@/components/tutor/assignment/AssignmentList';
import { Suspense } from 'react';

export default function AssignmentListPage() {
  return (
    <Suspense>
      <AssignmentList />
    </Suspense>
  );
}
