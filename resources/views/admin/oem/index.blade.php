@extends('layouts.structure')

@section('title', 'OEM - Rocker')

@section('content')
<div class="container">
    <div class="row justify-content-center">
        <div class="col-md-10">
            <div class="card">
                <div class="card-header d-flex justify-content-between align-items-center">
                    <span>OEM List</span>
                    <a href="{{ route('oem.create') }}" class="btn btn-primary btn-sm">+ Add OEM</a>
                </div>
                <div class="card-body">
                    @if (session('success'))
                        <div class="alert alert-success">{{ session('success') }}</div>
                    @endif

                    <table class="table table-bordered table-striped">
                        <thead>
                            <tr>
                                <th>Sr.No</th>
                                <th>OEM Name</th>
                                <th>Created At</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            @forelse($oems as $oem)
                                <tr>
                                    <td>{{ $loop->iteration }}</td>
                                    <td>{{ $oem->name }}</td>
                                    <td>{{ $oem->created_at ? $oem->created_at->format('d-m-Y') : '-' }}</td>
                                    <td>
                                        <a href="{{ route('oem.edit', $oem->id) }}" class="btn btn-sm btn-warning">Edit</a>
                                        <form action="{{ route('oem.destroy', $oem->id) }}" method="POST" class="d-inline">
                                            @csrf
                                            @method('DELETE')
                                            <button type="submit" onclick="return confirm('Are you sure?')" class="btn btn-sm btn-danger">
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
