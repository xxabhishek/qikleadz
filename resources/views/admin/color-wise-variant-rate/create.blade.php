@extends('layouts.structure')

@section('title', 'Create Country - Rocker')

@section('content')
    <div class="container">
        <div class="row justify-content-center">
            <div class="col-md-8">
                <div class="card">
                    <div class="card-header">Create Color wise Variant Wise</div>
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
                        <form method="POST" action="{{ route('color-wise-variant-rate.store') }}">
                            @csrf
                            <div class="form-group">
                                <label for="name">Select Country</label>
                                    <select name="country_id" id="country_id" class="form-control" required onchange="getBrands(this.value)">
                                        <option value="">-- Select Country --</option>
                                        @foreach ($countries as $country)
                                            <option value="{{ $country->id }}">{{ $country->name }}</option>
                                        @endforeach
                                    </select>
                            </div>
                            <div class="form-group mt-4">
                                <label for="name">Select Brand</label>
                                    <select name="brand_id" id="brand_id" class="form-control" required
                                         onchange="getVariants(this.value)">
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

                            <div class="form-group mb-3">
                                <label for="color_id">Color</label>
                                <select name="color_id" id="color_id" class="form-control" required>
                                    <option value="">-- Select Color --</option>
                                    @foreach ($colors as $color)
                                        <option value="{{ $color->id }}">{{ $color->name }}</option>
                                    @endforeach
                                </select>
                            </div>

                            <div class="form-group mb-3">
                                <label for="price">Price <span class="text-danger">*</span></label>
                                <input
                                    type="number"
                                    step="0.01"
                                    name="price"
                                    id="price"
                                    class="form-control"
                                    placeholder="Enter price"
                                    required
                                >
                            </div>


                            <div class="mb-3">
    <label class="form-label">Tax</label>
    <input type="number" name="tax" class="form-control"
           value="{{ old('tax') }}" placeholder="Enter tax">
</div>

<div class="mb-3">
    <label class="form-label">Other</label>
    <input type="number" name="other" class="form-control"
           value="{{ old('other') }}" placeholder="Enter other charges">
</div>



                            <button type="submit" class="btn btn-primary mt-3">Submit</button>
                            <a href="{{ route('color-wise-variant-rate.index') }}" class="btn btn-secondary mt-3">Back</a>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <script>
                function getBrands(country_id) {
            //alert(category_id);
            var url = '{{ route("getByCountrySelectBrand", [':country_id']) }}';
            url = url.replace(':country_id', country_id);

            if (country_id) {
                $.ajax({
                    url: url,
                    type: "GET",
                    dataType: "json",

                    success: function (data) {
                        $('select[name="brand_id"]').empty();
                        $('select[name="brand_id"]').prepend('<option value="">--Select Brand Brand--</option>');
                        $.each(data, function (key, value) {
                            $('select[name="brand_id"]').append('<option value="' + key + '">' + value + '</option>');
                        });
                    }
                });
            } else {
                $('select[name="brand_id"]').empty();
            }
        }

                function getVariants(brand_id) {
            var url = '{{ route("getByBrandSelectVariant", [":brand_id"]) }}';
            url = url.replace(':brand_id', brand_id);

            if (brand_id) {
                $.ajax({
                    url: url,
                    type: "GET",
                    dataType: "json",
                    success: function (data) {
                        $('select[name="variant_id"]').empty();
                        $('select[name="variant_id"]').prepend('<option value="">-- Select Variant --</option>');
                        $.each(data, function (key, value) {
                            $('select[name="variant_id"]').append('<option value="' + key + '">' + value + '</option>');
                        });
                    },
                    error: function (xhr, status, error) {
                        console.error('Error fetching variants:', error);
                    }
                });
            } else {
                $('select[name="variant_id"]').empty();
                $('select[name="variant_id"]').prepend('<option value="">-- Select Variant --</option>');
            }
        }


        </script>
@endsection
