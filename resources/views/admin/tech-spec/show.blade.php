@extends('layouts.structure')

@section('title', 'Feature Details - Qikleadz')

@section('content')
    <div class="container">
        <div class="row justify-content-center">
            <div class="col-md-10">
                <div class="card">
                    <div class="card-header d-flex justify-content-between align-items-center">
                        <h5>Tech Specification Details</h5>
                        <a href="{{ route('tech-spec.index') }}" class="btn btn-secondary btn-sm">Back</a>
                    </div>
                    <div class="card-body">
                        {{-- Brand & Variant --}}
                        <div class="mb-3">
                            <strong>Brand:</strong> {{ $brand->name ?? 'N/A' }} <br>
                            <strong>Variant:</strong> {{ $variant->name ?? 'N/A' }}
                        </div>

                        {{-- Panels Table --}}
                        <h6 class="mt-4">Admin Panel Descriptions</h6>
                        <table class="table table-bordered table-striped">
                            <thead>
                                <tr>
                                    <th>Sr.No</th>
                                    <th>Title</th>
                                    <th>Description</th>
                                </tr>
                            </thead>
                            <tbody>
                                @foreach ($techSpecs as $index => $feature)
                                    <tr>
                                        <td>{{ $index + 1 }}</td>
                                        <td>{{ $feature->title }}</td>
                                        <td>{!! $feature->description !!}</td>
                                    </tr>
                                @endforeach
                            </tbody>
                        </table>

                        @if($techSpecs->isEmpty())
                            <p class="text-muted">No panels found for this feature.</p>
                        @endif
                    </div>
                </div>
            </div>
        </div>
    </div>
@endsection