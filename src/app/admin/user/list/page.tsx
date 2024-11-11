import UserList from '@/components/admin/user/UserList';
import { Suspense } from 'react';

export default function List() {
  return (
    <Suspense>
      <UserList />
    </Suspense>
  );
}
