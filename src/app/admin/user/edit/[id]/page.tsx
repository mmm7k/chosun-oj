import UserEdit from '@/components/admin/user/UserEdit';
import { Suspense } from 'react';

export default function UserEditPage() {
  return (
    <Suspense>
      <UserEdit />
    </Suspense>
  );
}
