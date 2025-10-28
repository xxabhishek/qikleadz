@extends('layouts.structure')

@section('title', 'Edit Feature - Rocker')

@section('styles')
    <link href="https://cdn.jsdelivr.net/npm/summernote@0.9.1/dist/summernote.min.css" rel="stylesheet">
@endsection


@section('content')
<div class="container">
    <div class="row justify-content-center">
        <div class="col-md-10">
            <div class="card">
                <div class="card-header">Edit Feature</div>
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

<form method="POST" action="{{ route('feature.update', $feature->id) }}">
    @csrf
    @method('PUT')

    {{-- Brand --}}
    <div class="form-group mt-4">
        <label for="brand_id">Brand</label>
        <select name="brand_id" id="brand_id" class="form-control" required onchange="getVariants(this.value)">
            <option value="">Select Brand</option>
            @foreach ($brands as $brand)
                <option value="{{ $brand->id }}" {{ old('brand_id', $feature->brand_id) == $brand->id ? 'selected' : '' }}>
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
                <option value="{{ $variant->id }}" {{ old('variant_id', $feature->variant_id) == $variant->id ? 'selected' : '' }}>
                    {{ $variant->name }}
                </option>
            @endforeach
        </select>
    </div>

    {{-- Existing Titles & Descriptions --}}
    <div id="feature-wrapper">
        @foreach ($features as $f)
            <div class="feature-item mb-4 border p-3 rounded">
                <input type="hidden" name="feature_ids[]" value="{{ $f->id }}">

                <div class="form-group">
                    <label>Title</label>
                    <input type="text" name="titles[]" class="form-control"
                           value="{{ old('titles.'.$loop->index, $f->title) }}" required>
                </div>

                <div class="form-group">
                    <label>Description</label>
                    <textarea name="descriptions[]" class="form-control summernote-editor" rows="6">{{ old('descriptions.'.$loop->index, $f->description) }}</textarea>
                </div>

                {{-- Delete Existing Option --}}
                <div class="form-check mt-2">
                    <input type="checkbox" name="delete_ids[]" value="{{ $f->id }}" class="form-check-input" id="delete_{{ $f->id }}">
                    <label for="delete_{{ $f->id }}" class="form-check-label text-danger">
                        Delete this feature
                    </label>
                </div>
            </div>
        @endforeach
    </div>

    {{-- Add New --}}
    <button type="button" class="btn btn-success mt-3" id="add-feature">+ Add More</button><br>

    <button type="submit" class="btn btn-primary mt-3">Update</button>
    <a href="{{ route('feature.index') }}" class="btn btn-secondary mt-3">Back</a>
</form>
                </div>
            </div>
        </div>
    </div>
</div>



@endsection


@section('scripts')
<link href="https://cdn.jsdelivr.net/npm/summernote@0.9.1/dist/summernote.min.css" rel="stylesheet">
<script src="https://cdn.jsdelivr.net/npm/summernote@0.9.1/dist/summernote.min.js"></script>

<script>
    function getVariants(brand_id) {
        var url = '{{ route("getByBrandSelectVariant", [":brand_id"]) }}';
        url = url.replace(':brand_id', brand_id);

        if (brand_id) {
            $.ajax({
                url: url,
                type: "GET",
                dataType: "json",
                success: function(data) {
                    $('select[name="variant_id"]').empty();
                    $('select[name="variant_id"]').prepend('<option value="">--Select Variant--</option>');
                    $.each(data, function(key, value) {
                        $('select[name="variant_id"]').append('<option value="' + key + '">' + value + '</option>');
                    });
                }
            });
        } else {
            $('select[name="variant_id"]').empty();
        }
    }

    $(document).ready(function () {

        $('.summernote-editor').summernote({
            height: 300,
            placeholder: 'Enter activity Judge details...',
            toolbar: [
                ['style', ['style']],
                ['font', ['bold', 'italic', 'underline']],
                ['para', ['ul', 'ol', 'paragraph']],
                ['insert', ['link', 'picture']],
                ['view', ['fullscreen', 'codeview']]
            ]
        });

        // Add More
        $('#add-feature').on('click', function () {
            let newFeature = `
                <div class="feature-item mb-4 border p-3 rounded">
                    <input type="hidden" name="feature_ids[]" value="">
                    <div class="form-group">
                        <label>Title</label>
                        <input type="text" name="titles[]" class="form-control" required>
                    </div>
                    <div class="form-group">
                        <label>Description</label>
                        <textarea name="descriptions[]" class="form-control summernote-editor" rows="6"></textarea>
                    </div>
                    <button type="button" class="btn btn-danger btn-sm remove-feature mt-2">Remove</button>
                </div>
            `;
            $('#feature-wrapper').append(newFeature);

            // initialize summernote for new textarea
            $('.summernote-editor').summernote({
                height: 150
            });
        });

        // Remove
        $(document).on('click', '.remove-feature', function () {
            $(this).closest('.feature-item').remove();
        });

        // Confirm before marking for deletion
        $(document).on('change', 'input[name="delete_ids[]"]', function () {
            if (this.checked) {
                let confirmed = confirm("Are you sure you want to delete this Title And Description?");
                if (!confirmed) {
                    $(this).prop('checked', false); // uncheck if canceled
                }
            }
        });

    });
</script>

@endsection

