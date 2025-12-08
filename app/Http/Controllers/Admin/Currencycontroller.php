<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Currency;
use App\Models\Country;
use Illuminate\Http\Request;

class CurrencyController extends Controller
{
    public function index()
    {
        $currencies = Currency::with('country')->get();
        return view('admin.currency.index', compact('currencies'));
    }

    public function create()
    {
        $countries = Country::all();
        return view('admin.currency.create', compact('countries'));
    }

    public function store(Request $request)
    {
        $request->validate([
            'country_id' => 'required',
            'currency' => 'required|string|max:255',
        ]);

        Currency::create($request->all());

        return redirect()->route('currency.index')
            ->with('success', 'Currency added successfully.');
    }

    public function show($id)
    {
        return redirect()->route('currency.index');
    }

    public function edit($id)
    {
        $currency = Currency::findOrFail($id);
        $countries = Country::all();

        return view('admin.currency.edit', compact('currency', 'countries'));
    }

    public function update(Request $request, $id)
    {
        // dd($request->all());
        $request->validate([
            'country_id' => 'required',
            'currency' => 'required|string|max:255',
        ]);

        $currency = Currency::findOrFail($id);
        $currency->update($request->all());

        return redirect()->route('currency.index')
            ->with('success', 'Currency updated successfully.');
    }

    public function destroy($id)
    {
        Currency::findOrFail($id)->delete();

        return redirect()->route('currency.index')
            ->with('success', 'Currency deleted successfully.');
    }
}
