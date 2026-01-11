import React from "react";
import { Inertia } from "@inertiajs/inertia";
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import RoleTable from "./RoleTable";

export default function Index({ roles, permissions }) {
    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">Roles</h2>
                    <button onClick={() => Inertia.get("/roles/create")} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">+ Add Role</button>
                </div>
            }
        >
            <Head title="Roles" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <RoleTable roles={roles} permissions={permissions} />
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
