@extends('layouts.structure')

@section('title', 'Create Country - Rocker')

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
                                <input type="text" name="name" id="name" class="form-control" required>
                            </div>
                            {{-- <div class="form-group">
                                <label for="flag">Flag (Optional)</label>
                                <input type="file" name="flag" id="flag" class="form-control-file" accept="image/*">
                            </div> --}}
                            <button type="submit" class="btn btn-primary mt-3">Submit</button>
                            <a href="{{ route('country.index') }}" class="btn btn-secondary mt-3">Back</a>
                        </form>

                        <hr>

                        <!-- Bulk Upload Form -->
                        {{-- <h4>Bulk Upload Countries (CSV)</h4> --}}
                        {{-- <form method="POST" action="{{ route('country.bulkUpload') }}" enctype="multipart/form-data">
                            @csrf
                            <div class="form-group">
                                <label for="csv_file">Upload CSV File</label>
                                <input type="file" name="csv_file" id="csv_file" class="form-control-file" accept=".csv"
                                    required>
                                <small class="form-text text-muted">
                                    CSV file should have a header row with "name" column.
                                    Example: <br>
                                    name<br>
                                    United States<br>
                                    Canada<br>
                                    ...
                                </small>
                            </div>
                            <button type="submit" class="btn btn-success mt-3">Upload CSV</button>
                        </form> --}}
                    </div>
                </div>
            </div>
        </div>
    </div>
@endsection
