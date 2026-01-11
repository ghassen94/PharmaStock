# PharmaStock Project

This repository contains the PharmaStock Management System (RBAC + Hierarchy) prototype built for the assignment.

## Quick Start

1. Copy `.env.example` to `.env` and configure your database.
2. Install dependencies:

```bash
composer install
npm install
```

3. Migrate & seed:
php artisan migrate --seed

4. Build front-end assets:
npm run build

5. Serve the app:
php artisan serve

## Seeds

- Admin: `admin@test.com` / `password`
- Client: `client@test.com` / `password`
- User: `user@test.com` / `password`

