<!DOCTYPE html>
<html>

<head>
    <title>Lead Information</title>
    <script src="https://cdn.tailwindcss.com"></script>
</head>

<body class="bg-gray-50 min-h-screen">
    ទ4
    <div class="p-8">
        {{-- @include('leads.partials.stepper', ['step' => 3]) --}}

        <!-- Header -->
        <div class="bg-[#0f66af] text-white rounded-t-xl px-6 py-3 mt-6 shadow-sm">
            <h3 class="text-lg font-semibold">New Lead Information</h3>
        </div>

        <div class="bg-white rounded-b-xl shadow-sm border border-gray-200 p-6">
            <!-- Back Button -->
            <a href="javascript:history.back()"
                class="bg-gray-100 text-gray-700 rounded-lg px-4 py-2 text-sm hover:bg-gray-200 transition-colors inline-flex items-center mb-4">
                ← Back
            </a>

            <!-- Success/Error Messages -->
            @if (session('success'))
                <p class="text-green-600 font-semibold mb-4">{{ session('success') }}</p>
            @endif
            @if ($errors->any())
                <div class="text-red-600 mb-4">
                    <ul>
                        @foreach ($errors->all() as $error)
                            <li>{{ $error }}</li>
                        @endforeach
                    </ul>
                </div>
            @endif

            <!-- Lead ID -->
            @if (session('lead_id'))
                <p class="text-green-600 font-semibold mb-4">Current Lead ID: {{ session('lead_id') }}</p>
            @endif

            <!-- Variant Name -->
            @if ($variant)
                <h4 class="text-[#0f66af] text-xl font-semibold mb-6">{{ $variant->name }}</h4>
            @endif

            <!-- Form -->
            <form method="POST" action="{{ route('leads.store') }}">
                @csrf
                <input type="hidden" name="variant_id" value="{{ $variant->id ?? '' }}">
                <input type="hidden" name="selected_color_id" value="{{ $selectedColorId ?? '' }}">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <!-- Left -->
                    <div class="space-y-4">
                        <div>
                            <input type="text" name="customer_name" id="customerName"
                                value="{{ old('customer_name', $formData['customer_name']) }}"
                                placeholder="Customer Name" class="w-full border p-2.5 rounded-lg" required>
                        </div>
                        <div>
                            <input type="tel" name="phone_number" id="phoneNumber"
                                value="{{ old('phone_number', $formData['phone_number']) }}" placeholder="Phone Number"
                                class="w-full border p-2.5 rounded-lg" required>
                        </div>
                        <div>
                            <input type="text" name="customer_location" id="customerLocation"
                                value="{{ old('customer_location', $formData['customer_location']) }}"
                                placeholder="Location" class="w-full border p-2.5 rounded-lg" required>
                        </div>
                    </div>
                    <!-- Right -->
                    <div class="space-y-4">
                        <div>
                            <input type="date" name="purchase_date" id="purchaseDate"
                                value="{{ old('purchase_date', $formData['purchase_date']) }}"
                                class="w-full border p-2.5 rounded-lg">
                        </div>
                        <div>
                            <input type="number" name="quantity" id="quantity"
                                value="{{ old('quantity', $formData['quantity']) }}" min="1"
                                class="w-full border p-2.5 rounded-lg" required>
                        </div>
                        <div>
                            <select name="oem_id" id="oem_id" class="w-full border p-2.5 rounded-lg">
                                <option value="">Select OEM</option>
                                @foreach ($oems as $oem)
                                    <option value="{{ $oem->id }}"
                                        {{ $formData['oem_id'] == $oem->id ? 'selected' : '' }}>{{ $oem->name }}
                                    </option>
                                @endforeach
                            </select>
                        </div>
                        <div class="flex gap-4 mt-2">
                            <label class="flex items-center">
                                <input type="radio" name="payment_mode" value="cash"
                                    {{ $formData['payment_mode'] === 'cash' ? 'checked' : '' }} class="mr-2"
                                    required>Cash
                            </label>
                            <label class="flex items-center">
                                <input type="radio" name="payment_mode" value="finance"
                                    {{ $formData['payment_mode'] === 'finance' ? 'checked' : '' }}
                                    class="mr-2">Finance
                            </label>
                        </div>
                    </div>
                </div>
                <div class="mb-6">
                    <textarea name="notes" id="notes" placeholder="Additional notes..." rows="3"
                        class="w-full border p-2.5 rounded-lg">{{ old('notes', $formData['notes']) }}</textarea>
                </div>

                <!-- Model Details -->
                @if ($variant)
                    <div class="mb-6 bg-gray-50 p-4 rounded-lg border border-gray-200">
                        <h4 class="text-[#0f66af] text-lg font-semibold mb-4">Model Details</h4>
                        @if ($lead)
                            <div class="mb-4">
                                <p class="text-sm"><span class="font-medium">Lead ID:</span> {{ $lead->id }}</p>
                                <p class="text-sm"><span class="font-medium">Customer:</span>
                                    {{ $lead->customer_name }}</p>
                                <p class="text-sm"><span class="font-medium">Phone:</span> {{ $lead->phone_no }}</p>
                                <p class="text-sm"><span class="font-medium">Location:</span> {{ $lead->location }}</p>
                                <p class="text-sm"><span class="font-medium">Purchase Date:</span>
                                    {{ $lead->tentative_purchase_date }}</p>
                                <p class="text-sm"><span class="font-medium">Payment Mode:</span>
                                    {{ $lead->payment_mode }}</p>
                                <p class="text-sm"><span class="font-medium">Quantity:</span> {{ $lead->vehicle_qty }}
                                </p>
                                <p class="text-sm"><span class="font-medium">Notes:</span> {{ $lead->additional_note }}
                                </p>
                            </div>
                        @else
                            <p class="text-gray-400">No lead details available yet.</p>
                        @endif
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <p class="text-sm"><span class="font-medium">Variant:</span> {{ $variant->name }}</p>
                                <p class="text-sm"><span class="font-medium">Brand:</span>
                                    {{ $brands->find($variant->brand_id)->name ?? 'N/A' }}</p>
                                <p class="text-sm"><span class="font-medium">CC:</span>
                                    {{ $ccs->find($variant->cc_id)->name ?? 'N/A' }}</p>
                                <p class="text-sm"><span class="font-medium">Fuel Type:</span>
                                    {{ $fuelTypes->find($variant->fuel_type_id)->name ?? 'N/A' }}</p>
                                <p class="text-sm"><span class="font-medium">Price:</span>
                                    {{ $variant->basic_price ? '₹' . number_format($variant->basic_price) : 'Price on request' }}
                                </p>
                            </div>
                            @if ($galleries->count() > 0)
                                <div class="flex flex-wrap gap-2">
                                    @foreach ($galleries as $gallery)
                                        @php
                                            $photos = json_decode($gallery->cover_photos, true) ?? [
                                                $gallery->cover_photos,
                                            ];
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
                @endif

                <!-- Buttons -->
                <div class="flex flex-col md:flex-row justify-between gap-4 mt-8">
                    <button type="submit" name="save_draft" value="1"
                        class="bg-gray-100 text-gray-700 rounded-lg px-4 py-2.5 text-sm font-medium hover:bg-gray-200 transition-colors">Save
                        as Draft</button>
                    <button type="submit" name="add_another_vehicle" value="1"
                        class="bg-gray-100 text-gray-700 rounded-lg px-4 py-2.5 text-sm font-medium hover:bg-gray-200 transition-colors">Add
                        Another Vehicle</button>
                    <button type="submit"
                        class="bg-[#0f66af] text-white rounded-lg px-6 py-2.5 text-sm font-medium hover:bg-blue-700 transition-colors">Submit
                        Lead</button>
                </div>
            </form>
        </div>
    </div>
</body>

</html>
