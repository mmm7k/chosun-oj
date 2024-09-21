import HeaderNav from '@/components/layout/student/HeaderNav';

export default function StudentLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="bg-[#f0f4fc] flex flex-col min-w-screen min-h-[100dvh]">
      <HeaderNav />
      {children}
    </div>
  );
}
