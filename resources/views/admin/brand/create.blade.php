@extends('layouts.structure')

@section('title', 'Create Brand - QikLeadz')

@section('content')
    <div class="container">
        <div class="row justify-content-center">
            <div class="col-md-8">
                <div class="card">
                    <div class="card-header">Create Brand</div>
                    <div class="card-body">
                        @if ($errors->any())
                            <div class="alert alert-danger">
                                <ul>
                                    @foreach ($errors->all() as $error)
                                        <li>{{ $error }}</li>
                                    @endforeach
                                </ul>
                            </div>
                        @endif

                        <form method="POST" action="{{ route('brand.store') }}">
                            @csrf

                            {{-- Country --}}
                            <div class="form-group mb-3">
                                <label for="country_id">Country</label>
                                <select name="country_id" id="country_id" class="form-control" required>
                                    <option value="">-- Select Country --</option>
                                    @foreach ($countries as $country)
                                        <option value="{{ $country->id }}">{{ $country->name }}</option>
                                    @endforeach
                                </select>
                            </div>

                            {{-- Vehicle Type --}}
                            <div class="form-group mb-3">
                                <label for="vehicle-segment">Vehicle Segment</label>
                                <select name="vehicle-segment" id="vehicle-segment" class="form-control" required>
                                    <option value="">-- Select Vehicle Type --</option>
                                    @foreach ($vehicleTypes as $vehicle)
                                        <option value="{{ $vehicle->id }}">{{ $vehicle->name }}</option>
                                    @endforeach
                                </select>
                            </div>

                            {{-- Industry Type --}}
                            <div class="form-group mb-3">
                                <label for="vehicle-usage">Vehicle Usage</label>
                                <select name="vehicle-usage" id="vehicle-usage" class="form-control" required>
                                    <option value="">-- Select Industry Type --</option>
                                    @foreach ($industryTypes as $industry)
                                        <option value="{{ $industry->id }}">{{ $industry->name }}</option>
                                    @endforeach
                                </select>
                            </div>

                            {{-- Brand Name --}}
                            <div class="form-group mb-3">
                                <label for="name">Brand Name</label>
                                <input type="text" name="name" id="name" class="form-control"
                                    placeholder="Enter Brand Name" required>
                            </div>

                            <button type="submit" class="btn btn-primary">Submit</button>
                            <a href="{{ route('brand.index') }}" class="btn btn-secondary">Back</a>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
@endsection
