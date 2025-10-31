@extends('layouts.structure')

@section('title', 'Cities - Rocker')

@section('content')
<div class="container">
    <div class="row justify-content-center">
        <div class="col-md-10">
            <div class="card">
                <div class="card-header d-flex justify-content-between align-items-center">
                    <span>City List</span>
                    <a href="{{ route('city.create') }}" class="btn btn-primary btn-sm">+ Add City</a>
                </div>
                <div class="card-body">
                    @if (session('success'))
                        <div class="alert alert-success">{{ session('success') }}</div>
                    @endif

                    <div class="table-responsive">
                        <table id="cityTable" class="table table-bordered table-striped">
                            <thead>
                                <tr>
                                    <th>Sr.No.</th>
                                    <th>City Name</th>
                                    <th>State</th>
                                    <th>Country</th>
                                    <th>Created At</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                @forelse($cities as $city)
                                    <tr>
                                        <td>{{ $loop->iteration }}</td>
                                        <td>{{ $city->name }}</td>
                                        <td>{{ $city->state->name ?? '-' }}</td>
                                        <td>{{ $city->state->country->name ?? '-' }}</td>
                                        <td>{{ $city->created_at ? $city->created_at->format('d-m-Y') : '-' }}</td>
                                        <td>
                                            <a href="{{ route('city.edit', $city->id) }}" class="btn btn-sm btn-warning me-1">Edit</a>
                                            <form action="{{ route('city.destroy', $city->id) }}" method="POST" class="d-inline">
                                                @csrf
                                                @method('DELETE')
                                                <button type="submit" onclick="return confirm('Are you sure you want to delete this city?')" class="btn btn-sm btn-danger">
                                                    Delete
                                                </button>
                                            </form>
                                        </td>
                                    </tr>
                                @empty
                                    <tr>
                                        <td colspan="6" class="text-center text-muted">No Cities Found</td>
                                    </tr>
                                @endforelse
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
    {{-- Include DataTables JS & CSS --}}
    <link rel="stylesheet" href="https://cdn.datatables.net/1.13.7/css/dataTables.bootstrap5.min.css">
    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
    <script src="https://cdn.datatables.net/1.13.7/js/jquery.dataTables.min.js"></script>
    <script src="https://cdn.datatables.net/1.13.7/js/dataTables.bootstrap5.min.js"></script>

    <script>
        $(document).ready(function () {
            $('#cityTable').DataTable({
                pageLength: 10,
                ordering: true,
                columnDefs: [
                    { orderable: false, targets: 5 } // Disable sorting on "Actions"
                ],
                language: {
                    search: "Search City:"
                }
            });
        });
    </script>
@endsection
