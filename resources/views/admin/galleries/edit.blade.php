@extends('layouts.structure')

@section('title', 'Edit Gallery - Rocker')

@section('content')
    <div class="container">
        <div class="row justify-content-center">
            <div class="col-md-10">
                <div class="card">
                    <div class="card-header">Edit Gallery</div>
                    <div class="card-body">

                        {{-- Error Messages --}}
                        @if ($errors->any())
                            <div class="alert alert-danger">
                                <ul>
                                    @foreach ($errors->all() as $error)
                                        <li>{{ $error }}</li>
                                    @endforeach
                                </ul>
                            </div>
                        @endif

                        {{-- Form --}}
                        <form action="{{ route('galleries.update', $gallery->id) }}" method="POST"
                            enctype="multipart/form-data">
                            @csrf
                            @method('PUT')

                            <div class="form-group mb-3">
                                <label for="oem_id">Select OEM Name <span class="text-danger">*</span></label>
                                <select name="oem_id" id="oem_id" class="form-control" required>
                                    <option value="">-- Select OEM --</option>
                                    @foreach ($oems as $oem)
                                        <option value="{{ $oem->id }}"
                                            {{ isset($gallery) && $gallery->oem_id == $oem->id ? 'selected' : '' }}>
                                            {{ $oem->name }}
                                        </option>
                                    @endforeach
                                </select>
                            </div>


                            {{-- Cover Photos --}}
                            <div class="form-group mb-3">
                                <label for="cover_photos">Cover Photos (Max 8)</label>

                                {{-- Existing Cover Photos --}}
                                <div class="mb-2 d-flex flex-wrap">
                                    @php
                                        $coverPhotos = $gallery->cover_photos;

                                        // If it's a string (JSON), decode it
if (is_string($coverPhotos)) {
    $coverPhotos = json_decode($coverPhotos, true);
}

