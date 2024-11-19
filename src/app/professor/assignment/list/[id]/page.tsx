import AssignmentDetail from '@/components/professor/assignment/AssignmentDetail';
import { Suspense } from 'react';

export default function AssignmentDetailPage() {
  return (
    <Suspense>
      <AssignmentDetail />
    </Suspense>
  );
}
