@extends('layouts.structure')

@section('title', 'Create Variant - Rocker')

@section('content')

    <style>
        .color-options-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
            gap: 12px;
        }

        .color-item {
            display: flex;
            align-items: center;
            gap: 8px;
            padding: 8px 10px;
            cursor: pointer;
            border-radius: 6px;
            background-color: #fff;
            border: 1px solid #ddd;
            transition: border 0.2s, box-shadow 0.2s;
        }

        .color-item input {
            display: none;
        }

        .color-circle {
            width: 30px;
            height: 30px;
            background-color: #fff;
            /* white outer circle */
            border: 2px solid #ccc;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .inner-color {
            width: 18px;
            height: 18px;
            border-radius: 50%;
        }

        .color-name {
            font-size: 0.9rem;
            color: #333;
        }

        /* Selected state */
        .color-item input[type="checkbox"]:checked+.color-circle {
            border: 3px solid #000;
            transform: scale(1.1);
        }
    </style>

    <div class="container">
        <div class="row justify-content-center">
            <div class="col-md-11">
                <div class="card">
                    <div class="card-header">Create Variant</div>
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

                        <form method="POST" action="{{ route('variants.store') }}" enctype="multipart/form-data">
                            @csrf
                            <div class="row">
                                <!-- Name -->
                                <div class="col-md-6 mb-3">
                                    <label for="name">Name</label>
                                    <input type="text" name="name" id="name" class="form-control" required>
                                </div>

                                <!-- Country -->
                                <div class="col-md-6 mb-3">
                                    <label for="country_id">Country</label>
                                    <select name="country_id" id="country_id" class="form-control" required
                                        onchange="getBrands(this.value)">
                                        <option value="">Select Country</option>
                                        @foreach ($countries as $country)
                                            <option value="{{ $country->id }}">{{ $country->name }}</option>
                                        @endforeach
                                    </select>
                                </div>

                                <!-- Brand -->
                                <div class="col-md-6 mb-3">
                                    <label for="brand_id">Brand</label>
                                    <select name="brand_id" id="brand_id" class="form-control" required>
                                        <option value="">Select Brand</option>
                                        @foreach ($brands as $brand)
                                            <option value="{{ $brand->id }}">{{ $brand->name }}</option>
                                        @endforeach
                                    </select>
                                </div>

                                <!-- Vehicle Usage -->
                                <div class="col-md-6 mb-3">
                                    <label for="vehicle_usage_id">Vehicle Usage</label>
                                    <select name="vehicle_usage_id" id="vehicle_usage_id" class="form-control" required>
                                        <option value="">Select Vehicle Usage</option>
                                        @foreach ($vehicleUsages as $VU)
                                            <option value="{{ $VU->id }}">{{ $VU->name }}</option>
                                        @endforeach
                                    </select>
                                </div>

                                <!-- Transmission -->
                                <div class="col-md-6 mb-3">
                                    <label for="transmission_id">Transmission</label>
                                    <select name="transmission_id" id="transmission_id" class="form-control" required>
                                        <option value="">Select Transmission</option>
                                        @foreach ($transmissions as $transmission)
                                            <option value="{{ $transmission->id }}">{{ $transmission->name }}</option>
                                        @endforeach
                                    </select>
                                </div>

                                <!-- CC -->
                                <div class="col-md-6 mb-3">
                                    <label for="cc_id">CC</label>
                                    <select name="cc_id" id="cc_id" class="form-control" required>
                                        <option value="">Select CC</option>
                                        @foreach ($ccs as $cc)
                                            <option value="{{ $cc->id }}">{{ $cc->name }}</option>
                                        @endforeach
                                    </select>
                                </div>

                                <!-- Fuel Type -->
                                <div class="col-md-6 mb-3">
                                    <label for="fuel_type_id">Fuel Type</label>
                                    <select name="fuel_type_id" id="fuel_type_id" class="form-control" required>
                                        <option value="">Select Fuel Type</option>
                                        @foreach ($fuelTypes as $fuelType)
                                            <option value="{{ $fuelType->id }}">{{ $fuelType->name }}</option>
                                        @endforeach
                                    </select>
                                </div>

                                <!-- Color -->
                                <div class="col-md-12 mb-3">
                                    <label>Select Color</label>
                                    <div class="color-options-grid">
                                        @foreach ($colors as $color)
                                            <label class="color-item">
                                                <input type="checkbox" name="color_id[]" value="{{ $color->id }}">
                                                <span class="color-circle">
                                                    <span class="inner-color"
                                                        style="background-color: {{ $color->color_code ?? '#000' }}"></span>
                                                </span>
                                                <span class="color-name">{{ $color->name }}</span>
                                            </label>
                                        @endforeach
                                    </div>
                                </div>


                                <!-- Basic Price -->
                                <div class="col-md-6 mb-3">
                                    <label for="basic_price">Basic Price</label>
                                    <input type="text" name="basic_price" id="basic_price" class="form-control" required
                                        step="1" min="0">
                                </div>

                                <!-- Commission -->
                                <div class="col-md-6 mb-3">
                                    <label for="commission">Commission</label>
                                    <input type="text" name="commission" id="commission" class="form-control" required
                                        step="1" min="0">
                                </div>

                                <!-- Brochure -->
                                <div class="col-md-12 mb-3">
                                    <label for="brochure">Upload Brochure (PDF only, max 2MB)</label>
                                    <input type="file" name="brochure" id="brochure" class="form-control"
                                        accept="application/pdf">
                                    <small class="form-text text-muted">Allowed: PDF | Max size: 2MB</small>
                                    <div id="preview" class="mt-3"></div>
                                </div>
                            </div>

                            <!-- Buttons -->
                            <div class="mt-3">
                                <button type="submit" class="btn btn-primary">Submit</button>
                                <a href="{{ route('variants.index') }}" class="btn btn-secondary">Back</a>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <script>
        document.getElementById('brochure').addEventListener('change', function (event) {
            let file = event.target.files[0];
            let preview = document.getElementById('preview');
            preview.innerHTML = "";

            if (file) {
                if (file.type === "application/pdf") {
                    let embed = document.createElement("embed");
                    embed.src = URL.createObjectURL(file);
                    embed.type = "application/pdf";
                    embed.width = "100%";
                    embed.height = "400px";
                    preview.appendChild(embed);
                } else {
                    preview.innerHTML = "<p class='text-danger'>Only PDF files are allowed.</p>";
                }
            }
        });
    </script>

    <script>
        document.querySelectorAll('.only-numbers').forEach(input => {
            input.addEventListener('input', function () {
                this.value = this.value.replace(/[^0-9]/g, '');
            });
        });
    </script>

    <script type="text/javascript">
        function getBrands(country_id) {
            var url = '{{ route('getByCountrySelectBrand', [':country_id']) }}';
            url = url.replace(':country_id', country_id);

            if (country_id) {
                $.ajax({
                    url: url,
                    type: "GET",
                    dataType: "json",
                    success: function (data) {
                        $('select[name="brand_id"]').empty();
                        $('select[name="brand_id"]').prepend('<option value="">--Select Brand--</option>');
                        $.each(data, function (key, value) {
                            $('select[name="brand_id"]').append('<option value="' + key + '">' + value +
                                '</option>');
                        });
                    }
                });
            } else {
                $('select[name="brand_id"]').empty();
            }
        }
    </script>
@endsection