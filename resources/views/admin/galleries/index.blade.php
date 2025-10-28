@extends('layouts.structure')

@section('title', 'Galleries - Rocker')

@section('content')
    <div class="container">
        <div class="row justify-content-center">
            <div class="col-md-12">
                <div class="card">
                    <div class="card-header d-flex justify-content-between align-items-center">
                        <span>Gallery List</span>
                        <a href="{{ route('galleries.create') }}" class="btn btn-primary btn-sm">+ Add Gallery</a>
                    </div>
                    <div class="card-body">
                        @if (session('success'))
                            <div class="alert alert-success">{{ session('success') }}</div>
                        @endif

                        <table class="table table-bordered table-striped">
                            <thead>
                                <tr>
                                    <th>Sr.No.</th>
                                    <th>Brand</th>
                                    <th>Variant</th>
                                    <th>Color</th>
                                    <th>Fuel Type</th>
                                    <th>Created At</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                @forelse($galleries as $gallery)
                                    <tr>
                                        <td>{{ $loop->iteration }}</td>
                                        <td>{{ $gallery->brand->name ?? '-' }}</td>
                                        <td>{{ $gallery->variant->name ?? '-' }}</td>
                                        <td>{{ $gallery->color->name ?? '-' }}</td>
                                        <td>{{ $gallery->fuelType->name ?? '-' }}</td>
                                        <td>{{ $gallery->created_at?->format('d-m-Y') }}</td>
                                        <td>
                                            <a href="{{ route('galleries.show', $gallery->id) }}"
                                                class="btn btn-sm btn-info">Show</a>
                                            <a href="{{ route('galleries.edit', $gallery->id) }}"
                                                class="btn btn-sm btn-warning">Edit</a>

                                            <form action="{{ route('galleries.destroy', $gallery->id) }}" method="POST"
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
                                        <td colspan="8" class="text-center">No Galleries Found</td>
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
