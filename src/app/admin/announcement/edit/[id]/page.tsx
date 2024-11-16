import AnnouncementEdit from '@/components/admin/announcement/AnnouncementEdit';
import { Suspense } from 'react';

export default function AnnouncementEditPage() {
  return (
    <Suspense>
      <AnnouncementEdit />
    </Suspense>
  );
}
