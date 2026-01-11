import React, { useState } from "react";
import { Inertia } from "@inertiajs/inertia";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";

export default function Index({ products, categories }) {
    const [creating, setCreating] = useState({
        name: "",
        price: "",
        stock: "",
        category_id: categories[0]?.id || "",
    });
    const [editingId, setEditingId] = useState(null);
    const [editingData, setEditingData] = useState({
        name: "",
        price: "",
        stock: "",
        category_id: "",
    });

    const handleDelete = (id) => {
        if (!confirm("Delete product?")) return;
        Inertia.delete(`/products/${id}`);
    };

    function submit(e) {
        e.preventDefault();
        Inertia.post("/products", creating).then(() =>
            setCreating({
                name: "",
                price: "",
                stock: "",
                category_id: categories[0]?.id || "",
            })
        );
    }

    function startEdit(p) {
        setEditingId(p.id);
        setEditingData({
            name: p.name,
            price: p.price,
            stock: p.stock,
            category_id: p.category_id,
        });
    }

    function saveEdit(id) {
        Inertia.put(`/products/${id}`, editingData);
        setEditingId(null);
    }

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Products
                </h2>
            }
        >
            <Head title="Products" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <form
                                onSubmit={submit}
                                className="mb-6 border p-4 rounded bg-gray-50"
                            >
                                <h3 className="font-medium mb-3">
                                    Create Product
                                </h3>
                                <div className="flex gap-2 flex-wrap">
                                    <input
                                        value={creating.name}
                                        onChange={(e) =>
                                            setCreating({
                                                ...creating,
                                                name: e.target.value,
                                            })
                                        }
                                        placeholder="Name"
                                        className="border p-2 rounded"
                                    />
                                    <input
                                        value={creating.price}
                                        onChange={(e) =>
                                            setCreating({
                                                ...creating,
                                                price: e.target.value,
                                            })
                                        }
                                        placeholder="Price"
                                        className="border p-2 rounded"
                                    />
                                    <input
                                        value={creating.stock}
                                        onChange={(e) =>
                                            setCreating({
                                                ...creating,
                                                stock: e.target.value,
                                            })
                                        }
                                        placeholder="Stock"
                                        className="border p-2 rounded"
                                    />
                                    <select
                                        value={creating.category_id}
                                        onChange={(e) =>
                                            setCreating({
                                                ...creating,
                                                category_id: e.target.value,
                                            })
                                        }
                                        className="border p-2 rounded"
                                    >
                                        {categories.map((c) => (
                                            <option key={c.id} value={c.id}>
                                                {c.name}
                                            </option>
                                        ))}
                                    </select>
                                    <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                                        Create
                                    </button>
                                </div>
                            </form>

                            <div className="overflow-x-auto">
                                <table className="w-full table-auto border-collapse">
                                    <thead className="bg-gray-100">
                                        <tr>
                                            <th className="border p-3 text-left">
                                                Name
                                            </th>
                                            <th className="border p-3 text-left">
                                                Category
                                            </th>
                                            <th className="border p-3 text-left">
                                                Price
                                            </th>
                                            <th className="border p-3 text-left">
                                                Stock
                                            </th>
                                            <th className="border p-3 text-left">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {products.map((p) => (
                                            <tr
                                                key={p.id}
                                                className="hover:bg-gray-50"
                                            >
                                                <td className="border p-3">
                                                    {editingId === p.id ? (
                                                        <input
                                                            value={
                                                                editingData.name
                                                            }
                                                            onChange={(e) =>
                                                                setEditingData({
                                                                    ...editingData,
                                                                    name: e
                                                                        .target
                                                                        .value,
                                                                })
                                                            }
                                                            className="border p-2 rounded w-full"
                                                        />
                                                    ) : (
                                                        p.name
                                                    )}
                                                </td>
                                                <td className="border p-3">
                                                    {editingId === p.id ? (
                                                        <select
                                                            value={
                                                                editingData.category_id
                                                            }
                                                            onChange={(e) =>
                                                                setEditingData({
                                                                    ...editingData,
                                                                    category_id:
                                                                        e.target
                                                                            .value,
                                                                })
                                                            }
                                                            className="border p-2 rounded w-full"
                                                        >
                                                            {categories.map(
                                                                (c) => (
                                                                    <option
                                                                        key={
                                                                            c.id
                                                                        }
                                                                        value={
                                                                            c.id
                                                                        }
                                                                    >
                                                                        {c.name}
                                                                    </option>
                                                                )
                                                            )}
                                                        </select>
                                                    ) : (
                                                        p.category?.name
                                                    )}
                                                </td>
                                                <td className="border p-3">
                                                    {editingId === p.id ? (
                                                        <input
                                                            value={
                                                                editingData.price
                                                            }
                                                            onChange={(e) =>
                                                                setEditingData({
                                                                    ...editingData,
                                                                    price: e
                                                                        .target
                                                                        .value,
                                                                })
                                                            }
                                                            className="border p-2 rounded w-full"
                                                        />
                                                    ) : (
                                                        `$${p.price}`
                                                    )}
                                                </td>
                                                <td className="border p-3">
                                                    {editingId === p.id ? (
                                                        <input
                                                            value={
                                                                editingData.stock
                                                            }
                                                            onChange={(e) =>
                                                                setEditingData({
                                                                    ...editingData,
                                                                    stock: e
                                                                        .target
                                                                        .value,
                                                                })
                                                            }
                                                            className="border p-2 rounded w-full"
                                                        />
                                                    ) : (
                                                        p.stock
                                                    )}
                                                </td>
                                                <td className="border p-3">
                                                    {editingId === p.id ? (
                                                        <div className="space-x-2">
                                                            <button
                                                                onClick={() =>
                                                                    saveEdit(
                                                                        p.id
                                                                    )
                                                                }
                                                                className="text-green-600 hover:text-green-800"
                                                            >
                                                                Save
                                                            </button>
                                                            <button
                                                                onClick={() =>
                                                                    setEditingId(
                                                                        null
                                                                    )
                                                                }
                                                                className="text-gray-600 hover:text-gray-800"
                                                            >
                                                                Cancel
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        <div className="space-x-2">
                                                            <button
                                                                onClick={() =>
                                                                    startEdit(p)
                                                                }
                                                                className="text-yellow-600 hover:text-yellow-800"
                                                            >
                                                                Edit
                                                            </button>
                                                            <button
                                                                onClick={() =>
                                                                    handleDelete(
                                                                        p.id
                                                                    )
                                                                }
                                                                className="text-red-600 hover:text-red-800"
                                                            >
                                                                Delete
                                                            </button>
                                                        </div>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
