@extends('layouts.structure')

@section('title', 'Edit brand - Rocker')

@section('content')
    <div class="container">
        <div class="row justify-content-center">
            <div class="col-md-8">
                <div class="card">
                    <div class="card-header">Edit Brand</div>
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

                        <form method="POST" action="{{ route('brand.update', $modelDetail->id) }}">
                            @csrf
                            @method('PUT')



                            {{-- Country --}}
                            <div class="form-group mb-3">
                                <label for="country_id">Country</label>
                                <select name="country_id" id="country_id" class="form-control" required>
                                    @foreach ($countries as $country)
                                        <option value="{{ $country->id }}"
                                            {{ $modelDetail->country_id == $country->id ? 'selected' : '' }}>
                                            {{ $country->name }}
                                        </option>
                                    @endforeach
                                </select>
                            </div>

                            {{-- Vehicle Type --}}
                            <div class="form-group mb-3">
                                <label for="vehicle_type_id">Vehicle Type</label>
                                <select name="vehicle_type_id" id="vehicle_type_id" class="form-control" required>
                                    @foreach ($vehicleTypes as $vehicleType)
                                        <option value="{{ $vehicleType->id }}"
                                            {{ $modelDetail->vehicle_type_id == $vehicleType->id ? 'selected' : '' }}>
                                            {{ $vehicleType->name }}
                                        </option>
                                    @endforeach
                                </select>
                            </div>

                            {{-- Industry Type --}}
                            <div class="form-group mb-3">
                                <label for="industry_type_id">Industry Type</label>
                                <select name="industry_type_id" id="industry_type_id" class="form-control" required>
                                    @foreach ($industryTypes as $industryType)
                                        <option value="{{ $industryType->id }}"
                                            {{ $modelDetail->industry_type_id == $industryType->id ? 'selected' : '' }}>
                                            {{ $industryType->name }}
                                        </option>
                                    @endforeach
                                </select>
                            </div>

                            {{-- Model Name --}}
                            <div class="form-group mb-3">
                                <label for="name">Model Name</label>
                                <input type="text" name="name" id="name" value="{{ $modelDetail->name }}"
                                    class="form-control" required>
                            </div>

                            <button type="submit" class="btn btn-primary">Update</button>
                            <a href="{{ route('model.index') }}" class="btn btn-secondary">Back</a>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
@endsection
