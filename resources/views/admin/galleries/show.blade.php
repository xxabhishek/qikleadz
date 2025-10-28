@extends('layouts.structure')

@section('title', 'Gallery Details - Rocker')

@section('content')
<div class="container mt-4">
    <div class="card shadow-sm">
        <div class="card-header d-flex justify-content-between align-items-center">
            <h4 class="mb-0">Gallery Details</h4>
            <a href="{{ route('galleries.index') }}" class="btn btn-secondary btn-sm">Back</a>
        </div>
        <div class="card-body">

            @php
                $files = is_array($gallery->cover_photos)
                    ? $gallery->cover_photos
                    : json_decode($gallery->cover_photos, true) ?? [];
            @endphp

            @if(count($files) > 0)
    <div class="d-flex align-items-center mb-4">
        @if(count($files) > 1)
            <button id="prevBtn" class="btn btn-dark me-2">&lt;</button>
        @endif
        <div class="overflow-hidden flex-grow-1">
            <div id="imageRow" class="d-flex" style="gap:10px; transition: transform 0.3s;">
                @foreach($files as $file)
                    @php $ext = strtolower(pathinfo($file, PATHINFO_EXTENSION)); @endphp
                    <div style="flex:0 0 auto;">
                        @if(in_array($ext, ['mp4','avi','mov','mkv']))
                            <video controls style="width:300px; height:200px; object-fit:cover;">
                                <source src="{{ asset('uploads/coverPhotos/' . $file) }}" type="video/mp4">
                            </video>
                        @elseif($ext === 'pdf')
                            <embed src="{{ asset('uploads/coverPhotos/' . $file) }}" type="application/pdf" width="300px" height="200px">
                        @else
                            <img src="{{ asset('uploads/coverPhotos/' . $file) }}" style="width:300px; height:200px; object-fit:cover;" class="rounded shadow-sm">
                        @endif
                    </div>
                @endforeach
            </div>
        </div>
        @if(count($files) > 1)
            <button id="nextBtn" class="btn btn-dark ms-2">&gt;</button>
        @endif
    </div>

    @if(count($files) > 1)
    <script>
        const imageRow = document.getElementById('imageRow');
        const prevBtn = document.getElementById('prevBtn');
        const nextBtn = document.getElementById('nextBtn');
        let scrollAmount = 0;
        const scrollStep = 310; // width + gap

        prevBtn.addEventListener('click', () => {
            scrollAmount = Math.max(scrollAmount - scrollStep, 0);
            imageRow.style.transform = `translateX(-${scrollAmount}px)`;
        });

        nextBtn.addEventListener('click', () => {
            scrollAmount = Math.min(scrollAmount + scrollStep, imageRow.scrollWidth - imageRow.parentElement.clientWidth);
            imageRow.style.transform = `translateX(-${scrollAmount}px)`;
        });
    </script>
    @endif
@else
    <p>No media available</p>
@endif


            {{-- Details Table --}}
            <div class="table-responsive">
                <table class="table table-bordered">
                    <tr><th>ID</th><td>{{ $gallery->id }}</td></tr>
                    <tr><th>OEM</th><td>{{ $gallery->oem->name ?? '-' }}</td></tr>
                    <tr><th>Brand</th><td>{{ $gallery->brand->name ?? '-' }}</td></tr>
                    <tr><th>Variant</th><td>{{ $gallery->variant->name ?? '-' }}</td></tr>
                    <tr><th>Color</th><td>{{ $gallery->color->name ?? '-' }}</td></tr>
                    <tr><th>Fuel Type</th><td>{{ $gallery->fuelType->name ?? '-' }}</td></tr>
                    <tr><th>Created At</th><td>{{ $gallery->created_at->format('d M Y H:i') }}</td></tr>
                    <tr><th>Updated At</th><td>{{ $gallery->updated_at->format('d M Y H:i') }}</td></tr>
                </table>
            </div>

        </div>
    </div>
</div>
@endsection
