@extends('layouts.structure')

@section('title', 'Models - Rocker')

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
                                    <th>OEM</th>
                                    <th>Brand Name</th>
                                    <th>Country</th>
                                    <th>Vehicle Segment</th>
                                    <th>Vehicle Usage</th>
                                    <th>Created At</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                @forelse ($models as $model)
                                    <tr>
                                        <td>{{ $loop->iteration }}</td>
                                        <td>{{ optional($model->oem)->name ?? 'N/A' }}</td>
                                        <td>{{ $model->name }}</td>
                                        <td>{{ $model->country->name ?? '-' }}</td>
                                        <td>{{ $model->vehicleSegment->name ?? '-' }}</td>
                                        <td>{{ $model->vehicleUsage->name ?? '-' }}</td>
                                        <td>{{ $model->created_at ? $model->created_at->format('d-m-Y') : '-' }}</td>
                                        <td>
                                            <a href="{{ route('brand.edit', $model->id) }}"
                                                class="btn btn-sm btn-warning">Edit</a>
                                            <form action="{{ route('brand.destroy', $model->id) }}" method="POST"
                                                class="d-inline">
                                                @csrf
                                                @method('DELETE')
                                                <button type="submit"
                                                    onclick="return confirm('Are you sure you want to delete this model?')"
                                                    class="btn btn-sm btn-danger">
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
@endsection
