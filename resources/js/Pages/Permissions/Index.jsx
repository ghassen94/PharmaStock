import React from "react";
import { Inertia } from "@inertiajs/inertia";
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import PermissionTable from "./PermissionTable";

export default function Index({ permissions }) {
    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">Permissions</h2>
                    <button onClick={() => Inertia.get("/permissions/create")} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">+ Add Permission</button>
                </div>
            }
        >
            <Head title="Permissions" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <PermissionTable permissions={permissions} />
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
