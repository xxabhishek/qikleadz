@extends('layouts.structure')

@section('content')

    <div class="container mt-4">
        <div class="row justify-content-center">
            <div class="col-lg-10">
                <div class="card shadow-lg border-0 rounded-lg">
                    <div class="card-header d-flex justify-content-between align-items-center">
                        <h4 class="mb-0">Role Management</h4>
                        @can('role-create')
                            <a class="btn btn-success" href="{{ route('roles.create') }}">
                                <i class="fas fa-plus"></i> Create New Role
                            </a>
                        @endcan
                    </div>

                    <div class="card-body">
                        <div class="table-responsive">
                            <table class="table table-bordered table-striped text-center" id="roleTable">
                                <thead class="bg-light">
                                    <tr>
                                        <th>No</th>
                                        <th>Name</th>
                                        <th width="280px">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    @foreach ($roles as $key => $role)
                                        <tr>
                                            <td>{{ ++$i }}</td>
                                            <td>{{ $role->name }}</td>
                                            <td>
                                                <a class="btn btn-info btn-sm" href="{{ route('roles.show', $role->id) }}">
                                                    <i class="fas fa-eye"></i> Show
                                                </a>
                                                {{-- @can('role-edit') --}}
                                                    <a class="btn btn-primary btn-sm" href="{{ route('roles.edit', $role->id) }}">
                                                        <i class="fas fa-edit"></i> Edit
                                                    </a>
                                                {{-- @endcan --}}
                                                {{-- @can('role-delete') --}}
                                                                                    {!! Form::open(['method' => 'DELETE', 'route' => ['roles.destroy', $role->id], 'style' => 'display:inline']) !!}
                                                                                    {!! Form::button('<i class="fas fa-trash"></i> Delete', [
                                                        'type' => 'submit',
                                                        'class' => 'btn btn-danger btn-sm',
                                                        'onclick' => "return confirm('Are you sure you want to delete this role?')"
                                                    ]) !!}
                                                                                    {!! Form::close() !!}
                                                {{-- @endcan --}}
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

    <!-- ✅ jQuery + DataTables + Export Plugins -->
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
            // ✅ Initialize DataTable with Export buttons
            $('#roleTable').DataTable({
                dom: 'Bfrtip', // Show buttons
                buttons: [
                    {
                        extend: 'excelHtml5',
                        title: 'Role_List',
                        text: 'Export Excel',
                        className: 'btn btn-success btn-sm'
                    },
                    {
                        extend: 'pdfHtml5',
                        title: 'Role_List',
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
                    search: "Search Role:"
                }
            });
        });
    </script>
@endsection
