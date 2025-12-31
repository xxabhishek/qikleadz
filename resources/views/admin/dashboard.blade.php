<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin Dashboard</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
</head>

<body>
    <nav class="navbar navbar-expand-lg navbar-dark bg-primary">
        <div class="container-fluid">
            <a class="navbar-brand" href="#">Admin Dashboard</a>
            <div class="navbar-nav ms-auto">
                <span class="navbar-text text-white me-3">
                    Welcome, {{ auth()->user()->name }}
                </span>
                <a class="btn btn-outline-light" href="{{ route('logout') }}">Logout</a>
            </div>
        </div>
    </nav>

    <div class="container-fluid mt-4">
        <div class="row">
            <div class="col-md-3">
                <div class="card">
                    <div class="card-header bg-info text-white">
                        <h5 class="mb-0">Admin Menu</h5>
                    </div>
                    <div class="list-group list-group-flush">
                        <a href="{{ route('admin.users.index') }}"
                            class="list-group-item list-group-item-action">Users</a>
                        <a href="{{ route('admin.roles.index') }}"
                            class="list-group-item list-group-item-action">Roles</a>
                        <a href="{{ route('admin.areas.index') }}"
                            class="list-group-item list-group-item-action">Areas</a>
                        <a href="{{ route('country.index') }}"
                            class="list-group-item list-group-item-action">Countries</a>
                        <a href="{{ route('lead.index') }}" class="list-group-item list-group-item-action">Leads</a>
                    </div>
                </div>
            </div>

            <div class="col-md-9">
                <div class="card">
                    <div class="card-header">
                        <h4>Dashboard Overview</h4>
                    </div>
                    <div class="card-body">
                        <h5>Welcome to the Admin Dashboard!</h5>
                        <p>You are logged in as: {{ auth()->user()->email }}</p>
                        <p>Role: Admin</p>

                        <div class="row mt-4">
                            <div class="col-md-6">
                                <div class="card text-white bg-success mb-3">
                                    <div class="card-header">Quick Actions</div>
                                    <div class="card-body">
                                        <p class="card-text">
                                            <a href="{{ route('admin.users.create') }}" class="text-white">Add New
                                                User</a><br>
                                            <a href="{{ route('lead.create') }}" class="text-white">Create New Lead</a>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
</body>

</html>
