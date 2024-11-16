import CourseDetail from '@/components/admin/course/CourseDetail';
import { Suspense } from 'react';

export default function CourseDetailPage() {
  return (
    <Suspense>
      <CourseDetail />
    </Suspense>
  );
}
