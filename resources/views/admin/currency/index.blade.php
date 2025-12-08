@extends('layouts.structure')

@section('title', 'Currency List - Rocker')

@section('content')
<div class="container">
    <div class="row justify-content-center">
        <div class="col-md-10">
            <div class="card">
                <div class="card-header d-flex justify-content-between align-items-center">
                    <span>Currency List</span>
                    <a href="{{ route('currency.create') }}" class="btn btn-primary btn-sm">+ Add Currency</a>
                </div>
                <div class="card-body">

                    @if(session('success'))
                        <div class="alert alert-success">{{ session('success') }}</div>
                    @endif

                    <table class="table table-bordered" id="currencyTable">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Country</th>
                                <th>Currency</th>
                                <th>Symbol</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            @foreach($currencies as $c)
                                <tr>
                                    <td>{{ $loop->iteration }}</td>
                                    <td>{{ $c->country->name ?? 'N/A' }}</td>
                                    <td>{{ $c->currency }}</td>
                                    <td>{{ $c->symbol }}</td>
                                    <td class="d-flex gap-1">
                                        <a href="{{ route('currency.edit', $c->id) }}" class="btn btn-sm btn-warning">Edit</a>
                                        <form action="{{ route('currency.destroy', $c->id) }}" method="POST"
                                              onsubmit="return confirm('Are you sure?')">
                                            @csrf
                                            @method('DELETE')
                                            <button class="btn btn-sm btn-danger">Delete</button>
                                        </form>
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
@endsection

@section('scripts')
    {{-- Include DataTables JS & CSS --}}
    <link rel="stylesheet" href="https://cdn.datatables.net/1.13.7/css/dataTables.bootstrap5.min.css">
    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
    <script src="https://cdn.datatables.net/1.13.7/js/jquery.dataTables.min.js"></script>
    <script src="https://cdn.datatables.net/1.13.7/js/dataTables.bootstrap5.min.js"></script>

    <script>
        $(document).ready(function () {
            $('#currencyTable').DataTable({
                "pageLength": 10,
                "ordering": true,
                "lengthChange": true,
                "language": {
                    "search": "Search Currency:"
                }
            });

            // ✅ Custom delete confirmation
            $('.delete-btn').on('click', function (e) {
                e.preventDefault(); // Stop form submission
                const form = $(this).closest('form');
                const countryName = $(this).data('currency');

                if (confirm(`Are you sure you want to delete the country "${countryName}"?`)) {
                    form.submit(); // Proceed with delete
                }
            });
        });
    </script>

@endsection
