@extends('layouts.structure')

@section('title', 'Create Country - Qikleadz')

@section('content')
    <div class="container">
        <div class="row justify-content-center">
            <div class="col-md-8">
                <div class="card">
                    <div class="card-header">Create Country</div>
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

                        <!-- Single Country Form -->
                        <form method="POST" action="{{ route('country.store') }}" enctype="multipart/form-data">
                            @csrf
                            <div class="form-group">
                                <label for="name">Name</label>
                                <input type="text" name="name" id="name" class="form-control" required
                                    oninput="this.value = this.value.replace(/[0-9]/g, '')"
                                    placeholder="Enter country name">

                            </div>

                            <button type="submit" class="btn btn-primary mt-3">Submit</button>
                            <a href="{{ route('country.index') }}" class="btn btn-secondary mt-3">Back</a>
                        </form>

                        <hr>
                    </div>
                </div>
            </div>
        </div>
    </div>
@endsection
