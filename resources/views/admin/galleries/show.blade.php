@extends('layouts.app')

@section('title', 'Gallery Details')

@section('content')
    <div class="container mt-4">
        <div class="card shadow-sm">
            <div class="card-header d-flex justify-content-between align-items-center">
                <h4 class="mb-0">Gallery Details</h4>
                <a href="{{ route('galleries.index') }}" class="btn btn-secondary btn-sm">Back</a>
            </div>
            <div class="card-body">
                <div class="row">
                    <!-- Cover Photo -->
                    <div class="col-md-6 text-center mb-3">
                        @if (Str::endsWith($gallery->cover_photo, ['.mp4', '.avi', '.mov', '.mkv']))
                            <video width="100%" height="300" controls>
                                <source src="{{ asset('storage/' . $gallery->cover_photo) }}" type="video/mp4">
                                Your browser does not support the video tag.
                            </video>
                        @else
                            <img src="{{ asset('storage/' . $gallery->cover_photo) }}" alt="Cover Photo"
                                class="img-fluid rounded shadow">
                        @endif
                    </div>

                    <!-- Details -->
                    <div class="col-md-6">
                        <table class="table table-bordered">
                            <tr>
                                <th>ID</th>
                                <td>{{ $gallery->id }}</td>
                            </tr>
                            <tr>
                                <th>Brand</th>
                                <td>{{ $gallery->brand->name ?? '-' }}</td>
                            </tr>
                            <tr>
                                <th>Variant</th>
                                <td>{{ $gallery->variant->name ?? '-' }}</td>
                            </tr>
                            <tr>
                                <th>Color</th>
                                <td>{{ $gallery->color->name ?? '-' }}</td>
                            </tr>
                            <tr>
                                <th>Fuel Type</th>
                                <td>{{ $gallery->fuelType->name ?? '-' }}</td>
                            </tr>
                            <tr>
                                <th>Created At</th>
                                <td>{{ $gallery->created_at->format('d M Y H:i') }}</td>
                            </tr>
                            <tr>
                                <th>Updated At</th>
                                <td>{{ $gallery->updated_at->format('d M Y H:i') }}</td>
                            </tr>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    </div>
@endsection
