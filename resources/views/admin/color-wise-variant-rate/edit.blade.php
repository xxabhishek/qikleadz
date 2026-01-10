@extends('layouts.structure')

@section('title', 'Edit Color Wise Variant Rate')

@section('content')
<div class="container">
    <div class="row justify-content-center">
        <div class="col-md-8">

            <div class="card">
                <div class="card-header">Edit Color Wise Variant Rate</div>

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

                    <form method="POST" action="{{ route('color-wise-variant-rate.update', $rate->id) }}">
                        @csrf
                        @method('PUT')

                        {{-- Country --}}
                        <div class="form-group mb-3">
                            <label>Select Country</label>
                            <select name="country_id" class="form-control" required>
                                <option value="">-- Select Country --</option>
                                @foreach ($countries as $country)
                                    <option value="{{ $country->id }}"
                                        {{ $rate->country_id == $country->id ? 'selected' : '' }}>
                                        {{ $country->name }}
                                    </option>
                                @endforeach
                            </select>
                        </div>

                        {{-- Brand --}}
                        <div class="form-group mb-3">
                            <label>Select Brand</label>
                            <select name="brand_id" class="form-control" required>
                                <option value="">-- Select Brand --</option>
                                @foreach ($brands as $brand)
                                    <option value="{{ $brand->id }}"
                                        {{ $rate->brand_id == $brand->id ? 'selected' : '' }}>
                                        {{ $brand->name }}
                                    </option>
                                @endforeach
                            </select>
                        </div>

                        {{-- Variant --}}
                        <div class="form-group mb-3">
                            <label>Select Variant</label>
                            <select name="variant_id" class="form-control" required>
                                <option value="">-- Select Variant --</option>
                                @foreach ($variants as $variant)
                                    <option value="{{ $variant->id }}"
                                        {{ $rate->variant_id == $variant->id ? 'selected' : '' }}>
                                        {{ $variant->name }}
                                    </option>
                                @endforeach
                            </select>
                        </div>

                        {{-- Color --}}
                        <div class="form-group mb-3">
                            <label>Select Color</label>
                            <select name="color_id" class="form-control" required>
                                <option value="">-- Select Color --</option>
                                @foreach ($colors as $color)
                                    <option value="{{ $color->id }}"
                                        {{ $rate->color_id == $color->id ? 'selected' : '' }}>
                                        {{ $color->name }}
                                    </option>
                                @endforeach
                            </select>
                        </div>

                        {{-- Price --}}
                        <div class="form-group mb-3">
                            <label>Price <span class="text-danger">*</span></label>
                            <input type="number" step="0.01" name="price"
                                   class="form-control" required
                                   value="{{ $rate->price }}">
                        </div>
                        <div class="mb-3">
    <label class="form-label">Tax</label>
    <input type="number" name="tax" class="form-control"
           value="{{ old('tax', $rate->tax) }}">
</div>

<div class="mb-3">
    <label class="form-label">Other</label>
    <input type="number" name="other" class="form-control"
           value="{{ old('other', $rate->other) }}">
</div>

                        <button type="submit" class="btn btn-primary mt-3">Update</button>
                        <a href="{{ route('color-wise-variant-rate.index') }}" class="btn btn-secondary mt-3">
                            Back
                        </a>

                    </form>

                </div>
            </div>

        </div>
    </div>
</div>
@endsection
