@extends('layouts.structure')

@section('title', 'Create Country - Rocker')
<style>
#description {
    min-height: 200px;
    resize: vertical; /* user can drag to resize */
}
</style>

@section('content')
<div class="container">
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
                    <form method="POST" action="{{ route('feature.store') }}">
                        @csrf
                        <div class="form-group mt-4">
                            <label for="brand_id">Brand</label>
                            <select name="brand_id" id="brand_id" class="form-control" required onchange="getVariants(this.value)">
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

                        <div class="form-group">
                            <label for="name">TiTle</label>
                            <input type="text" name="title" id="title" class="form-control" required>
                        </div>

                        <div class="form-group">
                            <label for="description">Description</label>
                            <textarea name="description" id="description" class="form-control" rows="6"></textarea>
                        </div>



                        <button type="submit" class="btn btn-primary mt-3">Submit</button>
                        <a href="{{ route('feature.index') }}" class="btn btn-secondary mt-3">Back</a>
                    </form>
                </div>
            </div>
        </div>
    </div>
</div>


{{-- Add CKEditor --}}
<script src="https://cdn.ckeditor.com/4.22.1/standard/ckeditor.js"></script>
<script>
    CKEDITOR.replace('description');
</script>


        <script type="text/javascript">
            function getVariants(brand_id)
            {
                // alert(brand_id);
                var url = '{{ route("getByBrandSelectVariant",[':brand_id']) }}';
                url = url.replace(':brand_id',brand_id);
                 
                if(brand_id) {
                    $.ajax({
                        url: url,
                        type: "GET",
                        dataType: "json",

                        success:function(data) {
                            $('select[name="variant_id"]').empty();
                            $('select[name="variant_id"]').prepend('<option value="">--Select Variat Variant--</option>');
                            $.each(data, function(key, value) {
                                $('select[name="variant_id"]').append('<option value="'+ key +'">'+ value +'</option>');
                            });
                        }
                    });
                } else{
                    $('select[name="variant_id"]').empty();
                }
            }
</script>


@endsection