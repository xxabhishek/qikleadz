@extends('layouts.structure')

@section('title', 'States - Rocker')

@section('content')
    <div class="container">
        <div class="row justify-content-center">
            <div class="col-md-10">
                <div class="card">
                    <div class="card-header d-flex justify-content-between align-items-center">
                        <span>State List</span>
                        <a href="{{ route('state.create') }}" class="btn btn-primary btn-sm">+ Add State</a>
                    </div>
                    <div class="card-body">
                        @if (session('success'))
                            <div class="alert alert-success">{{ session('success') }}</div>
                        @endif

                        <table class="table table-bordered table-striped">
                            <thead>
                                <tr>
                                    <th>Sr.No</th>
                                    <th>State Name</th>
                                    <th>Country</th>
                                    <th>Created At</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                @forelse($states as $state)
                                    <tr>
                                        <td>{{ $loop->iteration }}</td>
                                        <td>{{ $state->name }}</td>
                                        <td>{{ $state->country->name ?? '-' }}</td>
                                        <td>{{ $state->created_at->format('d-m-Y') }}</td>
                                        <td>
                                            <a href="{{ route('state.edit', $state->id) }}"
                                                class="btn btn-sm btn-warning">Edit</a>
                                            <form action="{{ route('state.destroy', $state->id) }}" method="POST"
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
                                        <td colspan="5" class="text-center">No States Found</td>
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
