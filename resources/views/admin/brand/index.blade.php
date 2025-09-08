@extends('layouts.structure')

@section('title', 'Brands - Rocker')

@section('content')
    <div class="container">
        <div class="row justify-content-center">
            <div class="col-md-10">
                <div class="card">
                    <div class="card-header d-flex justify-content-between align-items-center">
                        <span>Brand List</span>
                        <a href="{{ route('brand.create') }}" class="btn btn-primary btn-sm">+ Add Model</a>
                    </div>
                    <div class="card-body">
                        @if (session('success'))
                            <div class="alert alert-success">{{ session('success') }}</div>
                        @endif
                        @if (session('error'))
                            <div class="alert alert-danger">{{ session('error') }}</div>
                        @endif

                        <table class="table table-bordered table-striped">
                            <thead>
                                <tr>
                                    <th>Sr.No</th>
                                    <th>Brand Name</th>
                                    <th>Country</th>
                                    <th>Vehicle Type</th>
                                    <th>Industry Type</th>
                                    <th>Created At</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                @forelse ($models as $model)
                                    <tr>
                                        <td>{{ $loop->iteration }}</td>
                                        <td>{{ $model->name }}</td>
                                        <td>{{ $model->country->name ?? '-' }}</td>
                                        <td>{{ $model->vehicleType->name ?? '-' }}</td>
                                        <td>{{ $model->industryType->name ?? '-' }}</td>
                                        <td>{{ $model->created_at ? $model->created_at->format('d-m-Y') : '-' }}</td>
                                        <td>
                                            <a href="{{ route('brand.edit', $model->id) }}"
                                                class="btn btn-sm btn-warning">Edit</a>

                                            <form id="delete-form-{{ $model->id }}"
                                                action="{{ route('brand.destroy', $model->id) }}" method="POST"
                                                class="d-inline">
                                                @csrf
                                                @method('DELETE')
                                                <button type="button" class="btn btn-sm btn-danger delete-btn"
                                                    data-id="{{ $model->id }}">
                                                    Delete
                                                </button>
                                            </form>
                                        </td>
                                    </tr>
                                @empty
                                    <tr>
                                        <td colspan="7" class="text-center">No Models Found</td>
                                    </tr>
                                @endforelse
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    </div>

    {{-- SweetAlert2 Script --}}
    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
    <script>
        document.querySelectorAll('.delete-btn').forEach(button => {
            button.addEventListener('click', function() {
                const formId = 'delete-form-' + this.dataset.id;
                Swal.fire({
                    title: 'Are you sure?',
                    text: "This action cannot be undone!",
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#d33',
                    cancelButtonColor: '#3085d6',
                    confirmButtonText: 'Yes, delete it!',
                    cancelButtonText: 'Cancel'
                }).then((result) => {
                    if (result.isConfirmed) {
                        document.getElementById(formId).submit();
                    }
                });
            });
        });
    </script>
@endsection
