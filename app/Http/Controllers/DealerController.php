<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Lead;
use App\Models\User;
use Illuminate\Support\Facades\Auth;

class DealerController extends Controller
{
    public function __construct()
    {
        $this->middleware(['auth']);
    }

    /**
     * Display dealer dashboard
     */
    public function dashboard()
    {
        $dealer = Auth::user();

        // REMOVE THIS BLOCK ENTIRELY
        // if ($dealer->role != 3) {
        //     Auth::logout();
        //     return redirect()->route('login')->with('error', 'Unauthorized access. Dealer only.');
        // }

        // Get leads where this user is the dealer
        $leads = Lead::where('dealer_id', $dealer->id)
            ->with(['oem', 'city', 'executive', 'distributor'])
            ->orderBy('created_at', 'desc')
            ->limit(10)
            ->get();

        // Statistics
        $totalLeads = Lead::where('dealer_id', $dealer->id)->count();
        $newLeads = Lead::where('dealer_id', $dealer->id)->where('status', 'new')->count();
        $convertedLeads = Lead::where('dealer_id', $dealer->id)->where('status', 'converted')->count();
        $pendingLeads = Lead::where('dealer_id', $dealer->id)->where('status', 'pending')->count();
        $openLeads = Lead::where('dealer_id', $dealer->id)->whereIn('status', ['new', 'pending', 'follow_up'])->count();
        $unrealizedLeads = Lead::where('dealer_id', $dealer->id)->where('status', 'lost')->count();

        $distributor = User::find($dealer->parent_id);

        return view('frontend.dealer-dashboard', [
            'dealer' => $dealer,
            'userName' => $dealer->name,
            'leads' => $leads,
            'totalLeads' => $totalLeads,
            'TotalAssignLeads' => $totalLeads,
            'newLeads' => $newLeads,
            'convertedLeads' => $convertedLeads,
            'pendingLeads' => $pendingLeads,
            'openLeads' => $openLeads,
            'unrealizedLeads' => $unrealizedLeads,
            'distributor' => $distributor
        ]);
    }

    /**
     * Show dealer's leads
     */
    public function leads(Request $request)
    {
        $dealer = Auth::user();

        if ($dealer->role != 3) {
            Auth::logout();
            return redirect()->route('login')->with('error', 'Unauthorized access.');
        }

        $query = Lead::where('dealer_id', $dealer->id)
            ->with(['oem', 'city', 'executive', 'distributor']);

        // Apply filters
        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        if ($request->filled('search')) {
            $query->where(function ($q) use ($request) {
                $q->where('customer_name', 'like', '%' . $request->search . '%')
                    ->orWhere('phone_no', 'like', '%' . $request->search . '%')
                    ->orWhere('address', 'like', '%' . $request->search . '%');
            });
        }

        $leads = $query->orderBy('created_at', 'desc')->paginate(15);

        // ✅ FIX: Update view path for leads too
        // return view('frontend.dealer.dealer-leads', compact('leads'));
        return view('dealer.dealer-leads', compact('leads'));
    }

    /**
     * Show lead details
     */
    public function showLead($id)
    {
        $dealer = Auth::user();

        if ($dealer->role != 3) {
            return redirect()->route('login')->with('error', 'Unauthorized access.');
        }

        $lead = Lead::where('dealer_id', $dealer->id)
            ->with(['oem', 'city', 'executive', 'distributor'])
            ->findOrFail($id);

        // ✅ FIX: Update view path
        return view('frontend.dealer.lead-show', compact('lead'));
    }

    /**
     * Update lead status
     */
    // public function updateLeadStatus(Request $request, $id)
    // {
    //     $dealer = Auth::user();

    //     if (!$dealer->hasRole('Dealer')) {
    //         return redirect()->route('home')->with('error', 'Unauthorized access.');
    //     }

    //     $lead = Lead::where('dealer_id', $dealer->id)->findOrFail($id);

    //     $request->validate([
    //         'status' => 'required|in:new,pending,follow_up,converted,lost',
    //         'additional_note' => 'nullable|string'
    //     ]);

    //     $lead->update([
    //         'status' => $request->status,
    //         'additional_note' => $request->additional_note ?: $lead->additional_note
    //     ]);

    //     return redirect()->back()->with('success', 'Lead status updated successfully.');
    // }

    // /**
    //  * Get statistics for dashboard
    //  */
    // public function getStatistics()
    // {
    //     $dealer = Auth::user();

    //     if (!$dealer->hasRole('Dealer')) {
    //         return response()->json(['error' => 'Unauthorized'], 403);
    //     }

    //     $stats = [
    //         'total' => Lead::where('dealer_id', $dealer->id)->count(),
    //         'new' => Lead::where('dealer_id', $dealer->id)->where('status', 'new')->count(),
    //         'converted' => Lead::where('dealer_id', $dealer->id)->where('status', 'converted')->count(),
    //         'pending' => Lead::where('dealer_id', $dealer->id)->where('status', 'pending')->count(),
    //         'follow_up' => Lead::where('dealer_id', $dealer->id)->where('status', 'follow_up')->count(),
    //         'lost' => Lead::where('dealer_id', $dealer->id)->where('status', 'lost')->count(),
    //     ];

    //     return response()->json($stats);
    // }
}
