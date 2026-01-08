import { Head, Link } from '@inertiajs/react';

export default function Welcome({ auth }) {
    return (
        <>
            <Head title="PharmaStock" />
            <div className="flex min-h-screen items-center justify-center bg-white">
                <div className="text-center">
                    <h1 className="text-3xl font-bold">PharmaStock</h1>
                    <p className="mt-4 text-gray-600">Gestion des stocks pharmaceutiques — administration simple et sécurisée.</p>
                    <div className="mt-6">
                        {auth.user ? (
                            <a href={route('users.index')} className="text-blue-600 underline">Accueil</a>
                        ) : (
                            <a href={route('login')} className="text-blue-600 underline">Connexion</a>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}
