<!DOCTYPE html>
<html>

<head>
    <title>Model Details</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/lightgallery/2.7.0/css/lightgallery.min.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/lightgallery/2.7.0/css/lg-zoom.min.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/lightgallery/2.7.0/css/lg-thumbnail.min.css">
</head>

<body class="bg-gray-50">
    <div class="w-full px-2 md:px-6">
        <!-- Stepper (simplified, assuming a partial) -->
        {{-- @include('leads.partials.stepper', ['step' => 2]) --}}

        <!-- Header -->
        <div class="bg-[#0f66af] text-white px-4 md:px-6 py-4 rounded-t-lg">
            <h2 class="text-lg font-semibold">New Lead Information</h2>
        </div>

        <!-- Card -->
        <div class="bg-white shadow-md rounded-b-lg p-4 md:p-6">
            <!-- Back Button -->
            <a href="javascript:history.back()"
                class="bg-gray-100 text-gray-700 rounded-lg px-4 py-2 mb-4 text-sm hover:bg-gray-200 transition-colors inline-flex items-center">
                ← Back
            </a>

            <!-- Model Details -->
            <h3 class="text-xl font-semibold text-[#0f66af] mb-4">{{ $variant->name }}</h3>

            <div class="grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-4 md:gap-6">
                <!-- Main Image and Thumbnails -->
                <div class="bg-blue-50 rounded-lg p-2 md:p-4 flex flex-col items-center">
                    <div id="lightgallery" class="flex justify-center w-full">
                        <a
                            href="{{ $galleries->first()->cover_photo ? asset('uploads/coverPhotos/' . $galleries->first()->cover_photo) : 'https://via.placeholder.com/300' }}">
                            <img src="{{ $galleries->first()->cover_photo ? asset('uploads/coverPhotos/' . $galleries->first()->cover_photo) : 'https://via.placeholder.com/300' }}"
                                alt="Main Model" class="max-w-[400px] w-full h-auto object-contain cursor-pointer">
                        </a>
                        @foreach ($galleries as $gallery)
                            @php
                                $photos = json_decode($gallery->cover_photos, true) ?? [$gallery->cover_photos];
                            @endphp
                            @foreach ($photos as $photo)
                                @if ($photo !== $galleries->first()->cover_photo)
                                    <a href="{{ asset('uploads/coverPhotos/' . $photo) }}" class="hidden">
                                        <img src="{{ asset('uploads/coverPhotos/' . $photo) }}" alt="">
                                    </a>
                                @endif
                            @endforeach
                        @endforeach
                    </div>
                </div>

                <!-- Vertical Thumbnail Bar -->
                <div class="rounded-lg p-2 md:p-4">
                    <h5 class="text-lg font-medium mb-3">Gallery</h5>
                    <div class="flex gap-3 overflow-x-auto pb-2 scrollbar-thin">
                        @foreach ($galleries as $gallery)
                            @php
                                $photos = json_decode($gallery->cover_photos, true) ?? [$gallery->cover_photos];
                            @endphp
                            @foreach ($photos as $photo)
                                <img src="{{ asset('uploads/coverPhotos/' . $photo) }}" alt="Thumbnail"
                                    class="w-20 h-20 object-cover rounded-lg cursor-pointer transition-transform hover:scale-105 flex-shrink-0 border border-gray-300"
                                    onclick="setMainImage('{{ asset('uploads/coverPhotos/' . $photo) }}')">
                            @endforeach
                        @endforeach
                    </div>
                </div>
            </div>

            <!-- Available Colors -->
            <div class="mt-6">
                <h5 class="text-lg font-medium mb-3">Available Colors</h5>
                <form method="POST" action="{{ route('leads.lead_information') }}">
                    @csrf
                    <input type="hidden" name="variant_id" value="{{ $variant->id }}">
                    <div class="flex gap-3 overflow-x-auto pb-2">
                        @forelse($colors as $color)
                            <div class="w-10 h-10 rounded-full border-2 flex-shrink-0 cursor-pointer transition-transform hover:scale-110 {{ $color->id == request('selected_color_id') ? 'border-[#0f66af]' : 'border-gray-300' }}"
                                style="background-color: {{ $color->color_code }}"
                                onclick="selectColor({{ $color->id }})"></div>
                            <input type="radio" name="selected_color_id" value="{{ $color->id }}" class="hidden"
                                id="color-{{ $color->id }}"
                                {{ $color->id == request('selected_color_id') ? 'checked' : '' }}>
                        @empty
                            <span class="text-gray-400">No colors available</span>
                        @endforelse
                    </div>

                    <!-- Tabs -->
                    <div class="mt-6 border-b border-gray-200 flex gap-6 overflow-x-auto">
                        <button type="button"
                            class="pb-2 whitespace-nowrap {{ request('tab', 'features') === 'features' ? 'text-[#0f66af] border-b-2 border-[#0f66af]' : 'text-gray-600' }}"
                            onclick="setTab('features')">Features</button>
                        <button type="button"
                            class="pb-2 whitespace-nowrap {{ request('tab') === 'tech' ? 'text-[#0f66af] border-b-2 border-[#0f66af]' : 'text-gray-600' }}"
                            onclick="setTab('tech')">Tech Specs</button>
                        <button type="button"
                            class="pb-2 whitespace-nowrap {{ request('tab') === 'brochure' ? 'text-[#0f66af] border-b-2 border-[#0f66af]' : 'text-gray-600' }}"
                            onclick="setTab('brochure')">Brochure</button>
                    </div>

                    <!-- Tab Content -->
                    <div class="mt-4">
                        @if (request('tab', 'features') === 'features')
                            <ul class="list-disc pl-5 space-y-2">
                                @foreach ($variant->features ?? ['Feature 1', 'Feature 2'] as $feature)
                                    <li>{{ $feature }}</li>
                                @endforeach
                            </ul>
                        @elseif(request('tab') === 'tech')
                            <div class="overflow-x-auto">
                                <table class="table-auto w-full">
                                    <tbody class="divide-y divide-gray-200">
                                        @foreach ($techSpecs as $spec)
                                            <tr>
                                                <td class="px-4 py-2 font-medium whitespace-nowrap">{{ $spec['key'] }}
                                                </td>
                                                <td class="px-4 py-2 break-words">{{ $spec['value'] }}</td>
                                            </tr>
                                        @endforeach
                                    </tbody>
                                </table>
                            </div>
                        @else
                            <div>
                                @if ($variant->brochure)
                                    <a href="{{ asset('uploads/brochures/' . $variant->brochure) }}" target="_blank"
                                        class="text-blue-600 underline">Brochure PDF</a>
                                @else
                                    <span class="text-gray-400">Brochure not available</span>
                                @endif
                            </div>
                        @endif
                    </div>

                    <!-- Next Button -->
                    <div class="flex justify-end mt-8">
                        <button type="submit"
                            class="bg-[#0f66af] text-white rounded-lg px-6 py-2.5 text-sm font-medium hover:bg-blue-700 transition-colors flex items-center"
                            onclick="return validateColor()">Next →</button>
                    </div>
                </form>
            </div>
        </div>

        <!-- Color Confirmation Modal -->
        @if (session('show_color_modal'))
            <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div class="bg-white rounded-xl max-w-md w-full mx-4 overflow-hidden">
                    <div class="bg-[#0f66af] text-white p-4">
                        <h3 class="text-lg font-semibold">Confirm Color</h3>
                    </div>
                    <div class="p-5">
                        <p>Please confirm the colour of your model: <span
                                class="font-semibold text-[#0f66af]">{{ $colors->find(session('selected_color_id'))->name ?? '' }}</span>
                        </p>
                    </div>
                    <div class="flex justify-end gap-3 p-4 border-t border-gray-200">
                        <a href="{{ route('leads.model_details', ['variantId' => $variant->id]) }}"
                            class="bg-gray-100 text-gray-700 rounded-lg px-4 py-2 text-sm hover:bg-gray-200 transition-colors">Cancel</a>
                        <form method="POST" action="{{ route('leads.lead_information') }}">
                            @csrf
                            <input type="hidden" name="variant_id" value="{{ $variant->id }}">
                            <input type="hidden" name="selected_color_id" value="{{ session('selected_color_id') }}">
                            <button type="submit"
                                class="bg-[#0f66af] text-white rounded-lg px-4 py-2 text-sm hover:bg-blue-700 transition-colors">Confirm</button>
                        </form>
                    </div>
                </div>
            </div>
        @endif
    </div>

    <script src="https://cdnjs.cloudflare.com/ajax/libs/lightgallery/2.7.0/lightgallery.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/lightgallery/2.7.0/plugins/zoom/lg-zoom.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/lightgallery/2.7.0/plugins/thumbnail/lg-thumbnail.min.js"></script>
    <script>
        lightGallery(document.getElementById('lightgallery'), {
            plugins: [lgZoom, lgThumbnail],
            speed: 500,
        });

        function setMainImage(url) {
            document.querySelector('#lightgallery a img').src = url;
            document.querySelector('#lightgallery a').href = url;
        }

        function selectColor(colorId) {
            document.getElementById(`color-${colorId}`).checked = true;
            document.querySelectorAll('.rounded-full').forEach(el => {
                el.classList.remove('border-[#0f66af]');
                el.classList.add('border-gray-300');
            });
            document.querySelector(`[onclick="selectColor(${colorId})"]`).classList.add('border-[#0f66af]');
        }

        function setTab(tab) {
            window.location.href =
                `?tab=${tab}&variant_id={{ $variant->id }}&selected_color_id=${document.querySelector('input[name="selected_color_id"]:checked')?.value || ''}`;
        }

        function validateColor() {
            const selectedColor = document.querySelector('input[name="selected_color_id"]:checked');
            if (!selectedColor) {
                alert('Please select a color before proceeding!');
                return false;
            }
            return true;
        }
    </script>
</body>

</html>
