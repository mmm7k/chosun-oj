import CourseDetail from '@/components/admin/course/CourseDetail';
import { Suspense } from 'react';

export default function UserDetailPage() {
  return (
    <Suspense>
      <CourseDetail />
    </Suspense>
  );
}
