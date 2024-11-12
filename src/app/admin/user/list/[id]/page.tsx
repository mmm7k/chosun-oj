import { Suspense } from 'react';
import UserDetail from '@/components/admin/user/UserDetail';
export default function UserDetailPage() {
  return (
    <Suspense>
      <UserDetail />
    </Suspense>
  );
}
