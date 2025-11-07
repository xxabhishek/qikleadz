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
                    // Decode cover photos
                    $coverPhotos = $gallery->cover_photos ?? [];
                    if (!is_array($coverPhotos)) {
                        $coverPhotos = !empty($coverPhotos) ? json_decode($coverPhotos, true) : [];
                    }
                    if (!is_array($coverPhotos)) {
                        $coverPhotos = [];
                    }

                    // Decode uploaded videos
                    $videos = $gallery->upload_videos ?? [];
                    if (!is_array($videos)) {
                        $videos = !empty($videos) ? json_decode($videos, true) : [];
                    }
                    if (!is_array($videos)) {
                        $videos = [];
                    }

                    // Merge all media together
                    $mediaFiles = array_merge($coverPhotos, $videos);
                @endphp

                @if(count($mediaFiles) > 0)
                    <div class="text-center mb-4">
                        <h5 class="fw-bold mb-3">Media Files</h5>
                    </div>

                    <div class="d-flex align-items-center mb-4">
                        @if(count($mediaFiles) > 1)
                            <button id="prevBtn" class="btn btn-dark me-2">&lt;</button>
                        @endif

                        <div class="overflow-hidden flex-grow-1">
                            <div id="mediaRow" class="d-flex" style="gap:15px; transition: transform 0.3s ease;">
                                @foreach($mediaFiles as $file)
                                    @php $ext = strtolower(pathinfo($file, PATHINFO_EXTENSION)); @endphp
                                    <div style="flex:0 0 auto;">
                                        {{-- 🎥 Video Files --}}
                                        @if(in_array($ext, ['mp4', 'avi', 'mov', 'mkv', 'webm', 'wmv']))
                                            <div class="position-relative rounded shadow-sm overflow-hidden"
                                                style="width:300px; height:200px; background:#000;">
                                                <video controls preload="metadata"
                                                    style="width:100%; height:100%; object-fit:cover; border-radius:8px;">
                                                    @if(file_exists(public_path('uploads/galleryVideos/' . $file)))
                                                        <source src="{{ asset('uploads/galleryVideos/' . $file) }}" type="video/mp4">
                                                    @elseif(file_exists(public_path('uploads/coverPhotos/' . $file)))
                                                        <source src="{{ asset('uploads/coverPhotos/' . $file) }}" type="video/mp4">
                                                    @endif
                                                    Your browser does not support the video tag.
                                                </video>
                                                <div
                                                    class="position-absolute bottom-0 start-0 end-0 text-center bg-dark bg-opacity-50 text-white small py-1">
                                                    Video Preview
                                                </div>
                                            </div>

                                            {{-- 📄 PDF Files --}}
                                        @elseif($ext === 'pdf')
                                            <embed src="{{ asset('uploads/coverPhotos/' . $file) }}" type="application/pdf"
                                                width="300px" height="200px" class="rounded shadow-sm border">

                                            {{-- 🖼️ Image Files --}}
                                        @else
                                            <div class="rounded shadow-sm border overflow-hidden"
                                                style="width:300px; height:200px; cursor:pointer;">
                                                <img src="{{ asset('uploads/coverPhotos/' . $file) }}" class="view360"
                                                    data-img="{{ asset('uploads/coverPhotos/' . $file) }}"
                                                    style="width:100%; height:100%; object-fit:cover;">
                                            </div>
                                        @endif
                                    </div>
                                @endforeach
                            </div>
                        </div>

                        @if(count($mediaFiles) > 1)
                            <button id="nextBtn" class="btn btn-dark ms-2">&gt;</button>
                        @endif
                    </div>

                    {{-- ✅ Scroll Script --}}
                    @if(count($mediaFiles) > 1)
                        <script>
                            const mediaRow = document.getElementById('mediaRow');
                            const prevBtn = document.getElementById('prevBtn');
                            const nextBtn = document.getElementById('nextBtn');
                            let scrollAmount = 0;
                            const scrollStep = 315;

                            prevBtn?.addEventListener('click', () => {
                                scrollAmount = Math.max(scrollAmount - scrollStep, 0);
                                mediaRow.style.transform = `translateX(-${scrollAmount}px)`;
                            });

                            nextBtn?.addEventListener('click', () => {
                                const maxScroll = mediaRow.scrollWidth - mediaRow.parentElement.clientWidth;
                                scrollAmount = Math.min(scrollAmount + scrollStep, maxScroll);
                                mediaRow.style.transform = `translateX(-${scrollAmount}px)`;
                            });
                        </script>
                    @endif
                @else
                    <p class="text-muted">No media available for this gallery.</p>
                @endif

                {{-- ✅ Gallery Info --}}
                <div class="mt-4">
                    <h5 class="fw-bold mb-3 text-center">Gallery Information</h5>

                    <div class="table-responsive">
                        <table class="table table-bordered table-striped align-middle">
                            <tbody>
                                <tr>
                                    <th width="200">ID</th>
                                    <td>{{ $gallery->id }}</td>
                                </tr>
                                <tr>
                                    <th>OEM</th>
                                    <td>{{ $gallery->oem->name ?? '-' }}</td>
                                </tr>
                                <tr>
                                    <th>Brand</th>
                                    <td>{{ $gallery->brand->name ?? '-' }}</td>
                                </tr>
                                <tr>
                                    <th>Variant</th>
                                    <td>{{ $gallery->variant->name ?? '-' }}</td>
                                </tr>
                                <tr>
                                    <th>Color</th>
                                    <td>
                                        @if($gallery->color)
                                            <span class="d-inline-block rounded-circle border border-dark"
                                                style="background-color: {{ $gallery->color->code ?? '#ccc' }};
                                                                             width:25px; height:25px; vertical-align:middle; margin-right:10px;">
                                            </span>
                                            {{ $gallery->color->name }}
                                        @else
                                            -
                                        @endif
                                    </td>
                                </tr>
                                <tr>
                                    <th>Fuel Type</th>
                                    <td>{{ $gallery->fuelType->name ?? '-' }}</td>
                                </tr>
                                <tr>
                                    <th>Created At</th>
                                    <td>{{ $gallery->created_at ? $gallery->created_at->format('d M Y, h:i A') : '-' }}</td>
                                </tr>
                                <tr>
                                    <th>Updated At</th>
                                    <td>{{ $gallery->updated_at ? $gallery->updated_at->format('d M Y, h:i A') : '-' }}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>
        </div>
    </div>

    {{-- ✅ 360° Image Modal --}}
    <div class="modal fade" id="viewerModal" tabindex="-1" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered modal-xl">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">360° Image Viewer</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body p-0" style="height:80vh;">
                    <div id="viewerContainer" style="width:100%; height:100%;"></div>
                </div>
            </div>
        </div>
    </div>

@endsection

@section('scripts')
    {{-- ✅ 360° Viewer Libraries --}}
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/photo-sphere-viewer@4/dist/photo-sphere-viewer.css">
    <script src="https://cdn.jsdelivr.net/npm/uevent@2/browser.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/three@0.149.0/build/three.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/photo-sphere-viewer@4/dist/photo-sphere-viewer.js"></script>

    <script>
        document.addEventListener('DOMContentLoaded', function () {
            let viewer = null;

            document.querySelectorAll('.view360').forEach(img => {
                img.addEventListener('click', function () {
                    const imageUrl = this.dataset.img;
                    const modal = new bootstrap.Modal(document.getElementById('viewerModal'));
                    modal.show();

                    setTimeout(() => {
                        if (viewer) viewer.destroy();
                        viewer = new PhotoSphereViewer.Viewer({
                            container: document.getElementById('viewerContainer'),
                            panorama: imageUrl,
                            navbar: ['zoom', 'move', 'fullscreen'],
                            defaultZoomLvl: 0,
                            mousewheel: true,
                            touchmoveTwoFingers: true,
                        });
                    }, 400);
                });
            });
        });
    </script>
@endsection
