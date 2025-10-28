@extends('layouts.structure')

@section('title', 'Edit Industry Type - Rocker')

@section('content')
<div class="container">
    <div class="row justify-content-center">
        <div class="col-md-8">
            <div class="card">
                <div class="card-header">Edit Country</div>
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
                    <form method="POST" action="{{ route('vehicle-config.update', $vehicleConfigs->id) }}">
                        @csrf
                        @method('PUT')
                        <div class="form-group mb-3">
                            <label for="model_id">Model</label>
                            <select name="model_id" id="model_id" class="form-control" required>
                                <option value="">-- Select Model --</option>
                                @foreach($models as $model)
                                    <option value="{{ $model->id }}" 
                                        {{ $vehicleConfigs->model_id == $model->id ? 'selected' : '' }}>
                                        {{ $model->name }}
                                    </option>
                                @endforeach
                            </select>
                        </div>

                        <div class="form-group mb-3">
                            <label for="variant_id">Variant</label>
                            <select name="variant_id" id="variant_id" class="form-control" required>
                                <option value="">-- Select Variant --</option>
                                @foreach($variants as $variant)
                                    <option value="{{ $variant->id }}" 
                                        {{ $vehicleConfigs->variant_id == $variant->id ? 'selected' : '' }}>
                                        {{ $variant->name }}
                                    </option>
                                @endforeach
                            </select>
                        </div>

                        <div class="form-group mb-3">
                            <label for="fuel_type_id">Fuel Type</label>
                            <select name="fuel_type_id" id="fuel_type_id" class="form-control" required>
                                <option value="">-- Select Fuel Type --</option>
                                @foreach($fuelTypes as $fuelType)
                                    <option value="{{ $fuelType->id }}" 
                                        {{ $vehicleConfigs->fuel_type_id == $fuelType->id ? 'selected' : '' }}>
                                        {{ $fuelType->name }}
                                    </option>
                                @endforeach
                            </select>
                        </div>

                        <div class="form-group mb-3">
                            <label for="country_id">Country</label>
                            <select name="country_id" id="country_id" class="form-control" required>
                                <option value="">-- Select Country --</option>
                                @foreach($countries as $country)
                                    <option value="{{ $country->id }}" 
                                        {{ $vehicleConfigs->country_id == $country->id ? 'selected' : '' }}>
                                        {{ $country->name }}
                                    </option>
                                @endforeach
                            </select>
                        </div>

                        <div class="form-group">
                            <label for="price">Price</label>
                            <input type="text" name="price" id="price" value="{{ $vehicleConfigs->price }}" class="form-control" required>
                        </div>
                        
                        <button type="submit" class="btn btn-primary mt-3">Update</button>
                        <a href="{{ route('vehicle-config.index') }}" class="btn btn-secondary mt-3">Back</a>
                    </form>
                </div>
            </div>
        </div>
    </div>
</div>
@endsection