@extends('layouts.structure')

@section('title', 'Vehicle Configurations - Rocker')

@section('content')
    <div class="container">
        <div class="row justify-content-center">
            <div class="col-md-10">
                <div class="card">
                    <div class="card-header d-flex justify-content-between align-items-center">
                        <span>Vehicle Configuration List</span>
                        <a href="{{ route('vehicle_configs.create') }}" class="btn btn-primary btn-sm">+ Add Vehicle Config</a>
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
                                    <th>Model</th>
                                    <th>Variant</th>
                                    <th>Fuel Type</th>
                                    <th>Country</th>
                                    <th>Price</th>
                                    <th>Created At</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                @forelse($vehicleConfigs as $vehicleConfig)
                                    <tr>
                                        <td>{{ $loop->iteration }}</td>
                                        <td>{{ $vehicleConfig->model->name ?? '-' }}</td>
                                        <td>{{ $vehicleConfig->variant->name ?? '-' }}</td>
                                        <th>{{ $vehicleConfig->fuelType->name ?? '-' }}</th>
                                        <td>{{ $vehicleConfig->country->name ?? '-' }}</td>
                                        <td>{{ number_format($vehicleConfig->price, 2) }}</td>
                                        <td>{{ $vehicleConfig->created_at->format('d-m-Y') }}</td>
                                        <td>
                                            <a href="{{ route('vehicle_configs.show', $vehicleConfig->id) }}"
                                               class="btn btn-sm btn-info">View</a>
                                            <a href="{{ route('vehicle_configs.edit', $vehicleConfig->id) }}"
                                               class="btn btn-sm btn-warning">Edit</a>
                                            <form action="{{ route('vehicle_configs.destroy', $vehicleConfig->id) }}" method="POST"
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
                                        <td colspan="8" class="text-center">No Vehicle Configurations Found</td>
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
