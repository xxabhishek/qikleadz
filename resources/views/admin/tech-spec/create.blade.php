@extends('layouts.structure')

@section('title', 'Create Country - Qikleadz')

@section('content')
    <div class="container">
        <div class="row justify-content-center">
            <div class="col-md-8">
                <div class="card">
                    <div class="card-header">Create Tech Spec</div>
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
                        <form method="POST" action="{{ route('tech-spec.store') }}">
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

                            {{-- Variant --}}
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
                                                                <label for="name">TiTle</label>
                                                                <input type="text" name="title" id="title" class="form-control" required>
                                                            </div>

                                                            <div class="form-group">
                                                                <label for="description">Description</label>
                                                                <textarea name="description" id="description" class="form-control" rows="6"></textarea>
                                                            </div>           -->

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
                            <a href="{{ route('tech-spec.index') }}" class="btn btn-secondary mt-3">Back</a>
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