@extends('layouts.structure')

@section('title', 'Create Feature - Rocker')

<style>
    .panel-box {
        border: 1px solid #ddd;
        padding: 15px;
        margin-bottom: 15px;
        position: relative;
    }
    .panel-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 10px;
    }
</style>

@section('content')
<div class="container">
    <div class="row justify-content-center">
        <div class="col-md-10">
            <div class="card">
                <div class="card-header d-flex justify-content-between align-items-center">
                    <span>Create Feature Panels</span>
                    <button type="button" class="btn btn-success btn-sm" id="add-panel">+ Add New Panel</button>
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

                    <form method="POST" action="{{ route('feature.store') }}">
                        @csrf

                        {{-- Brand --}}
                        <div class="form-group mt-2">
                            <label for="brand_id">Brand</label>
                            <select name="brand_id" id="brand_id" class="form-control" required>
                                <option value="">Select Brand</option>
                                @foreach ($brands as $brand)
                                    <option value="{{ $brand->id }}">{{ $brand->name }}</option>
                                @endforeach
                            </select>
                        </div>

                        {{-- Variant --}}
                        <div class="form-group mt-2">
                            <label for="variant_id">Variant</label>
                            <select name="variant_id" id="variant_id" class="form-control" required>
                                <option value="">Select Variant</option>
                                @foreach ($variants as $variant)
                                    <option value="{{ $variant->id }}">{{ $variant->name }}</option>
                                @endforeach
                            </select>
                        </div>

                        {{-- Panels Container --}}
                        <div id="panels-wrapper">
                            <div class="panel-box" data-index="0">
                                <div class="panel-header">
                                    <strong>Panel 1</strong>
                                    <button type="button" class="btn btn-danger btn-sm remove-panel">Remove</button>
                                </div>
                                <div class="form-group">
                                    <label>Title</label>
                                    <input type="text" name="panels[0][title]" class="form-control" required>
                                </div>
                                <div class="form-group">
                                    <label>Description</label>
                                    <textarea name="panels[0][description]" class="form-control panel-description" rows="4" required></textarea>
                                </div>
                            </div>
                        </div>

                        <button type="submit" class="btn btn-primary mt-3">Submit</button>
                        <a href="{{ route('feature.index') }}" class="btn btn-secondary mt-3">Back</a>
                    </form>
                </div>
            </div>
        </div>
    </div>
</div>

{{-- SweetAlert2 --}}
<script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
{{-- CKEditor --}}
<script src="https://cdn.ckeditor.com/4.22.1/standard/ckeditor.js"></script>

<script>
let panelIndex = 0;

// Initialize CKEditor for existing textarea
CKEDITOR.replace('panels[0][description]');

// Add new panel
document.getElementById('add-panel').addEventListener('click', function() {
    panelIndex++;
    const wrapper = document.getElementById('panels-wrapper');

    const panelHTML = `
    <div class="panel-box" data-index="${panelIndex}">
        <div class="panel-header">
            <strong>Panel ${panelIndex + 1}</strong>
            <button type="button" class="btn btn-danger btn-sm remove-panel">Remove</button>
        </div>
        <div class="form-group">
            <label>Title</label>
            <input type="text" name="panels[${panelIndex}][title]" class="form-control" required>
        </div>
        <div class="form-group">
            <label>Description</label>
            <textarea name="panels[${panelIndex}][description]" class="form-control panel-description" rows="4" required></textarea>
        </div>
    </div>
    `;

    wrapper.insertAdjacentHTML('beforeend', panelHTML);
    CKEDITOR.replace(`panels[${panelIndex}][description]`);
});

// Remove panel with SweetAlert confirmation
document.addEventListener('click', function(e) {
    if (e.target && e.target.classList.contains('remove-panel')) {
        const panelBox = e.target.closest('.panel-box');

        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, remove it!'
        }).then((result) => {
            if (result.isConfirmed) {
                CKEDITOR.instances[panelBox.querySelector('textarea').name].destroy();
                panelBox.remove();
                // Update Sr. No
                document.querySelectorAll('#panels-wrapper .panel-box').forEach((el, idx) => {
                    el.querySelector('.panel-header strong').textContent = 'Panel ' + (idx + 1);
                });
                Swal.fire('Removed!', 'Panel has been removed.', 'success')
            }
        })
    }
});
</script>

@endsection
