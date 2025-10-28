@extends('layouts.structure')

@section('title', 'Feature - Rocker')

@section('content')
<div class="container">
    <div class="row justify-content-center">
        <div class="col-md-10">
            <div class="card">
                <div class="card-header d-flex justify-content-between align-items-center">
                    <span>Feature List</span>
                    <a href="{{ route('feature.create') }}" class="btn btn-primary btn-sm">+ Add Feature</a>
                </div>
                <div class="card-body">
                    @if (session('success'))
                        <div class="alert alert-success">{{ session('success') }}</div>
                    @endif

<table class="table table-bordered table-striped">
    <thead>
        <tr>
            <th>Sr.No</th>
            <th>Brand</th>
            <th>Variant</th>
            <th>Features (Title & Description)</th>
            <th>Created At</th>
            <th>Actions</th>
        </tr>
    </thead>
    <tbody>
        @forelse($features as $group)
            @php
                $first = $group->first();
            @endphp
            <tr>
                <td>{{ $loop->iteration }}</td>
                <td>{{ $first->brand->name ?? '-' }}</td>
                <td>{{ $first->variant->name ?? '-' }}</td>
                <td>
                    <ul>
                        @foreach($group as $feature)
                            <li>
                                <strong>{{ $feature->title }}</strong><br>
                                {!! $feature->description !!}
                            </li>
                        @endforeach
                    </ul>
                </td>
                <td>{{ $first->created_at ? $first->created_at->format('d-m-Y') : '-' }}</td>
                <td>
                    {{-- Edit the first feature of the group --}}
                    <a href="{{ route('feature.edit', $first->id) }}" class="btn btn-sm btn-warning">Edit</a>
                    <a href="{{ route('feature.show', $first->id) }}" class="btn btn-sm btn-warning">Show</a>

                    <form action="{{ route('feature.destroy', $first->id) }}" method="POST" class="d-inline">
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
                <td colspan="6" class="text-center">No Features Found</td>
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
