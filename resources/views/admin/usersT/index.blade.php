@extends('layouts.structure')

@section('content')
<div class="container">
    <div class="row justify-content-center">
        <div class="col-md-10">
            <div class="card shadow-lg rounded">
                <div class="card-header text-center">
                    <h3 class="text-black">Users Management</h3>
                </div>
                <div class="card-body">
                    <div class="d-flex justify-content-between mb-3">
                        <h4 class="text-secondary">List of Users</h4>
                        @can('user-create')
                        <a class="btn btn-success" href="{{ route('users.create') }}">
                            <i class="fas fa-user-plus"></i> Create New User
                        </a>
                        @endcan
                    </div>

                    @if ($message = Session::get('success'))
                        <div class="alert alert-success">
                            <p>{{ $message }}</p>
                        </div>
                    @endif

                    <div class="table-responsive">
                        <table id="datatable" class="table table-hover table-bordered text-center">
                            <thead class="bg-dark text-white">
                                <tr>
                                    <th>No</th>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Roles</th>
                                    <th>Parent Name</th>
                                    <th width="280px">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                @foreach ($data as $key => $user)
                                <tr>
                                    <td>{{ ++$i }}</td>
                                    <td>{{ $user->name }}</td>
                                    <td>{{ $user->email }}</td>
                                    <td>
                                        @if ($user->roleData)
                                            <span class="badge bg-info text-white">{{ $user->roleData->name }}</span>
                                        @else
                                            <span class="text-muted">No role</span>
                                        @endif
                                    </td>
                                    <td>{{ $user->parent?->name ?? 'No Parent' }}</td>
                                    <td>
                                        <a class="btn btn-info btn-sm" href="{{ route('users.show', $user->id) }}">
                                            <i class="fas fa-eye"></i> Show
                                        </a>
                                        @can('user-edit')
                                        <a class="btn btn-primary btn-sm" href="{{ route('users.edit', $user->id) }}">
                                            <i class="fas fa-edit"></i> Edit
                                        </a>
                                        @endcan
                                        @can('user-delete')
                                        {!! Form::open(['method' => 'DELETE', 'route' => ['users.destroy', $user->id], 'style' => 'display:inline']) !!}
                                        {!! Form::button('<i class="fas fa-trash-alt"></i> Delete', [
                                            'type' => 'submit',
                                            'class' => 'btn btn-danger btn-sm',
                                            'onclick' => 'return confirm("Are you sure you want to delete this user?")',
                                        ]) !!}
                                        {!! Form::close() !!}
                                        @endcan
                                    </td>
                                </tr>
                                @endforeach
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
@endsection


@section('scripts')
<!-- ✅ DataTables CSS -->
<link rel="stylesheet" href="https://cdn.datatables.net/1.13.7/css/jquery.dataTables.min.css">
<link rel="stylesheet" href="https://cdn.datatables.net/buttons/2.4.2/css/buttons.dataTables.min.css">

<!-- ✅ jQuery + DataTables + Buttons -->
<script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
<script src="https://cdn.datatables.net/1.13.7/js/jquery.dataTables.min.js"></script>
<script src="https://cdn.datatables.net/buttons/2.4.2/js/dataTables.buttons.min.js"></script>
<script src="https://cdn.datatables.net/buttons/2.4.2/js/buttons.html5.min.js"></script>
<script src="https://cdn.datatables.net/buttons/2.4.2/js/buttons.print.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.2.7/pdfmake.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.2.7/vfs_fonts.js"></script>

<script>
$(document).ready(function () {
    $('#datatable').DataTable({
        dom: 'Bfrtip', // Buttons, filter, table, pagination
        buttons: [
            {
                extend: 'excelHtml5',
                title: 'Users_List',
                text: 'Export Excel',
                className: 'btn btn-success btn-sm'
            },
            {
                extend: 'pdfHtml5',
                title: 'Users_List',
                text: 'Export PDF',
                className: 'btn btn-danger btn-sm'
            },
            {
                extend: 'print',
                text: 'Print',
                className: 'btn btn-secondary btn-sm'
            }
        ],
        pageLength: 10,
        ordering: true,
        lengthChange: true,
        language: {
            search: "Search User:"
        }
    });
});
</script>
@endsection
