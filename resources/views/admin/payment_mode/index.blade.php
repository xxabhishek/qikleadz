@extends('layouts.structure')

@section('title', 'Payment Modes - Qikleadz')

@section('content')
    <div class="container">
        <div class="row justify-content-center">
            <div class="col-md-10">

                <div class="card">
                    <div class="card-header d-flex justify-content-between align-items-center">
                        <span>Payment Mode List</span>
                        <a href="{{ route('payment-mode.create') }}" class="btn btn-primary btn-sm">+ Add Payment Mode</a>
                    </div>

                    <div class="card-body">

                        @if (session('success'))
                            <div class="alert alert-success">{{ session('success') }}</div>
                        @endif

                        <div class="table-responsive">
                            <table id="paymentModeTable" class="table table-bordered table-striped">
                                <thead>
                                    <tr>
                                        <th>Sr.No</th>
                                        <th>Payment Mode</th>
                                        <th>Created At</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    @forelse($paymentModes as $mode)
                                        <tr>
                                            <td>{{ $loop->iteration }}</td>
                                            <td>{{ $mode->name }}</td>
                                            <td>{{ $mode->created_at ? $mode->created_at->format('d-m-Y') : '-' }}</td>
                                            <td>
                                                <a href="{{ route('payment-mode.edit', $mode->id) }}"
                                                    class="btn btn-sm btn-warning">Edit</a>

                                                <form action="{{ route('payment-mode.destroy', $mode->id) }}" method="POST"
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
                                            <td colspan="4" class="text-center">No Payment Modes Found</td>
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
    <!-- DataTables -->
    <link rel="stylesheet" href="https://cdn.datatables.net/1.13.7/css/dataTables.bootstrap5.min.css">

    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
    <script src="https://cdn.datatables.net/1.13.7/js/jquery.dataTables.min.js"></script>
    <script src="https://cdn.datatables.net/1.13.7/js/dataTables.bootstrap5.min.js"></script>

    <script>
        $(document).ready(function () {
            $('#paymentModeTable').DataTable({
                "pageLength": 10,
                "ordering": true,
                "lengthChange": true,
                "language": {
                    "search": "Search Mode:"
                }
            });
        });
    </script>
@endsection