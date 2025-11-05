@extends('layouts.structure')

@section('title', 'Create Lead - Rocker')

<style>
    .gallery-card:hover {
        cursor: pointer;
        transform: scale(1.02);
        transition: transform 0.2s ease;
    }

    .gallery-card.selected {
        border: 2px solid #007bff;
        box-shadow: 0 0 10px rgba(0, 123, 255, 0.5);
    }
</style>

@section('content')
    <div class="container">
        <div class="row justify-content-center">
            <div class="col-md-12">
                <div class="card">
                    <div class="card-header">
                        <h4>New Lead Information</h4>
                    </div>
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

                        <!-- Filters -->
                        <form id="filterForm" method="GET" action="{{ route('vehiclefilterData') }}">
                            @csrf
                            <div class="container">
                                <div class="row mb-2">
                                    <div class="col-md-12">
                                        <h5 class="mb-3">Select Vehicle</h5>
                                    </div>

                                    <!-- Vehicle Segment -->
                                    <div class="col-md-3">
                                        <label for="vehicle_segment_id" class="form-label">Vehicle Segment</label>
                                        <select name="vehicle_segment_id" id="vehicle_segment_id" class="form-control">
                                            <option value="">All</option>
                                            @foreach ($vehicleSegments as $vs)
                                                <option value="{{ $vs->id }}"
                                                    {{ old('vehicle_segment_id', request('vehicle_segment_id')) == $vs->id ? 'selected' : '' }}>
                                                    {{ $vs->name }}
                                                </option>
                                            @endforeach
                                        </select>
                                    </div>

                                    <!-- Brand -->
                                    <div class="col-md-3">
                                        <label for="brand_id" class="form-label">Brand</label>
                                        <select name="brand_id" id="brand_id" class="form-control"
                                            onchange="getVariants(this.value)">
                                            <option value="">All</option>
                                            @foreach ($brands as $brand)
                                                <option value="{{ $brand->id }}"
                                                    {{ old('brand_id', request('brand_id')) == $brand->id ? 'selected' : '' }}>
                                                    {{ $brand->name }}
                                                </option>
                                            @endforeach
                                        </select>
                                    </div>

                                    <!-- Variant -->
                                    <div class="col-md-3">
                                        <label for="variant_id" class="form-label">Variant</label>
                                        <select name="variant_id" id="variant_id" class="form-control">
                                            <option value="">All</option>
                                            @foreach ($variants as $variant)
                                                <option value="{{ $variant->id }}"
                                                    {{ old('variant_id', request('variant_id')) == $variant->id ? 'selected' : '' }}>
                                                    {{ $variant->name }}
                                                </option>
                                            @endforeach
                                        </select>
                                    </div>

                                    <!-- Fuel Type -->
                                    <div class="col-md-3">
                                        <label for="fuel_type_id" class="form-label">Fuel Type</label>
                                        <select name="fuel_type_id" id="fuel_type_id" class="form-control">
                                            <option value="">All</option>
                                            @foreach ($fuelTypes as $fuelType)
                                                <option value="{{ $fuelType->id }}"
                                                    {{ old('fuel_type_id', request('fuel_type_id')) == $fuelType->id ? 'selected' : '' }}>
                                                    {{ $fuelType->name }}
                                                </option>
                                            @endforeach
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <!-- Buttons -->
                            <div class="row mt-3">
                                <div class="col-md-12 d-flex justify-content-end">
                                    <!-- <button type="reset" class="btn btn-secondary mr-2" id="resetBtn">Reset</button> -->
                                    <a href="{{ route('vehiclefilterData') }}" class="btn btn-secondary mr-2">Reset</a>

                                    <button type="submit" class="btn btn-primary">Apply Filter</button>
                                </div>
                            </div>
                        </form>

                        <!-- Results -->
                        <div class="row mt-4" id="filteredResults">
                            @if (isset($galleries) && $galleries->count() > 0)
                                @foreach ($galleries as $gallery)
                                    <div class="col-md-4 mb-4">
                                        <div class="card h-100 gallery-card" data-gallery-id="{{ $gallery->id }}">
                                            {{-- Cover Photo --}}
                                            <img src="{{ asset('uploads/coverPhotos/' . $gallery->cover_photos) }}"
                                                class="card-img-top" alt="Cover Photo"
                                                style="height: 200px; object-fit: cover;">

                                            {{-- Gallery Details --}}
                                            <div class="card-body">
                                                <h5 class="card-title">{{ $gallery->variant->name ?? 'N/A' }}</h5>
                                                <p class="card-text mb-0">
                                                    <strong>Brand:</strong> {{ $gallery->brand->name ?? 'N/A' }}<br>
                                                    <strong>Variant:</strong> {{ $gallery->variant->name ?? 'N/A' }}<br>
                                                    {{ $gallery->fuelType->name ?? 'N/A' }}<br>
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                @endforeach
                            @else
                                <div class="col-12">
                                    <p class="text-muted">No results found. Please adjust filters and try again.</p>
                                </div>
                            @endif

                            <div class="row mt-3">
                                <div class="col-md-12 d-flex justify-content-end">
                                    <a id="nextBtn" class="btn btn-primary disabled">Next -></a>
                                </div>
                            </div>
                        </div>

                        <a href="{{ route('variants.index') }}" class="btn btn-secondary mt-3">Back</a>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <script>
        const nextBtn = document.getElementById('nextBtn');
        const galleryCards = document.querySelectorAll('.gallery-card');
        let selectedGalleryId = null;

        galleryCards.forEach(card => {
            card.addEventListener('click', function() {
                // Remove 'selected' from all cards
                galleryCards.forEach(c => {
                    c.classList.remove('selected');
                    c.style.transform = 'scale(1)';
                });

                // Add 'selected' class to clicked card
                this.classList.add('selected');
                this.style.transform = 'scale(1.02)';

                // Save selected vehicle id
                selectedGalleryId = this.dataset.galleryId;
                console.log("Selected Vehicle ID:", selectedGalleryId);

                // Enable Next button
                nextBtn.classList.remove('disabled');
                nextBtn.href = `/leads/next/${selectedGalleryId}`;
            });
        });
    </script>

    <script type="text/javascript">
        function getVariants(brand_id) {
            var url = '{{ route('getByBrandSelectVariant', [':brand_id']) }}';
            url = url.replace(':brand_id', brand_id);

            if (brand_id) {
                $.ajax({
                    url: url,
                    type: "GET",
                    dataType: "json",
                    success: function(data) {
                        $('select[name="variant_id"]').empty();
                        $('select[name="variant_id"]').prepend(
                        '<option value="">-- Select Variant --</option>');
                        $.each(data, function(key, value) {
                            $('select[name="variant_id"]').append('<option value="' + key + '">' +
                                value + '</option>');
                        });
                    },
                    error: function(xhr, status, error) {
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
