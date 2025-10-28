@extends('layouts.structure')

@section('title', 'TechSpec - Rocker')

@section('content')
<div class="container">
    <div class="row justify-content-center">
        <div class="col-md-10">
            <div class="card">
                <div class="card-header d-flex justify-content-between align-items-center">
                    <span>Tech Spec List</span>
                    <a href="{{ route('tech-spec.create') }}" class="btn btn-primary btn-sm">+ Add Tech Specification</a>
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
                                <!-- <th>TechSpec (Title & Description)</th> -->
                                <th>Created At</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            @forelse($techSpecs as $group)
                                @php
                                    $first = $group->first();
                                @endphp
                                @if($first) {{-- Make sure first exists --}}
                                <tr>
                                    <td>{{ $loop->iteration }}</td>
                                    <td>{{ optional($first->brand)->name ?? '-' }}</td>
                                    <td>{{ optional($first->variant)->name ?? '-' }}</td>
                                    <!-- <td>
                                        <ul>
                                            @foreach($group as $feature)
                                                <li>
                                                    <strong>{{ $feature->title }}</strong><br>
                                                    {!! $feature->description !!}
                                                </li>
                                            @endforeach
                                        </ul>
                                    </td> -->
                                    <td>{{ $first->created_at ? $first->created_at->format('d-m-Y') : '-' }}</td>
                                    <td>
                                        {{-- Edit/Delete the first feature of the group --}}
                                        <a href="{{ route('tech-spec.edit', $first->id) }}" class="btn btn-sm btn-warning">Edit</a>
                                        <a href="{{ route('tech-spec.show', $first->id) }}" class="btn btn-sm btn-info">Show</a>

                                        <form action="{{ route('tech-spec.destroy', $first->id) }}" method="POST" class="d-inline">
                                            @csrf
                                            @method('DELETE')
                                            <button type="submit" onclick="return confirm('Are you sure you want to delete this TechSpec?')" class="btn btn-sm btn-danger">
                                                Delete
                                            </button>
                                        </form>
                                    </td>
                                </tr>
                                @endif
                            @empty
                                <tr>
                                    <td colspan="6" class="text-center">No TechSpec Found</td>
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
