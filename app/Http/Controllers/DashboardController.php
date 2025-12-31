<?php
// app/Http/Controllers/DashboardController.php - FIXED FOR YOUR DATA

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Lead;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class DashboardController extends Controller
{
    /**
     * Distributor Dashboard - HANDLES ALL DISTRIBUTORS
     */
    public function distributorDashboard()
    {
        $user = Auth::user();

        // Check if user can access distributor dashboard
        // In your system: role 2 = distributor, role 4 = executive (but acting as distributor)
        $allowedRoles = [2, 4]; // Both are distributors in your system
        if (!in_array($user->role, $allowedRoles)) {
            abort(403, 'Access denied. You must be a distributor.');
        }

        // Method 1: Get leads where this user is distributor_id
        $leadsAsDistributor = Lead::where('distributor_id', $user->id);

        // Method 2: Get leads through dealers under this distributor
        $dealerIds = User::where('parent_id', $user->id)
            ->where('role', 3) // dealers
            ->pluck('id');

        $leadsThroughDealers = Lead::whereIn('dealer_id', $dealerIds);

        // Combine both methods to get ALL leads
        $totalLeads = $leadsAsDistributor->count() + $leadsThroughDealers->count();

        // Get comprehensive statistics
        $stats = $this->getDistributorStats($user);

        // Get dealers under this distributor
        $dealers = User::where('parent_id', $user->id)
            ->where('role', 3)
            ->withCount([
                'assignedLeads as total_leads',
                'assignedLeads as open_leads' => function ($query) {
                    $query->where('status', 'open');
                },
                'assignedLeads as converted_leads' => function ($query) {
                    $query->where('status', 'converted');
                }
            ])
            ->get();

        // Get all leads for this distributor (both direct and through dealers)
        $allLeads = Lead::where(function ($query) use ($user, $dealerIds) {
            $query->where('distributor_id', $user->id)
                ->orWhereIn('dealer_id', $dealerIds);
        })
            ->with(['dealer', 'distributor'])
            ->orderBy('created_at', 'desc')
            ->get();

        // Get pending leads
        $pendingLeads = $allLeads->whereIn('status', ['open', 'in-progress'])->take(10);

        // Debug information
        $debugInfo = [
            'user_id' => $user->id,
            'user_name' => $user->name,
            'user_role' => $user->role,
            'parent_id' => $user->parent_id,
            'direct_leads' => $leadsAsDistributor->count(),
            'dealer_leads' => $leadsThroughDealers->count(),
            'total_leads' => $totalLeads,
            'dealer_count' => $dealers->count(),
        ];

        return view('distributor.dashboard', compact(
            'user',
            'stats',
            'dealers',
            'pendingLeads',
            'allLeads',
            'debugInfo'
        ));
    }

    /**
     * Get comprehensive distributor statistics
     */
    private function getDistributorStats($distributor)
    {
        // Get leads where distributor_id matches
        $directLeads = Lead::where('distributor_id', $distributor->id);

        // Get leads through dealers
        $dealerIds = User::where('parent_id', $distributor->id)
            ->where('role', 3)
            ->pluck('id');

        $dealerLeads = Lead::whereIn('dealer_id', $dealerIds);

        // Combine counts
        return [
            'total' => $directLeads->count() + $dealerLeads->count(),
            'open' => $directLeads->clone()->where('status', 'open')->count() +
                $dealerLeads->clone()->where('status', 'open')->count(),
            'in_progress' => $directLeads->clone()->where('status', 'in-progress')->count() +
                $dealerLeads->clone()->where('status', 'in-progress')->count(),
            'converted' => $directLeads->clone()->where('status', 'converted')->count() +
                $dealerLeads->clone()->where('status', 'converted')->count(),
            'unrealized' => $directLeads->clone()->where('status', 'unrealized')->count() +
                $dealerLeads->clone()->where('status', 'unrealized')->count(),
        ];
    }

    /**
     * Fix Data Relationship Issue
     * Run this once to fix parent-child relationships
     */
    public function fixRelationships()
    {
        // Get all leads with distributor_id but no parent relationship
        $leads = Lead::whereNotNull('distributor_id')
            ->whereNotNull('dealer_id')
            ->get();

        $fixed = 0;

        foreach ($leads as $lead) {
            $dealer = User::find($lead->dealer_id);
            $distributor = User::find($lead->distributor_id);

            if ($dealer && $distributor && $dealer->parent_id != $distributor->id) {
                // Update dealer's parent_id to match distributor
                $dealer->update(['parent_id' => $distributor->id]);
                $fixed++;
            }
        }

        return response()->json([
            'message' => "Fixed $fixed dealer-distributor relationships",
            'status' => 'success'
        ]);
    }

    /**
     * Universal lead assignment function
     */
    public function assignLeadToDealer(Request $request)
    {
        $request->validate([
            'lead_id' => 'required|exists:leads,id',
            'dealer_id' => 'required|exists:users,id',
        ]);

        $lead = Lead::find($request->lead_id);
        $dealer = User::find($request->dealer_id);
        $distributor = auth()->user();

        // Ensure dealer is under this distributor
        if ($dealer->parent_id != $distributor->id) {
            // If not, update the relationship
            $dealer->update(['parent_id' => $distributor->id]);
        }

        // Update lead with BOTH dealer_id and distributor_id
        $lead->update([
            'dealer_id' => $dealer->id,
            'distributor_id' => $distributor->id,
            'status' => 'assigned',
            'assigned_at' => now(),
        ]);

        return redirect()->back()->with('success', 'Lead assigned successfully');
    }
}