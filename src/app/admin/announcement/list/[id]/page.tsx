import AnnouncementDetail from '@/components/admin/announcement/AnnouncementDetail';
import { Suspense } from 'react';

export default function AnnouncementDetailPage() {
  return (
    <Suspense>
      <AnnouncementDetail />
    </Suspense>
  );
}
