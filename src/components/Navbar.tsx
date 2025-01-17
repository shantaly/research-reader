import Link from 'next/link';

const Navbar = () => {
  return (
    <nav className="bg-white shadow-lg border-b border-gray-200 border-solid bottom-2 mb-1">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold text-gray-800">
              Research Reader
            </Link>
          </div>
          
          <div className="flex items-center space-x-4">
            <Link href="/profile" className="text-gray-600 hover:text-gray-900">
              Profile
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 