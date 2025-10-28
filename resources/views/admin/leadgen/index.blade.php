<!DOCTYPE html>
<html>

<head>
    <title>Select Vehicle</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        .custom-scrollbar::-webkit-scrollbar {
            height: 8px;
        }

        .custom-scrollbar::-webkit-scrollbar-track {
            background: #f1f1f1;
            border-radius: 4px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb {
            background: #0f66af;
            border-radius: 4px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background: #084c8a;
        }
    </style>
</head>

<body class="bg-gray-50 min-h-screen">
    <div class="max-w-7xl mx-auto px-4 md:px-8 xl:px-12">
        <!-- Stepper -->
        {{-- @include('leadgen.partials.stepper', ['step' => 1]) --}}

        <!-- Header -->
        <div class="bg-[#0f66af] text-white rounded-t-xl px-6 py-3 mt-6 shadow-sm">
            <h3 class="text-lg font-semibold">New Lead Information</h3>
        </div>

        <div class="bg-white rounded-b-xl shadow-sm border border-gray-200 p-4 sm:p-6">
            <h4 class="mb-6 text-[#0f66af] text-xl font-semibold">Select Vehicle</h4>

            <!-- Filters -->
            <form method="GET" action="{{ route('leads.index') }}">
                <div class="bg-blue-50 p-4 rounded-lg mb-6">
                    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <!-- Vehicle Segment -->
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Vehicle Segment</label>
                            <select name="segment"
                                class="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-[#0f66af] focus:border-transparent"
                                onchange="this.form.submit()">
                                <option value="All">All</option>
                                @foreach ($segments as $segment)
                                    <option value="{{ $segment->id }}"
                                        {{ $filters['segment'] == $segment->id ? 'selected' : '' }}>{{ $segment->name }}
                                    </option>
                                @endforeach
                            </select>
                        </div>
                        <!-- Brand -->
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Brand</label>
                            <select name="brand"
                                class="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-[#0f66af] focus:border-transparent"
                                onchange="this.form.submit()">
                                <option value="All">All</option>
                                @foreach ($brands as $brand)
                                    <option value="{{ $brand->id }}"
                                        {{ $filters['brand'] == $brand->id ? 'selected' : '' }}>{{ $brand->name }}
                                    </option>
                                @endforeach
                            </select>
                        </div>
                        <!-- Variant -->
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Variant</label>
                            <select name="variant"
                                class="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-[#0f66af] focus:border-transparent"
                                onchange="this.form.submit()">
                                <option value="All">All</option>
                                @foreach ($variants as $variant)
                                    <option value="{{ $variant->id }}"
                                        {{ $filters['variant'] == $variant->id ? 'selected' : '' }}>
                                        {{ $variant->name ?? $variant->variant_name }}</option>
                                @endforeach
                            </select>
                        </div>
                        <!-- Fuel Type -->
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Fuel Type</label>
                            <select name="fuelType"
                                class="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-[#0f66af] focus:border-transparent"
                                onchange="this.form.submit()">
                                <option value="All">All</option>
                                @foreach ($fuelTypes as $fuelType)
                                    <option value="{{ $fuelType->id }}"
                                        {{ $filters['fuelType'] == $fuelType->id ? 'selected' : '' }}>
                                        {{ $fuelType->name ?? $fuelType->fuel_type }}</option>
                                @endforeach
                            </select>
                        </div>
                    </div>
                    <!-- Buttons -->
                    <div class="flex justify-end mt-4 gap-2">
                        <a href="{{ route('leads.index') }}"
                            class="bg-gray-200 text-gray-700 rounded-lg px-4 py-2 text-sm hover:bg-gray-300 transition-colors">Reset</a>
                        <button type="submit"
                            class="bg-[#0f66af] text-white rounded-lg px-4 py-2 text-sm hover:bg-blue-700 transition-colors">Apply
                            Filters</button>
                    </div>
                </div>
            </form>

            <!-- Brand-wise Model Grid -->
            <div id="brandModelGrid">
                @forelse($groupedVariants as $brand)
                    <div class="mb-8">
                        <h3 class="text-lg font-semibold text-[#0f66af] mb-4 pb-2 border-b-2 border-blue-100">
                            {{ $brand['brand_name'] }}</h3>
                        <div class="flex overflow-x-auto pb-4 gap-4 custom-scrollbar">
                            @foreach ($brand['variants'] as $variant)
                                @php
                                    $variantGallery = $galleries->firstWhere('variant_id', $variant->id);
                                    $images =
                                        $variantGallery && $variantGallery->cover_photos
                                            ? json_decode($variantGallery->cover_photos, true) ?? [
                                                    $variantGallery->cover_photos,
                                                ]
                                            : [];
                                    $image = !empty($images)
                                        ? asset('uploads/coverPhotos/' . $images[0])
                                        : 'https://via.placeholder.com/1000x700';
                                @endphp
                                <a href="{{ route('leads.model_details', ['variantId' => $variant->id]) }}"
                                    class="min-w-[200px] flex-shrink-0 bg-white rounded-lg p-4 border border-gray-200 hover:-translate-y-1 hover:shadow-lg transition-all duration-300 {{ session('selected_variant_id') == $variant->id ? 'border-2 border-[#0f66af] bg-blue-50' : '' }}">
                                    <div class="w-full aspect-[10/7] bg-white rounded-lg overflow-hidden">
                                        <img src="{{ $image }}"
                                            alt="{{ $variant->name ?? $variant->variant_name }}"
                                            class="w-full h-full object-cover {{ session('selected_variant_id') == $variant->id ? 'scale-105' : '' }}"
                                            loading="lazy">
                                    </div>
                                    <h5 class="mt-2 font-semibold text-gray-800 text-sm">
                                        {{ $variant->name ?? $variant->variant_name }}</h5>
                                    <p class="text-[#0f66af] font-medium text-sm">
                                        {{ $variant->basic_price ? '₹' . number_format($variant->basic_price) : 'Price on request' }}
                                    </p>
                                    <p class="text-gray-500 text-xs">
                                        {{ $fuelTypes->find($variant->fuel_type_id)->name ?? 'N/A' }} |
                                        {{ $ccs->find($variant->cc_id)->name ?? 'N/A' }}
                                    </p>
                                </a>
                            @endforeach
                        </div>
                    </div>
                @empty
                    <p class="text-gray-400">No variants available.</p>
                @endforelse
            </div>
        </div>
    </div>

    <script>
        // Auto-submit form on select change is handled by onchange="this.form.submit()"
        function selectVariant(variantId) {
            // Store selected variant in session storage for highlighting (optional, can use session)
            sessionStorage.setItem('selectedVariantId', variantId);
            window.location.href = `/leads/model-details/${variantId}`;
        }
    </script>
</body>

</html>
