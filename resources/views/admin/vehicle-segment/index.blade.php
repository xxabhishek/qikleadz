@extends('layouts.structure')

@section('title', 'Vehicle Types - Rocker')

@section('content')
    <div class="container">
        <div class="row justify-content-center">
            <div class="col-md-10">
                <div class="card">
                    <div class="card-header d-flex justify-content-between align-items-center">
                        <span>Vehicle Segment List</span>
                        <a href="{{ route('vehicle-segment.create') }}" class="btn btn-primary btn-sm">+ Add Vehicle Segment</a>
                    </div>
                    <div class="card-body">
                        @if (session('success'))
                            <div class="alert alert-success">{{ session('success') }}</div>
                        @endif

                        <table class="table table-bordered table-striped">
                            <thead>
                                <tr>
                                    <th>Sr.No</th>
                                    <th>Vehicle Segment</th>
                                    <th>Country</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                @forelse($vehicleTypes as $vehicleType)
                                    <tr>
                                        <td>{{ $loop->iteration }}</td>
                                        <td>{{ $vehicleType->name }}</td>
                                        <td>{{ $vehicleType->country->name ?? '-' }}</td>
                                        <td>
                                            <a href="{{ route('vehicle-segment.edit', $vehicleType->id) }}"
                                                class="btn btn-sm btn-warning">Edit</a>
                                            <form action="{{ route('vehicle-segment.destroy', $vehicleType->id) }}"
                                                method="POST" class="d-inline">
                                                @csrf
                                                @method('DELETE')
                                                <button type="submit" onclick="return confirm('Are you sure?')"
                                                    class="btn btn-sm btn-danger">Delete</button>
                                            </form>
                                        </td>
                                    </tr>
                                @empty
                                    <tr>
                                        <td colspan="4" class="text-center">No Vehicle Types Found</td>
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
