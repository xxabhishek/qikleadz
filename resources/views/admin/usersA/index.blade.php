@extends('layouts.structure')

@section('title', 'Users Management - Qikleadz')

@section('content')
    <div class="container">
        <div class="row justify-content-center">
            <div class="col-md-10">
                <div class="card">
                    <div class="card-header d-flex justify-content-between align-items-center">
                        <span>User List</span>
                        <a href="{{ route('users.create') }}" class="btn btn-primary btn-sm">+ Add User</a>
                    </div>
                    <div class="card-body">
                        @if (session('success'))
                            <div class="alert alert-success">{{ session('success') }}</div>
                        @endif

                        <div class="table-responsive">
                            <table id="userTable" class="table table-bordered table-striped">
                                <thead>
                                    <tr>
                                        <th>Sr.No</th>
                                        <th>User ID</th>
                                        <th>Name</th>
                                        <th>Email</th>
                                        <th>Role</th>
                                        <th>Created At</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    @forelse($data as $key => $user)
                                        <tr>
                                            <td>{{ ($data->currentPage() - 1) * $data->perPage() + $loop->iteration }}</td>
                                            <td>{{ $user->user_id }}</td>
                                            <td>{{ $user->name }}</td>
                                            <td>{{ $user->email }}</td>
                                            <td>
                                                @if ($user->roleData)
                                                    <span class="badge bg-info text-white">{{ $user->roleData->name }}</span>
                                                @else
                                                    <span class="text-muted">No role</span>
                                                @endif
                                            </td>
                                            <td>{{ $user->created_at ? $user->created_at->format('d-m-Y') : '-' }}</td>
                                            <td>
                                                <a href="{{ route('users.show', $user->id) }}"
                                                    class="btn btn-sm btn-info">Show</a>
                                                <a href="{{ route('users.edit', $user->id) }}"
                                                    class="btn btn-sm btn-warning">Edit</a>
                                                <form action="{{ route('users.destroy', $user->id) }}" method="POST"
                                                    class="d-inline">
                                                    @csrf
                                                    @method('DELETE')
                                                    <button type="submit"
                                                        onclick="return confirm('Are you sure you want to delete this user?')"
                                                        class="btn btn-sm btn-danger">
                                                        Delete
                                                    </button>
                                                </form>
                                            </td>
                                        </tr>
                                    @empty
                                        <tr>
                                            <td colspan="7" class="text-center">No Users Found</td>
                                        </tr>
                                    @endforelse
                                </tbody>
                            </table>
                        </div>

                        <!-- Pagination Links -->
                        @if($data->hasPages())
                            <div class="d-flex justify-content-between align-items-center mt-3">

                                <nav aria-label="Page navigation">
                                    <ul class="pagination pagination-sm mb-0">
                                        {{-- Previous Page Link --}}
                                        @if ($data->onFirstPage())
                                            <li class="page-item disabled">
                                                <span class="page-link">&laquo;</span>
                                            </li>
                                        @else
                                            <li class="page-item">
                                                <a class="page-link" href="{{ $data->previousPageUrl() }}" rel="prev">&laquo;</a>
                                            </li>
                                        @endif

                                        {{-- Pagination Elements --}}
                                        @foreach ($data->getUrlRange(1, $data->lastPage()) as $page => $url)
                                            @if ($page == $data->currentPage())
                                                <li class="page-item active" aria-current="page">
                                                    <span class="page-link">{{ $page }}</span>
                                                </li>
                                            @elseif ($page > $data->currentPage() - 3 && $page < $data->currentPage() + 3)
                                                <li class="page-item">
                                                    <a class="page-link" href="{{ $url }}">{{ $page }}</a>
                                                </li>
                                            @endif
                                        @endforeach

                                        {{-- Next Page Link --}}
                                        @if ($data->hasMorePages())
                                            <li class="page-item">
                                                <a class="page-link" href="{{ $data->nextPageUrl() }}" rel="next">&raquo;</a>
                                            </li>
                                        @else
                                            <li class="page-item disabled">
                                                <span class="page-link">&raquo;</span>
                                            </li>
                                        @endif
                                    </ul>
                                </nav>
                            </div>
                        @endif
                    </div>
                </div>
            </div>
        </div>
    </div>
@endsection

@section('scripts')
    {{-- Include DataTables JS & CSS --}}
    <link rel="stylesheet" href="https://cdn.datatables.net/1.13.7/css/dataTables.bootstrap5.min.css">
    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
    <script src="https://cdn.datatables.net/1.13.7/js/jquery.dataTables.min.js"></script>
    <script src="https://cdn.datatables.net/1.13.7/js/dataTables.bootstrap5.min.js"></script>

    <script>
        $(document).ready(function () {
            $('#userTable').DataTable({
                "pageLength": 10,
                "ordering": true,
                "lengthChange": true,
                "searching": true,
                "info": true,
                "paging": false, // 禁用DataTable自带分页，使用Laravel分页
                "language": {
                    "search": "Search User:"
                }
            });

            // ✅ Custom delete confirmation
            $('.delete-btn').on('click', function (e) {
                e.preventDefault(); // Stop form submission
                const form = $(this).closest('form');
                const userName = $(this).data('user');

                if (confirm(`Are you sure you want to delete the user "${userName}"?`)) {
                    form.submit(); // Proceed with delete
                }
            });
        });
    </script>
@endsection