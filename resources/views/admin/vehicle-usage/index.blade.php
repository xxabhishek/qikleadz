@extends('layouts.structure')

@section('title', 'Industry Types - Rocker')

@section('content')
    <div class="container">
        <div class="row justify-content-center">
            <div class="col-md-10">
                <div class="card">
                    <div class="card-header d-flex justify-content-between align-items-center">
                        <span>Vehicle Usages</span>
                        <a href="{{ route('vehicle-usage.create') }}" class="btn btn-primary btn-sm">+ Add Vehicle Usege</a>
                    </div>

                    <div class="card-body">
                        {{-- Success message --}}
                        @if (session('success'))
                            <div class="alert alert-success">{{ session('success') }}</div>
                        @endif

                        <table class="table table-bordered table-striped">
                            <thead>
                                <tr>
                                    <th>Sr.No</th>
                                    <th>Vehicle Usage</th>
                                    <th>Country</th>
                                    <th>Created At</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                @forelse ($industryTypes as $industryType)
                                    <tr>
                                        <td>{{ $loop->iteration }}</td>
                                        <td>{{ $industryType->name }}</td>
                                        <td>{{ $industryType->country->name ?? '-' }}</td>
                                        <td>{{ $industryType->created_at ? $industryType->created_at->format('d-m-Y') : '-' }}
                                        </td>
                                        <td>
                                            <a href="{{ route('vehicle-usage.edit', $industryType->id) }}"
                                                class="btn btn-warning btn-sm">Edit</a>

                                            <form action="{{ route('vehicle-usage.destroy', $industryType->id) }}"
                                                method="POST" class="d-inline" id="delete-form-{{ $industryType->id }}">
                                                @csrf
                                                @method('DELETE')
                                                <button type="button" class="btn btn-danger btn-sm delete-btn"
                                                    data-id="{{ $industryType->id }}">
                                                    Delete
                                                </button>
                                            </form>
                                        </td>
                                    </tr>
                                @empty
                                    <tr>
                                        <td colspan="5" class="text-center">No Vehicle Usages Found</td>
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
            button.addEventListener('click', function() {
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
