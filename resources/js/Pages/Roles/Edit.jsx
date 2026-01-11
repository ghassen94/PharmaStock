import React, { useState } from "react";
import { router } from "@inertiajs/react";
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { Inertia } from "@inertiajs/inertia";

export default function Edit({ role, permissions, canAssignRestricted }) {
    const [data, setData] = useState({
        name: role.name,
        permissions: role.permissions.map((p) => p.id),
    });

    function togglePermission(id) {
        setData({
            ...data,
            permissions: data.permissions.includes(id)
                ? data.permissions.filter((p) => p !== id)
                : [...data.permissions, id],
        });
    }

    function submit(e) {
        e.preventDefault();
        router.put(route("roles.update", role.id), data, {
            preserveScroll: true,
        });
    }

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">Edit Role</h2>
            }
        >
            <Head title="Edit Role" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <form onSubmit={submit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Role Name
                                    </label>
                                    <input
                                        className="border p-2 w-full rounded"
                                        value={data.name}
                                        onChange={(e) => setData({ ...data, name: e.target.value })}
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Permissions
                                    </label>
                                    <div className="space-y-2">
                                        {permissions.map((p) => {
                                            const isRestricted = ['product.view', 'category.view'].includes(p.name);
                                            const targetRole = role.name ? role.name.toLowerCase() : '';
                                            const disabled = isRestricted && ['user', 'client'].includes(targetRole) && !canAssignRestricted;
                                            return (
                                                <label key={p.id} className="flex items-center">
                                                    <input
                                                        type="checkbox"
                                                        checked={data.permissions.includes(p.id)}
                                                        onChange={() => togglePermission(p.id)}
                                                        className="mr-2"
                                                        disabled={disabled}
                                                    />
                                                    {p.name}
                                                    {disabled && (
                                                        <span className="ml-2 text-xs text-gray-500">(restricted)</span>
                                                    )}
                                                </label>
                                            );
                                        })}
                                    </div>
                                </div>

                                <div className="flex gap-3">
                                    <button
                                        type="submit"
                                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                                    >
                                        Update Role
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => Inertia.get("/roles")}
                                        className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

