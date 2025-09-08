@extends('layouts.structure')

@section('title', 'Create Gallery - Rocker')

@section('content')
    <div class="container">
        <div class="row justify-content-center">
            <div class="col-md-10">
                <div class="card">
                    <div class="card-header">+ Add Gallery</div>
                    <div class="card-body">

                        {{-- Error Messages --}}
                        @if ($errors->any())
                            <div class="alert alert-danger">
                                <ul>
                                    @foreach ($errors->all() as $error)
                                        <li>{{ $error }}</li>
                                    @endforeach
                                </ul>
                            </div>
                        @endif

                        {{-- Form --}}
                        <form action="{{ route('galleries.store') }}" method="POST" enctype="multipart/form-data">
                            @csrf

                            {{-- Cover Photo --}}
                            <div class="form-group mb-3">
                                <label for="cover_photo">Cover Photo (Image/Video)</label>
                                <input type="file" name="cover_photo" id="cover_photo" class="form-control" required>
                            </div>

                            {{-- Brand --}}
                            <div class="form-group mb-3">
                                <label for="brand_id">Brand</label>
                                <select name="brand_id" id="brand_id" class="form-control" required>
                                    <option value="">-- Select Brand --</option>
                                    @foreach ($brands as $brand)
                                        <option value="{{ $brand->id }}">{{ $brand->name }}</option>
                                    @endforeach
                                </select>
                            </div>

                            {{-- Variant --}}
                            <div class="form-group mb-3">
                                <label for="variant_id">Variant</label>
                                <select name="variant_id" id="variant_id" class="form-control" required>
                                    <option value="">-- Select Variant --</option>
                                    @foreach ($variants as $variant)
                                        <option value="{{ $variant->id }}">{{ $variant->name }}</option>
                                    @endforeach
                                </select>
                            </div>

                            {{-- Color --}}
                            <div class="form-group mb-3">
                                <label for="color_id">Color</label>
                                <select name="color_id" id="color_id" class="form-control" required>
                                    <option value="">-- Select Color --</option>
                                    @foreach ($colors as $color)
                                        <option value="{{ $color->id }}">{{ $color->name }}</option>
                                    @endforeach
                                </select>
                            </div>

                            {{-- Fuel Type --}}
                            <div class="form-group mb-3">
                                <label for="fuel_type_id">Fuel Type</label>
                                <select name="fuel_type_id" id="fuel_type_id" class="form-control" required>
                                    <option value="">-- Select Fuel Type --</option>
                                    @foreach ($fuelTypes as $fuel)
                                        <option value="{{ $fuel->id }}">{{ $fuel->name }}</option>
                                    @endforeach
                                </select>
                            </div>

                            <button type="submit" class="btn btn-primary">Save</button>
                            <a href="{{ route('galleries.index') }}" class="btn btn-secondary">Back</a>
                        </form>

                    </div>
                </div>
            </div>
        </div>
    </div>
@endsection
