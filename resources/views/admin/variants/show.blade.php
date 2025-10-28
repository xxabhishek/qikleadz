@extends('layouts.structure')

@section('title', 'View Variant - Rocker')

@section('content')
    <div class="container">
        <div class="row justify-content-center">
            <div class="col-md-10">
                <div class="card">
                    <div class="card-header d-flex justify-content-between align-items-center">
                        <span>Variant Details</span>
                        <a href="{{ route('variants.index') }}" class="btn btn-secondary btn-sm">Back</a>
                    </div>
                    <div class="card-body">

                        {{-- General Info --}}
                        <h5 class="mb-3">General Information</h5>
                        <table class="table table-bordered">
                            <tr>
                                <th>Name</th>
                                <td>{{ $variant->name }}</td>
                            </tr>
                            <tr>
                                <th>Brand</th>
                                <td>{{ $variant->brand_id ? $variant->brand->name : 'N/A' }}</td>
                            </tr>
                            <tr>
                                <th>Country</th>
                                <td>{{ $variant->country_id ? $variant->country->name : 'N/A' }}</td>
                            </tr>
                        </table>

                        {{-- Specifications --}}
                        <h5 class="mb-3 mt-4">Specifications</h5>
                        <table class="table table-bordered">
                            <tr>
                                <th>Fuel Type</th>
                                <td>{{ $variant->fuel_type_id ? $variant->fuelType->name : 'N/A' }}</td>
                            </tr>
                            <tr>
                                <th>Transmission</th>
                                <td>{{ $variant->transmission_id ? $variant->transmission->name : 'N/A' }}</td>
                            </tr>
                            <tr>
                                <th>CC</th>
                                <td>{{ $variant->cc_id ? $variant->cc->name : 'N/A' }}</td>
                            </tr>
                            <tr>
                                <th>Vehicle Usage</th>
                                <td>{{ $variant->vehicle_usage_id ? $variant->vehicleUsage->name : 'N/A' }}</td>
                            </tr>
                            <tr>
                                <th>Colors</th>
                                <td>
                                    @if (!empty($variant->colorNames))
                                        @foreach ($variant->colorNames as $color)
                                            <span class="badge bg-info">{{ $color }}</span>
                                        @endforeach
                                    @else
                                        N/A
                                    @endif
                                </td>
                            </tr>
                        </table>

                        {{-- Pricing --}}
                        <h5 class="mb-3 mt-4">Pricing</h5>
                        <table class="table table-bordered">
                            <tr>
                                <th>Basic Price</th>
                                <td>{{ $variant->basic_price ?? 'N/A' }}</td>
                            </tr>
                            <tr>
                                <th>Commission</th>
                                <td>{{ $variant->commission ?? 'N/A' }}</td>
                            </tr>
                        </table>

                        {{-- Brochure --}}
                        <h5 class="mb-3 mt-4">Brochure</h5>
                        <table class="table table-bordered">
                            <tr>
                                <td>
                                    @if ($variant->brochure && file_exists(public_path('uploads/brochures/' . $variant->brochure)))
                                        <a href="{{ asset('uploads/brochures/' . $variant->brochure) }}" target="_blank">
                                            @if (in_array(pathinfo($variant->brochure, PATHINFO_EXTENSION), ['jpg', 'jpeg', 'png', 'gif']))
                                                <img src="{{ asset('uploads/brochures/' . $variant->brochure) }}"
                                                    alt="Brochure" style="max-width:150px; max-height:150px;">
                                            @else
                                                View Brochure
                                            @endif
                                        </a>
                                    @else
                                        N/A
                                    @endif
                                </td>
                            </tr>
                        </table>

                        {{-- Timestamps --}}
                        <h5 class="mb-3 mt-4">Timestamps</h5>
                        <table class="table table-bordered">
                            <tr>
                                <th>Created At</th>
                                <td>{{ $variant->created_at }}</td>
                            </tr>
                            <tr>
                                <th>Updated At</th>
                                <td>{{ $variant->updated_at }}</td>
                            </tr>

                        </table>

                        {{-- Actions --}}
                        <div class="mt-3">
                            <a href="{{ route('variants.edit', $variant->id) }}" class="btn btn-warning">Edit</a>
                            <form action="{{ route('variants.destroy', $variant->id) }}" method="POST" class="d-inline">
                                @csrf
                                @method('DELETE')
                                <button type="submit" onclick="return confirm('Are you sure?')"
                                    class="btn btn-danger">Delete</button>
                            </form>
                            <a href="{{ route('variants.index') }}" class="btn btn-secondary">Back to List</a>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    </div>
@endsection