// Ensure it's always an array
                                        $coverPhotos = $coverPhotos ?? [];
                                    @endphp

                                    @foreach ($coverPhotos as $photo)
                                        <div class="photo-wrapper position-relative d-inline-block me-3 mb-2">
                                            <img src="{{ asset('uploads/coverPhotos/' . $photo) }}" width="120"
                                                class="img-thumbnail">

                                            <!-- Hidden checkbox -->
                                            <input type="checkbox" name="remove_photos[]" value="{{ $photo }}"
                                                class="d-none">

                                            <!-- Cross button -->
                                            <button type="button"
                                                class="btn btn-sm btn-danger position-absolute top-0 end-0 remove-photo-btn"
                                                style="border-radius: 50%; padding: 0.25rem 0.4rem;">×</button>
                                        </div>
                                    @endforeach

                                </div>

                                {{-- Upload New Cover Photos --}}
                                <input type="file" name="cover_photos[]" multiple
                                    accept="image/jpeg,image/png,image/jpg,image/webp" class="form-control">
                                <small class="text-muted">Upload new photos (optional)</small>

                                <div id="newCoverPreview" class="mt-2 d-flex flex-wrap"></div>
                            </div>

                            {{-- Videos --}}
                            <div class="form-group mb-3">
                                <label for="upload_videos">Videos (Max 2)</label>
                                <div class="mb-2 d-flex flex-wrap">
                                    {{-- @if ($gallery->upload_videos)
                                        @foreach ($gallery->upload_videos as $video)
                                            <video src="{{ asset('uploads/galleryVideos/' . $video) }}" width="200"
                                                controls class="me-2 mb-2"></video>
                                        @endforeach
                                    @endif --}}
                                </div>
                                <input type="file" name="upload_videos[]" multiple accept="video/mp4"
                                    class="form-control">
                                <small class="text-muted">Upload new videos to replace existing</small>
                                <div id="newVideoPreview" class="mt-2 d-flex flex-wrap"></div>
                            </div>

                            {{-- Brand --}}
                            <div class="form-group mb-3">
                                <label for="brand_id">Brand</label>
                                <select name="brand_id" id="brand_id" class="form-control" required
                                    onchange="getVariants(this.value)">
                                    <option value="">-- Select Brand --</option>
                                    @foreach ($brands as $brand)
                                        <option value="{{ $brand->id }}"
                                            {{ $gallery->brand_id == $brand->id ? 'selected' : '' }}>
                                            {{ $brand->name }}
                                        </option>
                                    @endforeach
                                </select>
                            </div>

                            {{-- Variant --}}
                            <div class="form-group mb-3">
                                <label for="variant_id">Variant</label>
                                <select name="variant_id" id="variant_id" class="form-control" required>
                                    <option value="">-- Select Variant --</option>
                                    @foreach ($variants as $variant)
                                        <option value="{{ $variant->id }}"
                                            {{ $gallery->variant_id == $variant->id ? 'selected' : '' }}>
                                            {{ $variant->name }}
                                        </option>
                                    @endforeach
                                </select>
                            </div>

                            {{-- Color --}}
                            <div class="form-group mb-3">
                                <label for="color_id">Color</label>
                                <select name="color_id" id="color_id" class="form-control" required>
                                    <option value="">-- Select Color --</option>
                                    @foreach ($colors as $color)
                                        <option value="{{ $color->id }}"
                                            {{ $gallery->color_id == $color->id ? 'selected' : '' }}>
                                            {{ $color->name }}
                                        </option>
                                    @endforeach
                                </select>
                            </div>

                            {{-- Fuel Type --}}
                            <div class="form-group mb-3">
                                <label for="fuel_type_id">Fuel Type</label>
                                <select name="fuel_type_id" id="fuel_type_id" class="form-control" required>
                                    <option value="">-- Select Fuel Type --</option>
                                    @foreach ($fuelTypes as $fuel)
                                        <option value="{{ $fuel->id }}"
                                            {{ $gallery->fuel_type_id == $fuel->id ? 'selected' : '' }}>
                                            {{ $fuel->name }}
                                        </option>
                                    @endforeach
                                </select>
                            </div>

                            <button type="submit" class="btn btn-primary">Update</button>
                            <a href="{{ route('galleries.index') }}" class="btn btn-secondary">Back</a>
                        </form>

                    </div>
                </div>
            </div>
        </div>
    </div>

    {{-- Preview Script --}}
    <script>
        function previewFiles(input, previewId, type) {
            let files = input.files;
            let preview = document.getElementById(previewId);
            preview.innerHTML = '';
            Array.from(files).forEach(file => {
                if (type === 'images' && file.type.startsWith('image/')) {
                    let img = document.createElement('img');
                    img.src = URL.createObjectURL(file);
                    img.width = 120;
                    img.classList.add('img-thumbnail', 'me-2', 'mb-2');
                    preview.appendChild(img);
                } else if (type === 'videos' && file.type.startsWith('video/')) {
                    let video = document.createElement('video');
                    video.src = URL.createObjectURL(file);
                    video.controls = true;
                    video.width = 200;
                    video.classList.add('me-2', 'mb-2');
                    preview.appendChild(video);
                }
            });
        }

        document.querySelector('[name="cover_photos[]"]').addEventListener('change', function() {
            previewFiles(this, 'newCoverPreview', 'images');
        });
        document.querySelector('[name="upload_videos[]"]').addEventListener('change', function() {
            previewFiles(this, 'newVideoPreview', 'videos');
        });

        // AJAX for variants
        function getVariants(brand_id) {
            var url = '{{ route('getByBrandSelectVariant', [':brand_id']) }}'.replace(':brand_id', brand_id);
            if (!brand_id) {
                $('#variant_id').empty();
                return;
            }
            $.ajax({
                url: url,
                type: "GET",
                dataType: "json",
                success: function(data) {
                    $('#variant_id').empty().append('<option value="">--Select Variant--</option>');
                    $.each(data, function(key, value) {
                        $('#variant_id').append(`<option value="${key}">${value}</option>`);
                    });
                }
            });
        }


        // Handle "remove photo" cross click
        document.querySelectorAll('.remove-photo-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                let wrapper = this.closest('.photo-wrapper');
                let checkbox = wrapper.querySelector('input[type="checkbox"]');

                // Toggle state
                checkbox.checked = !checkbox.checked;

                // Visual feedback (dim the image if selected for removal)
                wrapper.querySelector('img').style.opacity = checkbox.checked ? '0.4' : '1';
            });
        });


        // Get existing photos count on page load
        let existingPhotosCount = document.querySelectorAll('.photo-wrapper').length;

        // Watch file input for new cover photos
        document.querySelector('[name="cover_photos[]"]').addEventListener('change', function(e) {
            let files = Array.from(this.files);

            // Count existing and removed photos
            let removedCount = document.querySelectorAll('.photo-wrapper input[type="checkbox"]:checked').length;
            let existingPhotosCount = document.querySelectorAll('.photo-wrapper').length;
            let remaining = existingPhotosCount - removedCount;

            // How many new we can still accept
            let allowed = 8 - remaining;

            if (files.length > allowed) {
                Swal.fire({
                    icon: 'warning',
                    title: 'Too many images!',
                    text: `You selected ${files.length} images, but only ${allowed} can be added.`,
                    confirmButtonText: 'OK'
                }).then(() => {
                    // Keep only allowed number
                    files = files.slice(0, allowed);

                    // Reset input files
                    let dataTransfer = new DataTransfer();
                    files.forEach(file => dataTransfer.items.add(file));
                    e.target.files = dataTransfer.files;

                    // Preview only the accepted files
                    previewFiles(e.target, 'newCoverPreview', 'images');
                });
            } else {
                // If within limit, just preview normally
                previewFiles(this, 'newCoverPreview', 'images');
            }
        });



        // Update existingPhotosCount live when user toggles remove button
       // Handle "remove photo" cross click
document.querySelectorAll('.remove-photo-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        let wrapper = this.closest('.photo-wrapper');
        let checkbox = wrapper.querySelector('input[type="checkbox"]');

        // Mark checkbox as checked (to remove on server)
        checkbox.checked = true;

        // Hide the image wrapper visually
        wrapper.style.display = 'none';

        // Update remaining count logic if needed
        updateRemainingCount();
    });
});

// Function to update remaining count for new uploads
function updateRemainingCount() {
    let removedCount = document.querySelectorAll('.photo-wrapper input[type="checkbox"]:checked').length;
    let existingCount = document.querySelectorAll('.photo-wrapper').length;
    window.remainingPhotos = 8 - (existingCount - removedCount);
}

// Watch file input for new cover photos
document.querySelector('[name="cover_photos[]"]').addEventListener('change', function(e) {
    let files = Array.from(this.files);

    // How many new we can still accept
    let allowed = window.remainingPhotos ?? 8;

    if (files.length > allowed) {
        Swal.fire({
            icon: 'warning',
            title: 'Too many images!',
            text: `You selected ${files.length} images, but only ${allowed} can be added.`,
            confirmButtonText: 'OK'
        }).then(() => {
            files = files.slice(0, allowed);
            let dataTransfer = new DataTransfer();
            files.forEach(file => dataTransfer.items.add(file));
            e.target.files = dataTransfer.files;
            previewFiles(e.target, 'newCoverPreview', 'images');
        });
    } else {
        previewFiles(this, 'newCoverPreview', 'images');
    }
});

// Initialize remaining count on page load
updateRemainingCount();

    </script>
@endsection
