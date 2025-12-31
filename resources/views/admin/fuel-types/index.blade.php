@extends('layouts.structure')

@section('title', 'Fuel Types - Qikleadz')

@section('content')
    <div class="container">
        <div class="row justify-content-center">
            <div class="col-md-10">
                <div class="card">
                    <div class="card-header d-flex justify-content-between align-items-center">
                        <span>Fuel Types</span>
                        <a href="{{ route('fuel-types.create') }}" class="btn btn-primary btn-sm">+ Add Fuel Type</a>
                    </div>
                    <div class="card-body">
                        @if (session('success'))
                            <div class="alert alert-success">{{ session('success') }}</div>
                        @endif

                        <table class="table table-bordered table-striped">
                            <thead>
                                <tr>
                                    <th>Sr.No</th>
                                    <th>Name</th>
                                    <th>Created At</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                @forelse ($fuelTypes as $fuelType)
                                    <tr>
                                        <td>{{ $loop->iteration }}</td>
                                        <td>{{ $fuelType->name }}</td>
                                        <td>{{ $fuelType->created_at ? $fuelType->created_at->format('d-m-Y') : '-' }}</td>
                                        <td>
                                            <a href="{{ route('fuel-types.edit', $fuelType->id) }}"
                                                class="btn btn-warning btn-sm">Edit</a>
                                            <form action="{{ route('fuel-types.destroy', $fuelType->id) }}" method="POST"
                                                class="d-inline" id="delete-form-{{ $fuelType->id }}">
                                                @csrf
                                                @method('DELETE')
                                                <button type="button" class="btn btn-danger btn-sm delete-btn"
                                                    data-id="{{ $fuelType->id }}">Delete</button>
                                            </form>
                                        </td>
                                    </tr>
                                @empty
                                    <tr>
                                        <td colspan="4" class="text-center">No Fuel Types Found</td>
                                    </tr>
                                @endforelse
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    </div>

    {{-- SweetAlert Delete Confirmation --}}
    <script>
        document.querySelectorAll('.delete-btn').forEach(button => {
            button.addEventListener('click', function () {
                const formId = 'delete-form-' + this.getAttribute('data-id');
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