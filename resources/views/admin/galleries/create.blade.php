@extends('layouts.structure')
@section('title', 'Create Gallery - Qikleadz')
@section('content')
    <div class="container">
        <div class="row justify-content-center">
            <div class="col-md-10">
                <div class="card">
                    <div class="card-header">+ Add Gallery</div>
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

                        <form action="{{ route('galleries.store') }}" method="POST" enctype="multipart/form-data">
                            @csrf


                            {{-- <div class="form-group mb-3">
                                <label for="oem_id">Select OEM Name </label>
                                <select name="oem_id" id="oem_id" class="form-control">
                                    <option value="">-- Select OEM --</option>
                                    @foreach ($oems as $oem)
                                    <option value="{{ $oem->id }}" {{ isset($gallery) && $gallery->oem_id == $oem->id ?
                                        'selected' : '' }}>
                                        {{ $oem->name }}
                                    </option>
                                    @endforeach
                                </select>
                            </div> --}}

                            {{-- Cover Photos --}}
                            <div class="form-group mb-3">
                                <label>Cover Photos (Max 8)</label>
                                <input type="file" name="cover_photos[]" multiple accept="image/jpeg,image/png,image/jpg"
                                    class="form-control" required>
                                <div id="cover_preview" class="mt-2 d-flex flex-wrap"></div>
                            </div>

                            {{-- Upload Videos --}}
                            <div class="form-group mb-3">
                                <label>Upload Videos (Max 2)</label>
                                <input type="file" name="upload_videos[]" multiple accept="video/mp4" class="form-control">
                                <div id="video_preview" class="mt-2 d-flex flex-wrap"></div>
                            </div>

                            {{-- Brand --}}
                            <div class="form-group mb-3">
                                <label>Brand</label>
                                <select name="brand_id" class="form-control" required onchange="getVariants(this.value)">
                                    <option value="">-- Select Brand --</option>
                                    @foreach ($brands as $brand)
                                        <option value="{{ $brand->id }}">{{ $brand->name }}</option>
                                    @endforeach
                                </select>
                            </div>

                            {{-- Variant --}}
                            <div class="form-group mb-3">
                                <label>Variant</label>
                                <select name="variant_id" id="variant_id" class="form-control" required>
                                    <option value="">-- Select Variant --</option>
                                    @foreach ($variants as $variant)
                                        <option value="{{ $variant->id }}">{{ $variant->name }}</option>
                                    @endforeach
                                </select>
                            </div>

                            {{-- Color --}}
                            <div class="form-group mb-3">
                                <label>Color</label>
                                <select name="color_id" class="form-control" required>
                                    <option value="">-- Select Color --</option>
                                    @foreach ($colors as $color)
                                        <option value="{{ $color->id }}">{{ $color->name }}</option>
                                    @endforeach
                                </select>
                            </div>

                            {{-- Fuel Type --}}
                            <div class="form-group mb-3">
                                <label>Fuel Type</label>
                                <select name="fuel_type_id" class="form-control" required>
                                    <option value="">-- Select Fuel Type --</option>
                                    @foreach ($fuelTypes as $fuel)
                                        <option value="{{ $fuel->id }}">{{ $fuel->name }}</option>
                                    @endforeach
                                </select>
                            </div>

                            <button type="submit" class="btn btn-primary">Save</button>
                            <a href="{{ route('galleries.index') }}" class="btn btn-secondary">Back</a>
                        </form>

                    </div>
                </div>
            </div>
        </div>
    </div>

    <script>
        function previewFiles(input, previewId, maxFiles, type) {
            let files = input.files;
            let preview = document.getElementById(previewId);
            preview.innerHTML = '';
            if (files.length > maxFiles) {
                alert('Maximum ' + maxFiles + ' ' + type + ' allowed.');
                input.value = '';
                return;
            }
            Array.from(files).forEach(file => {
                if (type == 'images' && file.type.startsWith('image/')) {
                    let img = document.createElement('img');
                    img.src = URL.createObjectURL(file);
                    img.style.maxWidth = '120px';
                    img.style.margin = '5px';
                    img.classList.add('img-thumbnail');
                    preview.appendChild(img);
                } else if (type == 'videos' && file.type.startsWith('video/')) {
                    let video = document.createElement('video');
                    video.src = URL.createObjectURL(file);
                    video.controls = true;
                    video.style.maxWidth = '200px';
                    video.style.margin = '5px';
                    preview.appendChild(video);
                }
            });
        }

        document.getElementsByName('cover_photos[]')[0].addEventListener('change', function () {
            previewFiles(this, 'cover_preview', 8, 'images')
        });
        document.getElementsByName('upload_videos[]')[0].addEventListener('change', function () {
            previewFiles(this, 'video_preview', 2, 'videos')
        });
    </script>
@endsection