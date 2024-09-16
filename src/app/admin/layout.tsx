import SideNav from '@/components/layout/admin/SideNav';

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="bg-[#f0f4fc] flex min-h-screen">
      <SideNav />

      <main className="w-full pl-52">{children}</main>
    </div>
  );
}
