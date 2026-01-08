import React from 'react';
import { Link } from '@inertiajs/react';

export default function App(){
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">PharmaStock </h1>
      <nav className="mt-4 space-x-4">
        <Link href="/users" className="text-blue-600">Users</Link>
        <Link href="/roles" className="text-blue-600">Roles</Link>
        <Link href="/permissions" className="text-blue-600">Permissions</Link>
        <Link href="/categories" className="text-blue-600">Categories</Link>
      </nav>
    </div>
  );
}
