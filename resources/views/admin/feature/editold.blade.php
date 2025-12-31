@extends('layouts.structure')

@section('title', 'Edit Feature - Qikleadz')

@section('content')
<div class="container">
    <div class="row justify-content-center">
        <div class="col-md-8">
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
                    <form method="POST" action="{{ route('feature.update', $features->id) }}">
                        @csrf
                        @method('PUT')

                    {{-- Brand --}}
                        <div class="form-group mt-4">
                            <label for="brand_id">Brand</label>
                            <select name="brand_id" id="brand_id" class="form-control" required onchange="getVariants(this.value)">
                                <option value="">Select Brand</option>
                                @foreach ($brands as $brand)
                                    <option value="{{ $brand->id }}" 
                                        {{ old('brand_id', $features->brand_id) == $brand->id ? 'selected' : '' }}>
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
                                        {{ old('variant_id', $features->variant_id) == $variant->id ? 'selected' : '' }}>
                                        {{ $variant->name }}
                                    </option>
                                @endforeach
                            </select>
                        </div>

                        {{-- Title --}}
                        <div class="form-group">
                            <label for="title">Title</label>
                            <input 
                                type="text" 
                                name="title" 
                                id="title" 
                                class="form-control" 
                                value="{{ old('title', $features->title) }}" 
                                required>
                        </div>

                        {{-- Description --}}
                        <div class="form-group">
                            <label for="description">Description</label>
                            <textarea 
                                name="description" 
                                id="description" 
                                class="form-control" 
                                rows="6">{{ old('description', $features->description) }}</textarea>
                        </div>
                        
                        <button type="submit" class="btn btn-primary mt-3">Update</button>
                        <a href="{{ route('feature.index') }}" class="btn btn-secondary mt-3">Back</a>
                    </form>
                </div>
            </div>
        </div>
    </div>
</div>


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