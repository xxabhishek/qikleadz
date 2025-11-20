@extends('layouts.structure')

@section('title', 'Edit Payment Mode - Rocker')

@section('content')
    <div class="container">
        <div class="row justify-content-center">

            <div class="col-md-8">

                <div class="card">
                    <div class="card-header">Edit Payment Mode</div>

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

                        <form method="POST" action="{{ route('payment-mode.update', $paymentMode->id) }}">
                            @csrf
                            @method('PUT')

                            <div class="form-group mb-3">
                                <label for="name">Payment Mode Name</label>
                                <input type="text"
                                       name="name"
                                       id="name"
                                       class="form-control"
                                       required
                                       value="{{ $paymentMode->name }}"
                                       oninput="this.value = this.value.replace(/[0-9]/g, '')">
                            </div>

                            <button type="submit" class="btn btn-primary mt-2">Update</button>
                            <a href="{{ route('payment-mode.index') }}" class="btn btn-secondary mt-2">Back</a>

                        </form>

                    </div>
                </div>

            </div>

        </div>
    </div>
@endsection
