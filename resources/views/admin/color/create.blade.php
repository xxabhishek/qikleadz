@extends('layouts.structure')

@section('title', 'Create Country - Qikleadz')

@section('content')
    <div class="container">
        <div class="row justify-content-center">
            <div class="col-md-8">
                <div class="card">
                    <div class="card-header">Create Color</div>
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
                        <form method="POST" action="{{ route('color.store') }}">
                            @csrf


                            <div class="form-group">
                                <label for="name">Name</label>
                                <input type="text" name="name" id="name" class="form-control" required
                                    oninput="this.value = this.value.replace(/[^a-zA-Z\s]/g, '')" placeholder="Enter name">
                            </div>



                            <div class="form-group">
                                <h5>Select Colour Code <span class="text-danger">*</span></h5>
                                <div class="controls">
                                    <input class="form-control" name="color_code" id="color_code" type="color"
                                        value="{{ old('color_code', '#563d7c') }}">
                                </div>
                            </div>

                            <button type="submit" class="btn btn-primary mt-3">Submit</button>
                            <a href="{{ route('color.index') }}" class="btn btn-secondary mt-3">Back</a>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
@endsection