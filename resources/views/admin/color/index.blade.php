@extends('layouts.structure')

@section('title', 'Color - Rocker')

@section('content')
    <div class="container">
        <div class="row justify-content-center">
            <div class="col-md-10">
                <div class="card">
                    <div class="card-header d-flex justify-content-between align-items-center">
                        <span>Color List</span>
                        <a href="{{ route('color.create') }}" class="btn btn-primary btn-sm">+ Add Color</a>
                    </div>
                    <div class="card-body">
                        @if (session('success'))
                            <div class="alert alert-success">{{ session('success') }}</div>
                        @endif

                        <table class="table table-bordered table-striped" id="datatable">
                            <thead>
                                <tr>
                                    <th>Sr.No</th>
                                    <th>Color Name</th>
                                    <th>Color Code</th>
                                    <th>Created At</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                @forelse($colors as $color)
                                    <tr>
                                        <td>{{ $loop->iteration }}</td>
                                        <td>{{ $color->name }}</td>
                                        <td>
                                            @if ($color->color_code)
                                                <div
                                                    style="width: 35px; height: 35px; border-radius: 50%; background-color: {{ $color->color_code }}; border: 1px solid #ccc;">
                                                </div>
                                            @else
                                                -
                                            @endif
                                        </td>

                                        <td>{{ $color->created_at ? $color->created_at->format('d-m-Y') : '-' }}</td>
                                        <td>
                                            <a href="{{ route('color.edit', $color->id) }}"
                                                class="btn btn-sm btn-warning">Edit</a>
                                            <form action="{{ route('color.destroy', $color->id) }}" method="POST"
                                                class="d-inline">
                                                @csrf
                                                @method('DELETE')
                                                <button type="submit" onclick="return confirm('Are you sure?')"
                                                    class="btn btn-sm btn-danger">
                                                    Delete
                                                </button>
                                            </form>
                                        </td>
                                    </tr>
                                @empty
                                    <tr>
                                        <td colspan="4" class="text-center">No Color Found</td>
                                    </tr>
                                @endforelse
                            </tbody>
                        </table>
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
            $('#datatable').DataTable({
                "pageLength": 10,
                "ordering": true,
                "lengthChange": true,
                "language": {
                    "search": "Search Color:"
                }
            });
        });
    </script>

@endsection
