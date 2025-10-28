@extends('layouts.structure')

@section('title', 'Create Lead - Rocker')

@section('content')
<div class="container my-4">
    <div class="row justify-content-center">
        <div class="col-md-10">
            <div class="card shadow-sm">
                <div class="card-header bg-primary text-white">
                    <h5 class="mb-0">Lead Information</h5>
                </div>
                <div class="card-body">
                    <form id="leadForm" action="{{ route('lead.store') }}" method ="POST" enctype="multipart/form-data">
                        @csrf
                        <!-- Customer Info -->
                        <div class="row mb-3">
                            <div class="col-md-6 mb-3">
                                <label for="customerName" class="form-label">Customer Name <span class="text-danger">*</span></label>
                                <input type="text" class="form-control" name="customer_name" id="customerName" placeholder="Enter customer name" required>
                                <input type="hidden" name="vehicle_segment_id" value="{{ $data['vehicle_segment_id'] ?? '' }}">
                                <input type="hidden" name="brand_id" value="{{ $data['brand_id'] ?? '' }}">
                                <input type="hidden" name="variant_id" value="{{ $data['variant_id'] ?? '' }}">
                                <input type="hidden" name="fuel_type_id" value="{{ $data['fuel_type_id'] ?? '' }}">
                                <input type="hidden" name="color" value="{{ $data['color'] ?? '' }}">
                            </div>
                            <div class="col-md-6 mb-3">
                                <label for="phoneNumber" class="form-label">Phone Number <span class="text-danger">*</span></label>
                                <input type="tel" class="form-control" name="phone_no" id="phoneNumber" placeholder="Enter phone number" required>
                            </div>
                        </div>

                        <div class="row mb-3">
                            <div class="col-md-6 mb-3">
                                <label for="customerLocation" class="form-label">Location <span class="text-danger">*</span></label>
                                <input type="text" class="form-control" name="location" id="customerLocation" placeholder="Enter location" required>
                            </div>
                            <div class="col-md-6 mb-3">
                                <label for="purchaseDate" class="form-label">Tentative Purchase Date</label>
                                <input type="date" class="form-control" name="tentative_purchase_date" id="purchaseDate">
                            </div>
                        </div>

                        <div class="row mb-3">
                            <div class="col-md-6 mb-3">
                                <label for="quantity" class="form-label">Quantity</label>
                                <input type="number" class="form-control" name="vehicle_qty"  id="quantity" min="1" value="1">
                            </div>
                            <div class="col-md-6 mb-3">
                                <label class="form-label">Payment Mode</label>
                                <div class="form-check">
                                    <input class="form-check-input" type="radio" name="payment_mode" id="cash" value="cash" checked>
                                    <label class="form-check-label" for="cash">Cash</label>
                                </div>
                                <div class="form-check">
                                    <input class="form-check-input" type="radio" name="payment_mode" id="finance" value="finance">
                                    <label class="form-check-label" for="finance">Finance</label>
                                </div>
                            </div>
                        </div>

                        <div class="row mb-3">
                            <div class="col-md-6 mb-3">
                                <label for="oem" class="form-label">OEM</label>
                                <select class="form-select" id="oem">
                                    <option value="">Select OEM</option>
                                    @foreach($oems as $oem)
                                    <option value="{{ $oem->id }}">{{ $oem->name }}</option>
                                    @endforeach
                                </select>
                            </div>
                            <div class="col-md-6 mb-3">
                                <label for="additionalNotes" class="form-label">Additional Notes</label>
                                <textarea class="form-control" name="additional_note" id="additionalNotes" rows="3" placeholder="Enter any additional notes"></textarea>
                            </div>
                        </div>

                        <!-- Buttons -->
                        <div class="d-flex justify-content-between mt-4">
                            <button type="button" class="btn btn-secondary" id="saveDraft">Save as Draft</button>
                            <button type="button" class="btn btn-info text-white" id="addAnother">Add Another Vehicle</button>
                            <button type="submit" class="btn btn-primary" id="submitLead">Submit Lead</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</div>
@endsection
