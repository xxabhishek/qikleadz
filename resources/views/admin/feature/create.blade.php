@extends('layouts.structure')

@section('title', 'Create Country - Rocker')

@section('styles')
    <style>
        #description-editor-1 {
            min-height: 200px;
            /* Minimum height for the textarea */
            resize: vertical;
            /* Allow vertical resizing */
        }

        /* Ensure Summernote styles are applied correctly with normal size */
        .note-editor.note-frame {
            border: 1px solid #ced4da !important;
            /* Bootstrap default border */
            background: #fff !important;
            border-radius: 0.25rem !important;
            /* Match Bootstrap form-control */
            box-shadow: none !important;
            /* Remove unwanted shadows */
        }

        .note-editor.note-frame .note-editing-area .note-editable {
            background: #fff !important;
            padding: 10px !important;
            /* Standard padding for readability */
            line-height: 1.6 !important;
            /* Normal line spacing */
            font-size: 1rem !important;
            /* Standard font size */
        }

        .note-editor.note-frame:focus {
            border-color: #007bff !important;
            /* Bootstrap focus color */
            box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25) !important;
            /* Focus shadow */
            outline: none !important;
            /* Remove default outline */
        }

        /* Reset red border on validation clear */
        .note-editor.note-frame {
            border-color: #ced4da !important;
        }

        /* Ensure toolbar has normal sizing with smaller icons */
        .note-editor .note-toolbar {
            border-bottom: 1px solid #ced4da !important;
            background-color: #f8f9fa !important;
            /* Light background for toolbar */
            padding: 3px 8px !important;
            /* Reduced padding for compactness */
        }

        .note-editor .note-btn {
            font-size: 0.85rem !important;
            /* Smaller button text size */
            padding: 3px 6px !important;
            /* Reduced padding for smaller buttons */
            height: 24px !important;
            /* Fixed height for consistency */
            line-height: 1 !important;
            /* Adjust line height for icons */
        }

        .note-editor .note-btn i.note-icon {
            font-size: 12px !important;
            /* Normal icon size (adjusted from 4px) */
            width: 12px !important;
            /* Match icon width */
            height: 12px !important;
            /* Match icon height */
            line-height: 12px !important;
            /* Center icon vertically */
        }

        /* Ensure dropdowns and menus are also compact */
        .note-editor .dropdown-menu {
            font-size: 0.85rem !important;
            /* Smaller dropdown text */
            padding: 4px 0 !important;
        }

        .note-editor .dropdown-item {
            padding: 4px 8px !important;
        }
    </style>
@endsection

@section('content')
    <div class="container mt-5"> <!-- Added margin-top for spacing -->
        <div class="row justify-content-center">
            <div class="col-md-8">
                <div class="card">
                    <div class="card-header">Create Feature</div>
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
                        <form method="POST" action="{{ route('feature.store') }}" enctype="multipart/form-data">
                            @csrf
                            <div class="form-group mt-4">
                                <label for="brand_id">Brand</label>
                                <select name="brand_id" id="brand_id" class="form-control" required
                                    onchange="getVariants(this.value)">
                                    <option value="">Select Brand</option>
                                    @foreach ($brands as $brand)
                                        <option value="{{ $brand->id }}">{{ $brand->name }}</option>
                                    @endforeach
                                </select>
                            </div>

                            <div class="form-group mb-3">
                                <label for="variant_id">Variant</label>
                                <select name="variant_id" id="variant_id" class="form-control" required>
                                    <option value="">-- Select Variant --</option>
                                    @foreach ($variants as $variant)
                                        <option value="{{ $variant->id }}">{{ $variant->name }}</option>
                                    @endforeach
                                </select>
                            </div>

                            <!-- <div class="form-group">
                                                                <label for="title">Title</label>
                                                                <input type="text" name="title" id="title" class="form-control" required>
                                                            </div>

                                                            <div class="form-group">
                                                                <label for="description">Description</label>
                                                                <textarea name="description" id="description-editor-1" class="form-control" rows="6"></textarea>
                                                            </div> -->

                            <div id="feature-wrapper">
                                <div class="feature-item mb-4 border p-3 rounded">
                                    <div class="form-group">
                                        <label for="title">Title</label>
                                        <input type="text" name="titles[]" class="form-control" required
                                            oninput="this.value = this.value.replace(/[^A-Za-z\s]/g, '')">

                                    </div>

                                    <div class="form-group">
                                        <label for="description">Description</label>
                                        <textarea name="descriptions[]" class="form-control summernote-editor"
                                            rows="6"></textarea>
                                    </div>

                                    <button type="button" class="btn btn-danger btn-sm remove-feature mt-2">Remove</button>
                                </div>
                            </div>

                            <button type="button" class="btn btn-success mt-3" id="add-feature">+ Add More</button><br>


                            <button type="submit" class="btn btn-primary mt-3">Submit</button>
                            <a href="{{ route('feature.index') }}" class="btn btn-secondary mt-3">Back</a>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
@endsection

@section('scripts')
    <!-- Summernote 0.9.1 CSS and JS -->
    <link href="https://cdn.jsdelivr.net/npm/summernote@0.9.1/dist/summernote.min.css" rel="stylesheet">
    <script src="https://cdn.jsdelivr.net/npm/summernote@0.9.1/dist/summernote.min.js"></script>

    <script>
        $(document).ready(function () {
            // Initialize Summernote for first description
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

            // Add new Title + Description
            $('#add-feature').on('click', function () {
                let newFeature = `
                                <div class="feature-item mb-4 border p-3 rounded">
                                    <div class="form-group">
                                        <label>Title</label>
                                        <input type="text" name="titles[]" class="form-control" required oninput="this.value = this.value.replace(/[^A-Za-z\\s]/g, '')">
                                    </div>

                                    <div class="form-group">
                                        <label>Description</label>
                                        <textarea name="descriptions[]" class="form-control summernote-editor" rows="6"></textarea>
                                    </div>

                                    <button type="button" class="btn btn-danger btn-sm remove-feature mt-2">Remove</button>
                                </div>
                            `;


                $('#feature-wrapper').append(newFeature);

                // Re-init Summernote for new textarea
                $('#feature-wrapper .summernote-editor').last().summernote({
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
            });

            // Remove Title + Description block
            $(document).on('click', '.remove-feature', function () {
                $(this).closest('.feature-item').remove();
            });
        });
    </script>



    <script type="text/javascript">
        function getVariants(brand_id) {
            var url = '{{ route("getByBrandSelectVariant", [":brand_id"]) }}';
            url = url.replace(':brand_id', brand_id);

            if (brand_id) {
                $.ajax({
                    url: url,
                    type: "GET",
                    dataType: "json",
                    success: function (data) {
                        $('select[name="variant_id"]').empty();
                        $('select[name="variant_id"]').prepend('<option value="">-- Select Variant --</option>');
                        $.each(data, function (key, value) {
                            $('select[name="variant_id"]').append('<option value="' + key + '">' + value + '</option>');
                        });
                    },
                    error: function (xhr, status, error) {
                        console.error('Error fetching variants:', error);
                    }
                });
            } else {
                $('select[name="variant_id"]').empty();
                $('select[name="variant_id"]').prepend('<option value="">-- Select Variant --</option>');
            }
        }
    </script>

    <!-- Hide footer and theme switcher for this page -->
    @php
        $hideFooter = true;
        $hideThemeSwitcher = true;
    @endphp
@endsection
