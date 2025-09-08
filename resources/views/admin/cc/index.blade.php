@extends('layouts.structure')

@section('title', 'CC - Rocker')

@section('content')
    <div class="container">
        <div class="row justify-content-center">
            <div class="col-md-10">
                <div class="card">
                    <div class="card-header d-flex justify-content-between align-items-center">
                        <span>CC List</span>
                        <a href="{{ route('cc.create') }}" class="btn btn-primary btn-sm">+ Add CC</a>
                    </div>
                    <div class="card-body">
                        @if (session('success'))
                            <div class="alert alert-success">{{ session('success') }}</div>
                        @endif

                        <table class="table table-bordered table-striped">
                            <thead>
                                <tr>
                                    <th>Sr.No.</th>
                                    <th>CC Name</th>
                                    <th>Created At</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                @forelse($ccs as $cc)
                                    <tr>
                                        <td>{{ $loop->iteration }}</td>
                                        <td>{{ $cc->name }}</td>
                                        <td>{{ $cc->created_at->format('d-m-Y') }}</td>
                                        <td>
                                            <a href="{{ route('cc.edit', $cc->id) }}"
                                                class="btn btn-sm btn-warning">Edit</a>
                                            <form action="{{ route('cc.destroy', $cc->id) }}" method="POST"
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
                                        <td colspan="4" class="text-center">No CC Records Found</td>
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
