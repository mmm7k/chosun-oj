import SideNav from '@/components/layout/professor/SideNav';
import ReactQueryProvider from '@/lib/ReactQueryProvider';

export default function ProfessorLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ReactQueryProvider>
      <div className="bg-[#f0f4fc] flex flex-col 2xl:flex-row min-w-screen 2xl:min-h-screen">
        <SideNav />
        <main className="w-full 2xl:pl-52">{children}</main>
      </div>
    </ReactQueryProvider>
  );
}
