import CourseDetail from '@/components/professor/class/CourseDetail';
import { Suspense } from 'react';

export default function CourseDetailPage() {
  return (
    <Suspense>
      <CourseDetail />
    </Suspense>
  );
}
