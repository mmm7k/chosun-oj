import UserList from '@/components/admin/user/UserList';
import { Suspense } from 'react';

export default function UserListPage() {
  return (
    <Suspense>
      <UserList />
    </Suspense>
  );
}
