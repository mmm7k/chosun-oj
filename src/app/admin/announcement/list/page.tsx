import AnnouncementList from '@/components/admin/announcement/AnnouncementList';
import { Suspense } from 'react';

export default function List() {
  return (
    <Suspense>
      <AnnouncementList />
    </Suspense>
  );
}
