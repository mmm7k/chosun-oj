import CourseList from '@/components/professor/class/CourseList';
import { Suspense } from 'react';

export default function CourseListPage() {
  return (
    <Suspense>
      <CourseList />
    </Suspense>
  );
}
