@extends('layouts.structure')

@section('title', 'Vehicle Details - Rocker')

@section('styles')
    <style>
        /* Only show active tab content */
        .custom-tab-content {
            display: none;
        }

        .custom-tab-content.active {
            display: block;
        }

        /* Highlight selected tab buttons */
        .tab-button.active {
            background-color: #007bff;
            color: #fff;
            border-color: #007bff;
        }

        /* Highlight selected color */
        .color-select.border-primary {
            border: 2px solid #007bff !important;
        }
    </style>
@endsection

@section('content')
    <div class="container">
        <div class="row justify-content-center">
            <div class="col-md-10">
                <div class="card p-4">
                    <h5>Model Detail</h5>

                    {{-- Gallery Image --}}
                    <div class="mb-4 text-center">
                        <img src="{{ asset('uploads/coverPhotos/' . $gallery->cover_photos) }}" alt="Gallery Image"
                            class="img-fluid rounded shadow" style="max-height: 300px; object-fit: cover;">
                    </div>

                    {{-- Available Colors --}}
                    @if (!empty($gallery->variant->color_id_array))
                        <div class="mb-4 text-left">
                            <h5>Available Colors</h5>
                            <div class="d-flex flex-wrap gap-2 mt-2">
                                @foreach ($gallery->variant->color_id_array as $colorId)
                                    @php
                                        $color = \App\Models\Color::find($colorId);
                                    @endphp
                                    @if ($color)
                                        <button type="button" class="color-select btn p-0"
                                            data-color="{{ $color->name }}">
                                            @if (!empty($color->hex_code))
                                                <div title="{{ $color->name }}"
                                                    style="width:40px; height:40px; border:1px solid #ccc; background:{{ $color->hex_code }}; border-radius:50%;">
                                                </div>
                                            @else
                                                <div
                                                    style="padding:6px 10px; border:1px solid #ccc; border-radius:12px; background:#f5f5f5;">
                                                    {{ $color->name }}
                                                </div>
                                            @endif
                                        </button>
                                    @endif
                                @endforeach
                            </div>
                        </div>
                    @endif

                    {{-- Tab Buttons --}}
                    <ul class="nav nav-tabs" id="featureTabs" role="tablist">
                        <li class="nav-item" role="presentation">
                            <button class="nav-link active" id="features-tab" data-bs-toggle="tab"
                                data-bs-target="#features" type="button" role="tab" aria-controls="features"
                                aria-selected="true">
                                Features
                            </button>
                        </li>
                        <li class="nav-item" role="presentation">
                            <button class="nav-link" id="specs-tab" data-bs-toggle="tab" data-bs-target="#specs"
                                type="button" role="tab" aria-controls="specs" aria-selected="false">
                                Tech Specs
                            </button>
                        </li>
                        <li class="nav-item" role="presentation">
                            <button class="nav-link" id="brochure-tab" data-bs-toggle="tab" data-bs-target="#brochure"
                                type="button" role="tab" aria-controls="brochure" aria-selected="false">
                                Brochure
                            </button>
                        </li>
                    </ul>

                    {{-- Tab Contents --}}
                    <div class="tab-content mt-3" id="featureTabsContent">
                        {{-- Features --}}
                        <div class="tab-pane fade show active" id="features" role="tabpanel"
                            aria-labelledby="features-tab">
                            <h5 class="mb-3">Features</h5>
                            @forelse($features as $feature)
                                <div class="mb-3">
                                    <div class="fw-bold">{{ $feature->title }}:</div>
                                    <div>{!! $feature->description !!}</div>
                                </div>
                            @empty
                                <p class="text-muted">No features found.</p>
                            @endforelse
                        </div>

                        {{-- Tech Specs --}}
                        <div class="tab-pane fade" id="specs" role="tabpanel" aria-labelledby="specs-tab">
                            <h5 class="mb-3">Tech Specs</h5>
                            @forelse($techSpecs as $spec)
                                <div class="mb-3">
                                    <div class="fw-bold">{{ $spec->title }}:</div>
                                    <div>{!! $spec->description !!}</div>
                                </div>
                            @empty
                                <p class="text-muted">No tech specs found.</p>
                            @endforelse
                        </div>

                        {{-- Brochure --}}
                        <div class="tab-pane fade" id="brochure" role="tabpanel" aria-labelledby="brochure-tab">
                            <h5 class="mb-3">Brochure</h5>
                            @if (!empty($gallery->variant->brochure))
                                @php
                                    $filePath = asset('uploads/brochures/' . $gallery->variant->brochure);
                                    $extension = strtolower(pathinfo($gallery->variant->brochure, PATHINFO_EXTENSION));
                                @endphp
                                <p><strong>File:</strong> {{ $gallery->variant->brochure }}</p>
                                @if (in_array($extension, ['jpg', 'jpeg', 'png', 'gif']))
                                    <img src="{{ $filePath }}" alt="Brochure Image" class="img-fluid rounded shadow">
                                @elseif($extension === 'pdf')
                                    <iframe src="{{ $filePath }}" width="100%" height="600px"
                                        style="border:1px solid #ddd;"></iframe>
                                @else
                                    <a href="{{ $filePath }}" target="_blank" class="btn btn-primary">View Brochure</a>
                                @endif
                                <a href="{{ $filePath }}" download class="btn btn-success mt-2">Download Brochure</a>
                            @else
                                <p class="text-muted">No brochure available.</p>
                            @endif
                        </div>
                    </div>

                    {{-- Next Button after Tabs --}}
                    @if (!empty($gallery->variant->color_id_array))
                        <div class="mt-3 text-end">
                            <button id="nextColorBtn" class="btn btn-primary" disabled>Next</button>
                        </div>
                    @endif
                </div>
            </div>
        </div>
    </div>

    {{-- Hidden form to send all details --}}
    <form id="colorForm" action="{{ route('customer.details') }}" method="POST" style="display:none;">
        @csrf
        <input type="hidden" name="vehicle_segment_id" value="{{ $gallery->variant->brand->vehicle_segment_id ?? '' }}">
        <input type="hidden" name="brand_id" value="{{ $gallery->variant->brand_id }}">
        <input type="hidden" name="variant_id" value="{{ $gallery->variant->id }}">
        <input type="hidden" name="fuel_type_id" value="{{ $gallery->variant->fuel_type_id }}">
        <input type="hidden" name="color" id="selectedColorInput" value="">
    </form>

    {{-- Confirmation Modal --}}
    <div class="modal fade" id="colorConfirmModal" tabindex="-1" aria-labelledby="colorConfirmModalLabel"
        aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="colorConfirmModalLabel">Confirm Color</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    Please confirm the colour of your model: <span id="selectedColorName"></span>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                    <button type="button" class="btn btn-primary" id="confirmColorBtn">Confirm</button>
                </div>
            </div>
        </div>
    </div>
@endsection

@section('scripts')
    <script>
        document.addEventListener('DOMContentLoaded', function() {
            let selectedColor = null;

            // Enable Next button when a color is clicked
            document.querySelectorAll('.color-select').forEach(button => {
                button.addEventListener('click', function() {
                    selectedColor = this.dataset.color;
                    document.querySelectorAll('.color-select').forEach(b => b.classList.remove(
                        'border-primary'));
                    this.classList.add('border-primary');
                    document.getElementById('nextColorBtn').disabled = false;
                });
            });

            // Show confirmation modal
            document.getElementById('nextColorBtn').addEventListener('click', function() {
                if (selectedColor) {
                    document.getElementById('selectedColorName').textContent = selectedColor;
                    new bootstrap.Modal(document.getElementById('colorConfirmModal')).show();
                }
            });

            // Confirm color -> submit hidden form
            document.getElementById('confirmColorBtn').addEventListener('click', function() {
                if (selectedColor) {
                    document.getElementById('selectedColorInput').value = selectedColor;
                    document.getElementById('colorForm').submit();
                }
            });
        });
    </script>
@endsection
