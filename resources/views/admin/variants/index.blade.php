@extends('layouts.structure')

@section('title', 'Variants - Rocker')

@section('content')
    <div class="container">
        <div class="row justify-content-center">
            <div class="col-md-10">
                <div class="card">
                    <div class="card-header d-flex justify-content-between align-items-center">
                        <span>Variant List</span>
                        <a href="{{ route('variants.create') }}" class="btn btn-primary btn-sm">+ Add Variant</a>
                    </div>
                    <div class="card-body">
                        @if (session('success'))
                            <div class="alert alert-success">{{ session('success') }}</div>
                        @endif

                        <table class="table table-bordered table-striped">
                            <thead>
                                <tr>
                                    <th>Sr.No</th>
                                    <th>Variant Name</th>
                                    <th>Brand</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                @forelse($variants as $variant)
                                    <tr>
                                        <td>{{ $loop->iteration }}</td>
                                        <td>{{ $variant->name }}</td>
                                        <td>{{ $variant->brand->name ?? 'N/A' }}</td>
                                        <td>
                                            <a href="{{ route('variants.edit', $variant->id) }}"
                                                class="btn btn-sm btn-warning">Edit</a>
                                            <a href="{{ route('variants.show', $variant->id) }}"
                                                class="btn btn-sm btn-info">Show</a>
                                            <form action="{{ route('variants.destroy', $variant->id) }}" method="POST"
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
                                        <td colspan="4" class="text-center">No Variants Found</td>
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
