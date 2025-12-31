@extends('layouts.structure')

@section('title', 'Leads - Qikleadz')

@section('content')
    <div class="container">
        <div class="row justify-content-center">
            <div class="col-md-10">
                <div class="card">
                    <!-- Header -->
                    <div class="card-header d-flex justify-content-between align-items-center">
                        <span>Lead List</span>
                        <a href="{{ route('lead.create') }}" class="btn btn-primary btn-sm">+ Add Lead</a>
                    </div>

                    <div class="card-body">
                        <!-- Success Message -->
                        @if (session('success'))
                            <div class="alert alert-success">{{ session('success') }}</div>
                        @endif

                        <!-- Lead Table -->
                        <table class="table table-bordered table-striped">
                            <thead>
                                <tr>
                                    <th>Sr. No</th>
                                    <th>Customer Name</th>
                                    <th>Phone Number</th>
                                    <th>Location</th>
                                    <th>Purchase Date</th>
                                    <th>Quantity</th>
                                    <th>Payment Mode</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                @forelse($leads as $lead)
                                    <tr>
                                        <td>{{ $loop->iteration }}</td>
                                        <td>{{ $lead->customer_name }}</td>
                                        <td>{{ $lead->phone_no }}</td>
                                        <td>{{ $lead->location }}</td>
                                        <td>{{ $lead->tentative_purchase_date ? \Carbon\Carbon::parse($lead->tentative_purchase_date)->format('d-m-Y') : '-' }}
                                        </td>
                                        <td>{{ $lead->vehicle_qty }}</td>
                                        <td>{{ ucfirst($lead->payment_mode) }}</td>
                                        <td>
                                            <a href="{{ route('lead.edit', $lead->id) }}"
                                                class="btn btn-sm btn-warning">Edit</a>
                                            <form action="{{ route('lead.destroy', $lead->id) }}" method="POST"
                                                class="d-inline">
                                                @csrf
                                                @method('DELETE')
                                                <button type="submit" onclick="return confirm('Are you sure?')"
                                                    class="btn btn-sm btn-danger">Delete</button>
                                            </form>
                                        </td>
                                    </tr>
                                @empty
                                    <tr>
                                        <td colspan="8" class="text-center">No Leads Found</td>
                                    </tr>
                                @endforelse
                            </tbody>
                        </table>

                    </div>
                </div>
            </div>
        </div>
    </div>
@endsection