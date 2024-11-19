import SubmissionList from '@/components/professor/contest/SubmissionLIst';
import { Suspense } from 'react';

export default function Submission() {
  return (
    <Suspense>
      <SubmissionList />
    </Suspense>
  );
}
