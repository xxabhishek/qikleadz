<!DOCTYPE html>
<html>

<head>
    <title>Lead Summary</title>
    <script src="https://cdn.tailwindcss.com"></script>
</head>

<body class="bg-gray-50 min-h-screen">
    <div class="p-8">
        @include('admin.leadgen.stepper', ['step' => 4])

        <!-- Header -->
        <div class="bg-[#0f66af] text-white rounded-t-xl px-6 py-3 mt-6 shadow-sm">
            <h3 class="text-lg font-semibold">Lead Summary</h3>
        </div>

        <div class="bg-white rounded-b-xl shadow-sm border border-gray-200 p-6">
            <!-- Back Button -->
            <a href="javascript:history.back()"
                class="bg-gray-100 text-gray-700 rounded-lg px-4 py-2 mb-4 text-sm hover:bg-gray-200 transition-colors inline-flex items-center">
                ← Back
            </a>

            <!-- Summary Section -->
            @forelse($vehicles as $index => $vehicle)
                @php
                    $variant = $variants->find($vehicle->variant_id);
                @endphp
                <div class="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <h4 class="text-[#0f66af] text-lg font-semibold mb-4">Vehicle {{ $index + 1 }}</h4>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <p class="text-sm"><span class="font-medium">Customer Name:</span>
                                {{ $lead->customer_name }}</p>
                            <p class="text-sm"><span class="font-medium">Phone Number:</span> {{ $lead->phone_no }}</p>
                            <p class="text-sm"><span class="font-medium">Location:</span> {{ $lead->location }}</p>
                            <p class="text-sm"><span class="font-medium">Purchase Date:</span>
                                {{ $lead->tentative_purchase_date }}</p>
                            <p class="text-sm"><span class="font-medium">Quantity:</span> {{ $vehicle->vehicle_qty }}
                            </p>
                            <p class="text-sm"><span class="font-medium">Payment Mode:</span> {{ $lead->payment_mode }}
                            </p>
                            <p class="text-sm"><span class="font-medium">OEM:</span>
                                {{ $oems->find($vehicle->oem_id)->name ?? 'N/A' }}</p>
                            <p class="text-sm"><span class="font-medium">Notes:</span> {{ $lead->additional_note }}</p>
                            <p class="text-sm"><span class="font-medium">Variant:</span> {{ $variant->name ?? 'N/A' }}
                            </p>
                            <p class="text-sm"><span class="font-medium">Brand:</span>
                                {{ $brands->find($variant->brand_id)->name ?? 'N/A' }}</p>
                            <p class="text-sm"><span class="font-medium">CC:</span>
                                {{ $ccs->find($variant->cc_id)->name ?? 'N/A' }}</p>
                            <p class="text-sm"><span class="font-medium">Fuel Type:</span>
                                {{ $fuelTypes->find($variant->fuel_type_id)->name ?? 'N/A' }}</p>
                            <p class="text-sm"><span class="font-medium">Price:</span>
                                {{ $variant->basic_price ? '₹' . number_format($variant->basic_price) : 'Price on request' }}
                            </p>
                            <p class="text-sm"><span class="font-medium">Color:</span>
                                {{ $colors->find($vehicle->color_id)->name ?? 'N/A' }}</p>
                        </div>
                        @php
                            $vehicleGalleries = $galleries->where('variant_id', $vehicle->variant_id);
                        @endphp
                        @if ($vehicleGalleries->count() > 0)
                            <div class="flex flex-wrap gap-2">
                                @foreach ($vehicleGalleries as $gallery)
                                    @php
                                        $photos = json_decode($gallery->cover_photos, true) ?? [$gallery->cover_photos];
                                    @endphp
                                    @foreach ($photos as $photo)
                                        <img src="{{ asset('uploads/coverPhotos/' . $photo) }}" alt="Gallery"
                                            class="w-20 h-20 object-cover rounded-md border">
                                    @endforeach
                                @endforeach
                            </div>
                        @endif
                    </div>
                </div>
            @empty
                <p class="text-gray-400">No vehicles added yet.</p>
            @endforelse

            <!-- Buttons -->
            <div class="flex flex-col md:flex-row justify-between gap-4 mt-8">
                <a href="javascript:history.back()"
                    class="bg-gray-100 text-gray-700 rounded-lg px-4 py-2.5 text-sm font-medium hover:bg-gray-200 transition-colors">Back</a>
                <a href="{{ route('leads.submit_all', $lead->id) }}"
                    class="bg-[#0f66af] text-white rounded-lg px-6 py-2.5 text-sm font-medium hover:bg-blue-700 transition-colors">Submit
                    All Leads</a>
            </div>
        </div>
    </div>
</body>

</html>
