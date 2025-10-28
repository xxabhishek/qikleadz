@extends('layouts.structure')
@section('title', 'Areas - Rocker')
@section('content')
    <div class="container">
        <div class="row justify-content-center">
            <div class="col-md-10">
                <div class="card">
                    <div class="card-header d-flex justify-content-between align-items-center">
                        <span>Area List</span>
                        <a href="{{ route('admin.areas.create') }}" class="btn btn-primary btn-sm">+ Add Area</a>
                    </div>
                    <div class="card-body">
                        @if (session('success'))
                            <div class="alert alert-success">{{ session('success') }}</div>
                        @endif
                        <table class="table table-bordered table-striped">
                            <thead>
                                <tr>
                                    <th>Sr.No.</th>
                                    <th>Area Name</th>
                                    <th>City</th>
                                    <th>State</th>
                                    <th>Country</th>
                                    <th>Created At</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                @forelse($areas as $area)
                                    <tr>
                                        <td>{{ $loop->iteration }}</td>
                                        <td>{{ $area->name }}</td>
                                        <td>{{ $area->city->name ?? '-' }}</td>
                                        <td>{{ $area->state->name ?? '-' }}</td>
                                        <td>{{ $area->country->name ?? '-' }}</td>
                                        <td>{{ $area->created_at->format('d-m-Y') }}</td>
                                        <td>
                                            <a href="{{ route('admin.areas.edit', $area->id) }}"
                                                class="btn btn-sm btn-warning">Edit</a>
                                            <form action="{{ route('admin.areas.destroy', $area->id) }}" method="POST"
                                                class="d-inline">
                                                @csrf
                                                @method('DELETE')
                                                <button type="submit" onclick="return confirm('Are you sure?')"
                                                    class="btn btn-sm btn-danger">Delete</button>
                                            </form>
                                        </td>
                                    </tr>
                                @empty
                                    <tr>
                                        <td colspan="7" class="text-center">No Areas Found</td>
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