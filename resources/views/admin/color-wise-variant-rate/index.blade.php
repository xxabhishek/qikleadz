@extends('layouts.structure')

@section('title', 'Color Wise Variant Rates - Rocker')

@section('content')
    <div class="container">
        <div class="row justify-content-center">
            <div class="col-md-10">
                <div class="card">
                    <div class="card-header d-flex justify-content-between align-items-center">
                        <span>Color Wise Variant Rate List</span>
                            <a href="{{ route('color-wise-variant-rate.create') }}" class="btn btn-primary btn-sm">+ Add
                                Rate</a>


                    </div>

                    <div class="card-body">
                        @if (session('success'))
                            <div class="alert alert-success">{{ session('success') }}</div>
                        @endif

                        <div class="table-responsive">
                            <table id="colorWiseVariantRateTable" class="table table-bordered table-striped">
                                <thead>
                                    <tr>
                                        <th>Sr. No</th>
                                        <th>Variant</th>
                                        <th>Color</th>
                                        <th>Price</th>
                                        <th>Created At</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    @foreach($colorWiseRates as $rate)
                                        <tr>
                                            <td>{{ $loop->iteration }}</td>

                                            <td>{{ $rate->variant->name ?? '-' }}</td>

                                            <td>{{ $rate->color->name ?? '-' }}</td>

                                            <td>{{ number_format($rate->price, 2) }}</td>

                                            <td>{{ $rate->created_at->format('d-m-Y') }}</td>

                                            <td>
                                                    <a href="{{ route('color-wise-variant-rate.edit', $rate->id) }}"
                                                        class="btn btn-sm btn-warning">Edit</a>


                                                    <form action="{{ route('color-wise-variant-rate.destroy', $rate->id) }}"
                                                        method="POST" class="d-inline">
                                                        @csrf
                                                        @method('DELETE')

                                                        <button type="submit" class="btn btn-sm btn-danger delete-btn"
                                                            data-name="Rate ID: {{ $rate->id }}" onclick="alert('r u sure')">
                                                            Delete
                                                        </button>
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
    </div>
@endsection


@section('scripts')

    {{-- DataTables --}}
    <link rel="stylesheet" href="https://cdn.datatables.net/1.13.7/css/dataTables.bootstrap5.min.css">
    <link rel="stylesheet" href="https://cdn.datatables.net/buttons/2.4.2/css/buttons.dataTables.min.css">

    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
    <script src="https://cdn.datatables.net/1.13.7/js/jquery.dataTables.min.js"></script>
    <script src="https://cdn.datatables.net/1.13.7/js/dataTables.bootstrap5.min.js"></script>
    <script src="https://cdn.datatables.net/buttons/2.4.2/js/dataTables.buttons.min.js"></script>
    <script src="https://cdn.datatables.net/buttons/2.4.2/js/buttons.flash.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.2.7/pdfmake.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.2.7/vfs_fonts.js"></script>
    <script src="https://cdn.datatables.net/buttons/2.4.2/js/buttons.html5.min.js"></script>
    <script src="https://cdn.datatables.net/buttons/2.4.2/js/buttons.print.min.js"></script>

    <script>
        $(document).ready(function () {
            $('#colorWiseVariantRateTable').DataTable({
                pageLength: 10,
                responsive: true,
                dom: 'Bfrtip',
                buttons: ['excel', 'pdf', 'print'],
                ordering: true,
                language: {
                    search: "Search:"
                }
            });

            $('.delete-btn').on('click', function (e) {
                e.preventDefault();
                const form = $(this).closest('form');
                const name = $(this).data('name');

                if (confirm(`Are you sure you want to delete ${name}?`)) {
                    form.submit();
                }
            });
        });
    </script>

@endsection
