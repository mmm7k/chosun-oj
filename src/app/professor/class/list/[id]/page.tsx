import ClassDetail from '@/components/professor/class/ClassDetail';
import { Suspense } from 'react';

export default function ClassDetailPage() {
  return (
    <Suspense>
      <ClassDetail />
    </Suspense>
  );
}
