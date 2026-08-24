import Sidebar from '../components/sidebar';

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 pl-64 p-8 min-h-screen bg-stone-50/50">
        {children}
      </main>
    </div>
  );
}
