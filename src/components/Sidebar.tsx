import Link from 'next/link';

interface SidebarItem {
  title: string;
  href: string;
  icon?: string;
}

const sidebarItems: SidebarItem[] = [
  { title: 'Dashboard', href: '/dashboard' },
  { title: 'My Courses', href: '/courses' },
  { title: 'Bookmarks', href: '/bookmarks' },
  { title: 'Notes', href: '/notes' },
];

const Sidebar = () => {
  return (
    <div className="w-64 h-full bg-white shadow-lg">
      <div className="flex flex-col h-full py-4">
        <div className="space-y-4">
          {sidebarItems.map((item) => (
            <Link
              key={item.title}
              href={item.href}
              className="block px-4 py-2 text-gray-600 hover:bg-gray-100 hover:text-gray-900"
            >
              {item.title}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Sidebar; 