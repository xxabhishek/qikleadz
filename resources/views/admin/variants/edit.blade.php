@extends('layouts.structure')

@section('title', 'Edit Variant - Rocker')

@section('content')
<div class="container">
    <div class="row justify-content-center">
        <div class="col-md-8">
            <div class="card">
                <div class="card-header">Edit Variant</div>
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
                    <form method="POST" action="{{ route('variants.update', $variants->id) }}"  enctype="multipart/form-data"> 
                        @csrf
                        @method('PUT')
                        <div class="form-group">
                            <label for="name">Name</label>
                            <input type="text" name="name" id="name" value="{{ $variants->name }}" class="form-control" required>
                        </div>

                                                {{-- Country --}}
                        <div class="form-group mt-4">
                            <label for="country_id">Country</label>
                            <select name="country_id" id="country_id" class="form-control" required onchange="getBrands(this.value)">
                                <option value="">Select Country</option>
                                @foreach ($countries as $country)
                                    <option value="{{ $country->id }}" {{ $variants->country_id == $country->id ? 'selected' : '' }}>
                                        {{ $country->name }}
                                    </option>
                                @endforeach
                            </select>
                        </div>

                        <div class="form-group">
                            <label for="model_id">Brand</label>
                            <select name="brand_id" id="brand_id" class="form-control" required>
                                <option value="">Select Brand</option>
                                @foreach ($brands as $brand)
                                    <option value="{{ $brand->id }}" {{ $variants->brand_id == $brand->id ? 'selected' : '' }}>{{ $brand->name }}</option>
                                @endforeach
                            </select>
                        </div>




                                                {{-- Vehicle Usage --}}
                        <div class="form-group mt-4">
                            <label for="vehicle_usage_id">Vehicle Usage</label>
                            <select name="vehicle_usage_id" id="vehicle_usage_id" class="form-control" required>
                                <option value="">Select Vehicle Usage</option>
                                @foreach ($vehicleUsages as $VU)
                                    <option value="{{ $VU->id }}" {{ $variants->vehicle_usage_id == $VU->id ? 'selected' : '' }}>
                                        {{ $VU->name }}
                                    </option>
                                @endforeach
                            </select>
                        </div>



                {{-- Transmission --}}
                        <div class="form-group mt-4">
                            <label for="transmission_id">Select Transmission</label>
                            <select name="transmission_id" id="transmission_id" class="form-control" required>
                                <option value="">Select Transmission</option>
                                @foreach ($transmissions as $transmission)
                                    <option value="{{ $transmission->id }}" {{ $variants->transmission_id == $transmission->id ? 'selected' : '' }}>
                                        {{ $transmission->name }}
                                    </option>
                                @endforeach
                            </select>
                        </div>

                        {{-- CC --}}
                        <div class="form-group mt-4">
                            <label for="cc_id">CC</label>
                            <select name="cc_id" id="cc_id" class="form-control" required>
                                <option value="">Select CC</option>
                                @foreach ($ccs as $cc)
                                    <option value="{{ $cc->id }}" {{ $variants->cc_id == $cc->id ? 'selected' : '' }}>
                                        {{ $cc->name }}
                                    </option>
                                @endforeach
                            </select>
                        </div>


                        <div class="form-group mt-4">
                            <label for="fuel_type_id">Fuel Type</label>
                            <select name="fuel_type_id" id="fuel_type_id" class="form-control" required>
                                <option value="">Select Fuel Type</option>
                                @foreach ($fuelTypes as $fuelType)
                                    <option value="{{ $fuelType->id }}" {{ $variants->fuel_type_id == $fuelType->id ? 'selected' : '' }}>
                                        {{ $fuelType->name }}
                                    </option>
                                @endforeach
                            </select>
                        </div>

                        {{-- Colors (multi-select) --}}
                        <div class="form-group mt-4">
                            <label for="color_id">Select Colors</label>
                            <select name="color_id[]" id="color_id" class="form-control" multiple required>
                                @foreach ($colors as $color)
                                    <option value="{{ $color->id }}"
                                        {{ in_array((string) $color->id, $variants->color_id_array, true) ? 'selected' : '' }}>
                                        {{ $color->name }}
                                    </option>
                                @endforeach
                            </select>
                        </div>


                        {{-- Basic Price --}}
                        <div class="form-group mt-4">
                            <label for="bacis_price">Basic Price</label>
                            <input type="text" name="basic_price" id="basic_price" value="{{ $variants->basic_price }}" class="form-control" required>
                        </div>

                        {{-- Commission --}}
                        <div class="form-group mt-4">
                            <label for="commission">Commission</label>
                            <input type="text" name="commission" id="commission" value="{{ $variants->commission }}" class="form-control" required>
                        </div>

<div class="form-group mt-4">
    <label for="brochure">Upload Brochure (PDF or Images, max 2MB)</label>
    <input type="file" name="brochure" id="brochure" class="form-control"
           accept="application/pdf,image/jpeg,image/png,image/jpg" onchange="previewBrochure(event)">

    {{-- Show existing file if available --}}
    @if(!empty($variants->brochure))
        <div class="mt-2">
            @if(Str::endsWith(strtolower($variants->brochure), ['.pdf']))
                <a href="{{ asset('uploads/brochures/'.$variants->brochure) }}" target="_blank">
                    View Current PDF
                </a>
            @else
                <img src="{{ asset('uploads/brochures/'.$variants->brochure) }}" 
                     alt="Brochure" width="120" class="img-thumbnail">
            @endif
        </div>
    @endif

    {{-- New Preview --}}
    <div id="brochurePreview" class="mt-2"></div>

    <small class="form-text text-muted">Allowed: PDF, JPG, JPEG, PNG | Max size: 2MB</small>
</div>

                        <button type="submit" class="btn btn-primary mt-3">Update</button>
                        <a href="{{ route('variants.index') }}" class="btn btn-secondary mt-3">Back</a>
                    </form>
                </div>
            </div>
        </div>
    </div>
</div>



<script>
    function previewBrochure(event) {
        let file = event.target.files[0];
        let preview = document.getElementById('brochurePreview');
        preview.innerHTML = '';

        if (!file) return;

        let fileType = file.type;

        if (fileType === 'application/pdf') {
            preview.innerHTML = `<p><strong>Selected PDF:</strong> ${file.name}</p>`;
        } else if (fileType.startsWith('image/')) {
            let img = document.createElement('img');
            img.src = URL.createObjectURL(file);
            img.width = 120;
            img.classList.add('img-thumbnail');
            preview.appendChild(img);
        } else {
            preview.innerHTML = `<p>${file.name}</p>`;
        }
    }
</script>

        <script type="text/javascript">
            function getBrands(country_id)
            {
                //alert(category_id);
                var url = '{{ route("getByCountrySelectBrand",[':country_id']) }}';
                url = url.replace(':country_id',country_id);
                 
                if(country_id) {
                    $.ajax({
                        url: url,
                        type: "GET",
                        dataType: "json",

                        success:function(data) {
                            $('select[name="brand_id"]').empty();
                            $('select[name="brand_id"]').prepend('<option value="">--Select Brand Brand--</option>');
                            $.each(data, function(key, value) {
                                $('select[name="brand_id"]').append('<option value="'+ key +'">'+ value +'</option>');
                            });
                        }
                    });
                } else{
                    $('select[name="brand_id"]').empty();
                }
            }
</script>

@endsection
