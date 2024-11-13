import CourseEdit from '@/components/admin/course/CourseEdit';
import { Suspense } from 'react';

export default function CourseEditPage() {
  return (
    <Suspense>
      <CourseEdit />
    </Suspense>
  );
}
