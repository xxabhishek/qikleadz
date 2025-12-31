@extends('layouts.structure')

@section('title', 'Countries - Qikleadz')

@section('content')
    <div class="container">
        <div class="row justify-content-center">
            <div class="col-md-10">
                <div class="card">
                    <div class="card-header d-flex justify-content-between align-items-center">
                        <span>Country List</span>
                        <a href="{{ route('vehicle-config.create') }}" class="btn btn-primary btn-sm">+ Add Country</a>
                    </div>
                    <div class="card-body">
                        @if (session('success'))
                            <div class="alert alert-success">{{ session('success') }}</div>
                        @endif

                        <table class="table table-bordered table-striped">
                            <thead>
                                <tr>
                                    <th>Sr.No</th>
                                    <th>Country Name</th>
                                    <th>Created At</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                @forelse($vehicleConfigs as $vehicleConfig)
                                    <tr>
                                        <td>{{ $loop->iteration }}</td>
                                        <td>{{ $vehicleConfig->name }}</td>
                                        <td>{{ $vehicleConfig->created_at ? $vehicleConfig->created_at->format('d-m-Y') : '-' }}
                                        </td>
                                        <td>
                                            <a href="{{ route('vehicle-config.edit', $vehicleConfig->id) }}"
                                                class="btn btn-sm btn-warning">Edit</a>
                                            <form action="{{ route('vehicle-config.destroy', $vehicleConfig->id) }}"
                                                method="POST" class="d-inline">
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
                                        <td colspan="4" class="text-center">No Countries Found</td>
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
