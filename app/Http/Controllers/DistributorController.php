<?php

namespace App\Http\Controllers;

use App\Models\Notification;
use Illuminate\Http\Request;
use App\Models\Lead;
use App\Models\User;
use App\Models\Claim;
use App\Models\LeadDetail;
use App\Models\Payout;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use PhpOffice\PhpSpreadsheet\Writer\Pdf;
use Storage;

class DistributorController extends Controller
{
    public function __construct()
    {
        $this->middleware(['auth']);
    }


    // public function dashboard()
    // {
    //     $userId = auth()->id();
    //     $user = auth()->user();

    //     if ($user->role != 4) {
    //         Auth::logout();
    //         return redirect()->route('login')->with('error', 'Unauthorized access. Distributor only.');
    //     }

    //     $dealerIds = User::where('role', 3)
    //         ->where('parent_id', $userId)
    //         ->pluck('id')
    //         ->toArray();

    //     // Base query for leads under this distributor
    //     $leadQuery = Lead::where(function ($q) use ($userId, $dealerIds) {
    //         $q->where('distributor_id', $userId)
    //             ->orWhereIn('dealer_id', $dealerIds);
    //     });

    //     // === LEADS STATISTICS ===
    //     $openLeads = $leadQuery->clone()
    //         ->whereIn('status', ['new', 'open', 'pending', 'in-progress', 'follow_up'])
    //         ->count();

    //     $todayOpen = $leadQuery->clone()
    //         ->whereIn('status', ['new', 'open', 'pending', 'in-progress', 'follow_up'])
    //         ->whereDate('created_at', today())
    //         ->count();

    //     $unrealizedLeads = $leadQuery->clone()
    //         ->where('status', 'lost')
    //         ->count();

    //     $todayUnrealized = $leadQuery->clone()
    //         ->where('status', 'lost')
    //         ->whereDate('updated_at', today())
    //         ->count();

    //     // === CONVERTED LEADS BASED ON lead_details.status ===
    //     $convertedLeads = $leadQuery->clone()
    //         ->whereHas('lead_details', function ($q) {
    //             $q->where('status', 'converted');
    //         })
    //         ->count();

    //     $todayConverted = $leadQuery->clone()
    //         ->whereHas('lead_details', function ($q) {
    //             $q->where('status', 'converted')
    //                 ->whereDate('updated_at', today());
    //         })
    //         ->count();

    //     // === CLAIMS / VERIFICATION STATS ===
    //     $claimsPending = $leadQuery->clone()
    //         ->whereHas('lead_details', function ($q) {
    //             $q->where('status', 'converted')
    //                 ->where('verification_status', Lead::VERIFICATION_PENDING);
    //         })
    //         ->count();

    //     $claimsSuccessful = $leadQuery->clone()
    //         ->whereHas('lead_details', function ($q) {
    //             $q->where('status', 'converted')
    //                 ->where('verification_status', Lead::VERIFICATION_SUCCESSFUL);
    //         })
    //         ->count();

    //     $claimsDisputed = $leadQuery->clone()
    //         ->whereHas('lead_details', function ($q) {
    //             $q->where('status', 'converted')
    //                 ->where('verification_status', Lead::VERIFICATION_DISPUTED);
    //         })
    //         ->count();

    //     $claimsRejected = $leadQuery->clone()
    //         ->whereHas('lead_details', function ($q) {
    //             $q->where('status', 'converted')
    //                 ->where('verification_status', Lead::VERIFICATION_REJECTED);
    //         })
    //         ->count();

    //     // Recent pending verification leads (show leads with pending details)
    //     $pendingVerificationLeads = $leadQuery->clone()
    //         ->whereHas('lead_details', function ($q) {
    //             $q->where('status', 'converted')
    //                 ->where('verification_status', 'pending');
    //         })
    //         ->with([
    //             'lead_details' => function ($q) {
    //                 $q->where('status', 'converted')
    //                     ->where('verification_status', 'pending');
    //             }
    //         ])
    //         ->latest('updated_at')
    //         ->limit(10)
    //         ->get();

    //     $pendingDetails = LeadDetail::where('status', 'converted')
    //         ->where('verification_status', 'pending')
    //         ->whereIn('lead_id', function ($q) use ($userId, $dealerIds) {
    //             $q->select('id')
    //                 ->from('leads')
    //                 ->where('distributor_id', $userId)
    //                 ->orWhereIn('dealer_id', $dealerIds);
    //         })
    //         ->with('lead')
    //         ->latest('updated_at')
    //         ->get();

    //     $totalPayoutValue = LeadDetail::where('verification_status', 'successful')
    //         ->whereHas('lead', function ($q) use ($userId, $dealerIds) {
    //             $q->where('distributor_id', $userId)
    //                 ->orWhereIn('dealer_id', $dealerIds);
    //         })
    //         ->sum('total_price');
    //     // === OTHER STATS (claims, payouts, recent leads, sales, incentives) ===
    //     $totalClaims = Claim::where('distributor_id', $userId)->count();
    //     $newClaims = Claim::where('distributor_id', $userId)->where('status', 'pending')->count();
    //     $successfulClaims = Claim::where('distributor_id', $userId)->where('status', 'approved')->count();
    //     $disputedClaims = Claim::where('distributor_id', $userId)->where('status', 'disputed')->count();
    //     $rejectedClaims = Claim::where('distributor_id', $userId)->where('status', 'rejected')->count();

    //     $recentClaims = Claim::where('distributor_id', $userId)
    //         ->where('status', 'pending')
    //         ->with(['lead', 'lead.executive', 'lead.dealer'])
    //         ->orderBy('created_at', 'desc')
    //         ->limit(5)
    //         ->get();

    //     $payouts = User::where('role', 3) // Dealers
    //         ->where('parent_id', $userId) // Distributor che dealers
    //         ->get()
    //         ->map(function ($dealer) {
    //             // Total leads for this dealer
    //             $totalLeads = Lead::where('dealer_id', $dealer->id)->count();

    //             // Converted vehicles (successful verification)
    //             $vehicleSales = LeadDetail::whereHas('lead', function ($q) use ($dealer) {
    //                 $q->where('dealer_id', $dealer->id);
    //             })
    //                 ->where('verification_status', 'successful')
    //                 ->count();

    //             // Claim amount (example: $1000 per vehicle)
    //             $claimAmount = $vehicleSales * 1000;

    //             // Paid amount (60% example)
    //             $paidAmount = $claimAmount * 0.6;

    //             // Balance amount (40%)
    //             $balanceAmount = $claimAmount * 0.4;

    //             return (object) [
    //                 'executive_id' => $dealer->id,
    //                 'executive_name' => $dealer->name,
    //                 'total_leads' => $totalLeads,
    //                 'vehicle_sales' => $vehicleSales,
    //                 'claim_amount' => $claimAmount,
    //                 'paid_amount' => $paidAmount,
    //                 'balance_amount' => $balanceAmount
    //             ];
    //         });
    //     $recentLeads = $leadQuery->clone()
    //         ->with(['executive', 'dealer', 'distributor'])
    //         ->orderBy('created_at', 'desc')
    //         ->limit(5)
    //         ->get();

    //     $currentMonthSales = $leadQuery->clone()
    //         ->whereHas('lead_details', function ($q) {
    //             $q->where('status', 'converted');
    //         })
    //         ->whereMonth('updated_at', now()->month)
    //         ->whereYear('updated_at', now()->year)
    //         ->count() * 10000;

    //     $lastMonthSales = $leadQuery->clone()
    //         ->whereHas('lead_details', function ($q) {
    //             $q->where('status', 'converted');
    //         })
    //         ->whereMonth('updated_at', now()->subMonth()->month)
    //         ->whereYear('updated_at', now()->subMonth()->year)
    //         ->count() * 10000;

    //     $creditNotes = Claim::where('distributor_id', $userId)
    //         ->where('status', 'approved')
    //         ->count();

    //     $incentivePaid = Claim::where('distributor_id', $userId)
    //         ->where('status', 'approved')
    //         ->sum('verified_amount') * 0.1 ?? 0;

    //     return view('distributor.distributor-dashboard', compact(
    //         'openLeads',
    //         'todayOpen',
    //         'convertedLeads',
    //         'todayConverted',
    //         'unrealizedLeads',
    //         'todayUnrealized',
    //         'totalClaims',
    //         'newClaims',
    //         'successfulClaims',
    //         'disputedClaims',
    //         'rejectedClaims',
    //         'payouts',
    //         'recentLeads',
    //         'recentClaims',
    //         'currentMonthSales',
    //         'lastMonthSales',
    //         'creditNotes',
    //         'incentivePaid',
    //         'claimsPending',
    //         'claimsSuccessful',
    //         'claimsDisputed',
    //         'claimsRejected',
    //         'pendingVerificationLeads',
    //         'pendingDetails',
    //         'totalPayoutValue'
    //     ));
    // }


    public function dashboard()
    {

        $userId = auth()->id();

        $user = auth()->user();



        if ($user->role != 4) {

            Auth::logout();

            return redirect()->route('login')->with('error', 'Unauthorized access. Distributor only.');

        }



        $dealerIds = User::where('role', 3)

            ->where('parent_id', $userId)

            ->pluck('id')

            ->toArray();



        // Base query for leads under this distributor

        $leadQuery = Lead::where(function ($q) use ($userId, $dealerIds) {

            $q->where('distributor_id', $userId)

                ->orWhereIn('dealer_id', $dealerIds);

        });



        // === LEADS STATISTICS ===

        $openLeads = $leadQuery->clone()

            ->whereIn('status', ['new', 'open', 'pending', 'in-progress', 'follow_up'])

            ->count();



        $todayOpen = $leadQuery->clone()

            ->whereIn('status', ['new', 'open', 'pending', 'in-progress', 'follow_up'])

            ->whereDate('created_at', today())

            ->count();



        $unrealizedLeads = $leadQuery->clone()

            ->where('status', 'lost')

            ->count();



        $todayUnrealized = $leadQuery->clone()

            ->where('status', 'lost')

            ->whereDate('updated_at', today())

            ->count();



        // === CONVERTED LEADS BASED ON lead_details.status ===

        $convertedLeads = $leadQuery->clone()

            ->whereHas('lead_details', function ($q) {

                $q->where('status', 'converted');

            })

            ->count();



        $todayConverted = $leadQuery->clone()

            ->whereHas('lead_details', function ($q) {

                $q->where('status', 'converted')

                    ->whereDate('updated_at', today());

            })

            ->count();



        // === CLAIMS / VERIFICATION STATS ===

        $claimsPending = $leadQuery->clone()

            ->whereHas('lead_details', function ($q) {

                $q->where('status', 'converted')

                    ->where('verification_status', Lead::VERIFICATION_PENDING);

            })

            ->count();



        $claimsSuccessful = $leadQuery->clone()

            ->whereHas('lead_details', function ($q) {

                $q->where('status', 'converted')

                    ->where('verification_status', Lead::VERIFICATION_SUCCESSFUL);

            })

            ->count();



        $claimsDisputed = $leadQuery->clone()

            ->whereHas('lead_details', function ($q) {

                $q->where('status', 'converted')

                    ->where('verification_status', Lead::VERIFICATION_DISPUTED);

            })

            ->count();



        $claimsRejected = $leadQuery->clone()

            ->whereHas('lead_details', function ($q) {

                $q->where('status', 'converted')

                    ->where('verification_status', Lead::VERIFICATION_REJECTED);

            })

            ->count();



        // Recent pending verification leads (show leads with pending details)

        $pendingVerificationLeads = $leadQuery->clone()

            ->whereHas('lead_details', function ($q) {

                $q->where('status', 'converted')

                    ->where('verification_status', 'pending');

            })

            ->with([

                'lead_details' => function ($q) {

                    $q->where('status', 'converted')

                        ->where('verification_status', 'pending');

                }

            ])

            ->latest('updated_at')

            ->limit(10)

            ->get();



        $pendingDetails = LeadDetail::where('status', 'converted')

            ->where('verification_status', 'pending')

            ->whereIn('lead_id', function ($q) use ($userId, $dealerIds) {

                $q->select('id')

                    ->from('leads')

                    ->where('distributor_id', $userId)

                    ->orWhereIn('dealer_id', $dealerIds);

            })

            ->with('lead')

            ->latest('updated_at')

            ->get();



        $totalPayoutValue = LeadDetail::where('verification_status', 'successful')

            ->whereHas('lead', function ($q) use ($userId, $dealerIds) {

                $q->where('distributor_id', $userId)

                    ->orWhereIn('dealer_id', $dealerIds);

            })

            ->sum('total_price');

        // === OTHER STATS (claims, payouts, recent leads, sales, incentives) ===

        $totalClaims = Claim::where('distributor_id', $userId)->count();

        $newClaims = Claim::where('distributor_id', $userId)->where('status', 'pending')->count();

        $successfulClaims = Claim::where('distributor_id', $userId)->where('status', 'approved')->count();

        $disputedClaims = Claim::where('distributor_id', $userId)->where('status', 'disputed')->count();

        $rejectedClaims = Claim::where('distributor_id', $userId)->where('status', 'rejected')->count();



        $recentClaims = Claim::where('distributor_id', $userId)

            ->where('status', 'pending')

            ->with(['lead', 'lead.executive', 'lead.dealer'])

            ->orderBy('created_at', 'desc')

            ->limit(5)

            ->get();



        // dd($userId,$dealer);

        // $payouts = User::where('role', 3) // Dealers

        //     ->where('parent_id', $userId) // Distributor che dealers

        //     ->get()

        //     ->map(function ($dealer) {

        //         // Total leads for this dealer

        //         $totalLeads = Lead::where('dealer_id', $dealer->id)->count();



        //         // Converted vehicles (successful verification)

        //         $vehicleSales = LeadDetail::whereHas('lead', function ($q) use ($dealer) {

        //             $q->where('dealer_id', $dealer->id);

        //         })

        //             ->where('verification_status', 'successful')

        //             ->count();



        //         // Claim amount (example: $1000 per vehicle)

        //         $claimAmount = $vehicleSales * 1000;



        //         // Paid amount (60% example)

        //         $paidAmount = $claimAmount * 0.6;



        //         // Balance amount (40%)

        //         $balanceAmount = $claimAmount * 0.4;



        //         return (object) [

        //             'executive_id' => $dealer->id,

        //             'executive_name' => $dealer->name,

        //             'total_leads' => $totalLeads,

        //             'vehicle_sales' => $vehicleSales,

        //             'claim_amount' => $claimAmount,

        //             'paid_amount' => $paidAmount,

        //             'balance_amount' => $balanceAmount

        //         ];

        //     });



        // === EXECUTIVE-WISE PAYOUTS - FINAL CORRECTED FOR YOUR DATA STRUCTURE ===

        $distributorId = $userId; // Current logged-in distributor



        // Get all dealer IDs under THIS distributor

        $dealerIds = User::where('role', 3) // 3 = Dealer role ID

            ->where('parent_id', $distributorId)

            ->pluck('id')

            ->toArray();



        // Get all Sales Executives (role = 2) who have leads under this distributor or its dealers

        $payouts = User::where('role', 2) // 2 = Sales Executive role ID

            ->whereHas('executiveLeads', function ($query) use ($distributorId, $dealerIds) {

                $query->where('distributor_id', $distributorId)

                    ->orWhereIn('dealer_id', $dealerIds);

            })

            ->with(['executiveLeads.leadDetails'])

            ->get()

            ->map(function ($executive) {

                $leads = $executive->executiveLeads;



                $totalLeads = $leads->count();



                $vehicleSales = $leads

                    ->pluck('leadDetails')

                    ->flatten()

                    ->where('verification_status', 'successful')

                    ->sum('converted_qty');



                $incentivePerVehicle = 1000;

                $claimAmount = $vehicleSales * $incentivePerVehicle;

                $paidAmount = $claimAmount * 0.6;

                $balanceAmount = $claimAmount * 0.4;



                return (object) [

                    'executive_id' => $executive->id,

                    'executive_name' => $executive->name,

                    'executive_mobile' => $executive->mobile ?? 'N/A',

                    'total_leads' => $totalLeads,

                    'vehicle_sales' => (int) $vehicleSales,

                    'claim_amount' => $claimAmount,

                    'paid_amount' => $paidAmount,

                    'balance_amount' => $balanceAmount,

                ];

            })

            ->filter(fn($p) => $p->total_leads > 0 || $p->vehicle_sales > 0)

            ->sortByDesc('vehicle_sales')

            ->values();



        // dd($payouts->pluck('executive_name', 'vehicle_sales'));



        $recentLeads = $leadQuery->clone()

            ->with(['executive', 'dealer', 'distributor'])

            ->orderBy('created_at', 'desc')

            ->limit(5)

            ->get();



        $currentMonthSales = $leadQuery->clone()

            ->whereHas('lead_details', function ($q) {

                $q->where('status', 'converted');

            })

            ->whereMonth('updated_at', now()->month)

            ->whereYear('updated_at', now()->year)

            ->count() * 10000;



        $lastMonthSales = $leadQuery->clone()

            ->whereHas('lead_details', function ($q) {

                $q->where('status', 'converted');

            })

            ->whereMonth('updated_at', now()->subMonth()->month)

            ->whereYear('updated_at', now()->subMonth()->year)

            ->count() * 10000;



        $creditNotes = Claim::where('distributor_id', $userId)

            ->where('status', 'approved')

            ->count();



        $incentivePaid = Claim::where('distributor_id', $userId)

            ->where('status', 'approved')

            ->sum('verified_amount') * 0.1 ?? 0;



        return view('distributor.distributor-dashboard', compact(

            'openLeads',

            'todayOpen',

            'convertedLeads',

            'todayConverted',

            'unrealizedLeads',

            'todayUnrealized',

            'totalClaims',

            'newClaims',

            'successfulClaims',

            'disputedClaims',

            'rejectedClaims',

            'payouts',

            'recentLeads',

            'recentClaims',

            'currentMonthSales',

            'lastMonthSales',

            'creditNotes',

            'incentivePaid',

            'claimsPending',

            'claimsSuccessful',

            'claimsDisputed',

            'claimsRejected',

            'pendingVerificationLeads',

            'pendingDetails',

            'totalPayoutValue'

        ));

    }



    /**
     * Show all converted leads pending verification (paginated)
     */
    public function pendingVerificationLeads(Request $request)
    {
        $userId = auth()->id();
        $user = auth()->user();

        if ($user->role != 4) {
            return redirect()->route('login')->with('error', 'Unauthorized access.');
        }

        $dealerIds = User::where('role', 3)
            ->where('parent_id', $userId)
            ->pluck('id')
            ->toArray();

        $leadQuery = Lead::where(function ($q) use ($userId, $dealerIds) {
            $q->where('distributor_id', $userId)
                ->orWhereIn('dealer_id', $dealerIds);
        });

        $pendingLeads = $leadQuery->clone()
            ->whereHas('lead_details', function ($q) {
                $q->where('status', 'converted')
                    ->where('verification_status', 'pending');
            })
            ->with([
                'lead_details' => function ($q) {
                    $q->where('status', 'converted')
                        ->where('verification_status', 'pending');
                }
            ])
            ->latest('updated_at')
            ->paginate(15); // Paginate for better performance

        return view('distributor.pending-verification-leads', compact('pendingLeads'));
    }

    /**
     * Show claims for verification
     */
    public function claims(Request $request)
    {
        $user = Auth::user();

        if ($user->role != 4) {
            return redirect()->route('login')->with('error', 'Access Denied.');
        }

        $query = Claim::where('distributor_id', $user->id)
            ->with(['lead', 'lead.executive', 'lead.dealer']);

        // Filter by status
        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        // Filter by date
        if ($request->filled('from_date') && $request->filled('to_date')) {
            $query->whereBetween('created_at', [$request->from_date, $request->to_date]);
        }

        // Search
        if ($request->filled('search')) {
            $query->whereHas('lead', function ($q) use ($request) {
                $q->where('customer_name', 'like', '%' . $request->search . '%')
                    ->orWhere('phone_no', 'like', '%' . $request->search . '%');
            });
        }

        $claims = $query->orderBy('created_at', 'desc')->paginate(20);

        return view('distributor.claims', compact('claims'));
    }

    /**
     * Show claim details
     */
    public function showClaim($id)
    {
        $distributor = Auth::user();

        if ($distributor->role != 4) {
            return redirect()->route('login')->with('error', 'Unauthorized access.');
        }

        $claim = Claim::where('distributor_id', $distributor->id)
            ->with(['lead', 'lead.executive', 'lead.dealer', 'lead.lead_details'])
            ->findOrFail($id);

        return view('distributor.claim-show', compact('claim'));
    }

    /**
     * Update claim status (verify/reject/dispute)
     */
    public function updateClaimStatus(Request $request, $id)
    {
        $distributor = Auth::user();

        if ($distributor->role != 4) {
            return redirect()->route('login')->with('error', 'Unauthorized access.');
        }

        $request->validate([
            'status' => 'required|in:approved,rejected,disputed',
            'reason' => 'required_if:status,rejected,disputed|string|max:500',
            'amount' => 'nullable|numeric|min:0'
        ]);

        $claim = Claim::where('distributor_id', $distributor->id)
            ->findOrFail($id);

        DB::beginTransaction();
        try {
            $claim->update([
                'status' => $request->status,
                'verification_notes' => $request->reason,
                'verified_amount' => $request->amount ?? $claim->claim_amount,
                'verified_by' => $distributor->id,
                'verified_at' => now()
            ]);

            DB::commit();

            return redirect()->back()
                ->with('success', 'Claim status updated successfully.');

        } catch (\Exception $e) {
            DB::rollBack();
            return redirect()->back()
                ->with('error', 'Failed to update claim status: ' . $e->getMessage());
        }
    }

    /**
     * Show converted leads for creating claims
     */
    public function convertedLeads(Request $request)
    {
        $user = Auth::user();

        if ($user->role != 4) {
            return redirect()->route('login')->with('error', 'Access Denied.');
        }

        // Get all dealer IDs under this distributor
        $dealerIds = User::where('role', 3)
            ->where('parent_id', $user->id)
            ->pluck('id')
            ->toArray();

        $query = Lead::where(function ($q) use ($user, $dealerIds) {
            $q->where('distributor_id', $user->id)
                ->orWhereIn('dealer_id', $dealerIds);
        })
            ->where(function ($q) {
                // Include both converted leads and successfully verified leads
                $q->where('status', 'converted')
                    ->orWhereHas('lead_details', function ($detailQuery) {
                    $detailQuery->where('verification_status', 'successful');
                });
            })
            ->with(['executive', 'dealer', 'lead_details']);

        if ($request->filled('search')) {
            $query->where(function ($q) use ($request) {
                $q->where('customer_name', 'like', '%' . $request->search . '%')
                    ->orWhere('phone_no', 'like', '%' . $request->search . '%');
            });
        }

        // Filter by verification status if requested
        if ($request->filled('verification_status')) {
            $query->whereHas('lead_details', function ($q) use ($request) {
                $q->where('verification_status', $request->verification_status);
            });
        }

        $leads = $query->orderBy('updated_at', 'desc')
            ->paginate(20);

        return view('distributor.converted-leads', compact('leads'));
    }
    public function disputedLeads(Request $request)
    {
        // dd('disputed leads', $request->all());
        $user = Auth::user();

        if ($user->role != 4) {
            return redirect()->route('login')->with('error', 'Access Denied.');
        }

        // Get all dealer IDs under this distributor
        $dealerIds = User::where('role', 3)
            ->where('parent_id', $user->id)
            ->pluck('id')
            ->toArray();

        $query = Lead::where(function ($q) use ($user, $dealerIds) {
            $q->where('distributor_id', $user->id)
                ->orWhereIn('dealer_id', $dealerIds);
        })
            ->where(function ($q) {
                // Include both converted leads and successfully verified leads
                $q->where('status', 'disputed')
                    ->orWhereHas('lead_details', function ($detailQuery) {
                    $detailQuery->where('verification_status', 'successful');
                });
            })
            ->with(['executive', 'dealer', 'lead_details']);

        if ($request->filled('search')) {
            $query->where(function ($q) use ($request) {
                $q->where('customer_name', 'like', '%' . $request->search . '%')
                    ->orWhere('phone_no', 'like', '%' . $request->search . '%');
            });
        }

        // Filter by verification status if requested
        if ($request->filled('verification_status')) {
            $query->whereHas('lead_details', function ($q) use ($request) {
                $q->where('verification_status', $request->verification_status);
            });
        }

        $leads = $query->orderBy('updated_at', 'desc')
            ->paginate(20);

        return view('distributor.disputed-leads', compact('leads'));
    }

    /**
     * Create claim for a converted lead
     */
    public function createClaim(Request $request, $leadId)
    {
        $distributor = Auth::user();

        if ($distributor->role != 4) {
            return redirect()->route('login')->with('error', 'Unauthorized access.');
        }

        // Verify distributor has access to this lead
        $dealerIds = User::where('role', 3)
            ->where('parent_id', $distributor->id)
            ->pluck('id')
            ->toArray();

        $lead = Lead::where(function ($q) use ($distributor, $dealerIds) {
            $q->where('distributor_id', $distributor->id)
                ->orWhereIn('dealer_id', $dealerIds);
        })
            ->where('id', $leadId)
            ->where('status', 'converted')
            ->firstOrFail();

        // Check if claim already exists
        if ($lead->claim) {
            return redirect()->route('distributor.claims.show', $lead->claim->id)
                ->with('info', 'Claim already exists for this lead.');
        }

        $request->validate([
            'claim_amount' => 'required|numeric|min:0',
            'notes' => 'nullable|string|max:500'
        ]);

        // Calculate commission (example: 5% of vehicle price)
        $vehicleValue = $lead->lead_details->sum('total_price') ?? 0;
        $commission = $vehicleValue * 0.05;
        $claimAmount = $request->claim_amount ?: $commission;

        // Create claim
        $claim = Claim::create([
            'lead_id' => $lead->id,
            'distributor_id' => $distributor->id,
            'executive_id' => $lead->executive_id,
            'dealer_id' => $lead->dealer_id,
            'claim_amount' => $claimAmount,
            'notes' => $request->notes,
            'status' => 'pending',
            'created_by' => $distributor->id
        ]);

        return redirect()->route('distributor.claims.show', $claim->id)
            ->with('success', 'Claim created successfully.');
    }

    /**
     * Show distributor's leads
     */
    public function leads(Request $request)
    {
        $user = Auth::user();

        if ($user->role != 4) {
            return redirect()->route('login')->with('error', 'Access Denied.');
        }

        // Get all dealer IDs under this distributor
        $dealerIds = User::where('role', 3)
            ->where('parent_id', $user->id)
            ->pluck('id')
            ->toArray();

        $query = Lead::where(function ($q) use ($user, $dealerIds) {
            $q->where('distributor_id', $user->id)
                ->orWhereIn('dealer_id', $dealerIds);
        })->with(['executive', 'dealer', 'lead_details']);

        // Apply filters
        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        if ($request->filled('type')) {
            switch ($request->type) {
                case 'open':
                    $query->whereIn('status', ['new', 'open', 'pending', 'in-progress', 'follow_up']);
                    break;
                case 'converted':
                    $query->where('status', 'converted');
                    break;
                case 'unrealized':
                    $query->where('status', 'lost');
                    break;
            }
        }

        if ($request->filled('search')) {
            $query->where(function ($q) use ($request) {
                $q->where('customer_name', 'like', '%' . $request->search . '%')
                    ->orWhere('phone_no', 'like', '%' . $request->search . '%');
            });
        }

        $leads = $query->orderBy('created_at', 'desc')->paginate(15);

        return view('distributor.distributor-leads', compact('leads'));
    }

    /**
     * Show lead details
     */
    // public function showLead($id)
    // {
    //     $distributor = Auth::user();

    //     if ($distributor->role != 4) {
    //         return redirect()->route('login')->with('error', 'Unauthorized access.');
    //     }

    //     // Get all dealer IDs under this distributor
    //     $dealerIds = User::where('role', 3)
    //         ->where('parent_id', $distributor->id)
    //         ->pluck('id')
    //         ->toArray();

    //     $lead = Lead::where(function ($q) use ($distributor, $dealerIds) {
    //         $q->where('distributor_id', $distributor->id)
    //             ->orWhereIn('dealer_id', $dealerIds);
    //     })
    //         ->with(['executive', 'dealer', 'distributor', 'lead_details', 'lead_details.brand', 'lead_details.variant'])
    //         ->findOrFail($id);

    //     return view('distributor.lead-show', compact('lead'));
    // }

    public function showLead($id)
    {
        // dd($id);
        $distributor = Auth::user();

        // Quick role check (role 4 = distributor)
        if (!$distributor || $distributor->role !== 4) {
            return redirect()->route('login')->with('error', 'Unauthorized access.');
        }

        // Get all dealer IDs under this distributor
        $dealerIds = User::where('role', 3)          // role 3 = dealer
            ->where('parent_id', $distributor->id)
            ->pluck('id')
            ->toArray();

        // Fetch the lead with necessary relationships
        $lead = Lead::where(function ($query) use ($distributor, $dealerIds) {
            $query->where('distributor_id', $distributor->id)
                ->orWhereIn('dealer_id', $dealerIds);
        })
            ->with([
                'executive',
                'dealer',
                'distributor',
                'lead_details.brand',
                'lead_details.variant',
                'lead_details.variant.galleries',
                'lead_details.variant.galleries.color'
            ])
            ->findOrFail($id);
        // dd($lead);

        // Optional: Add authorization check (extra security layer)
        // This ensures the lead belongs to this distributor or their dealer
        if ($lead->distributor_id !== $distributor->id && !in_array($lead->dealer_id, $dealerIds)) {
            abort(403, 'Unauthorized access to this lead.');
        }

        return view('distributor.lead-show', compact('lead'));
    }

    public function verifyLead(Request $request, $leadId, $detailId)
    {
        try {
            Log::info('=== VERIFICATION REQUEST START ===');
            Log::info('User ID:', ['user_id' => Auth::id()]);
            Log::info('Request data:', $request->all());
            Log::info('Route parameters:', [
                'leadId' => $leadId,
                'detailId' => $detailId
            ]);

            // SIMPLIFIED VALIDATION - NO PERMISSION CHECKS
            $validated = $request->validate([
                'verification_status' => 'required|in:successful,disputed,rejected',
                'verification_note' => 'nullable|string|max:1000',
            ]);

            Log::info('Validation passed:', $validated);

            // Find the lead detail without permission checks
            $leadDetail = LeadDetail::find($detailId);

            if (!$leadDetail) {
                Log::error('LeadDetail not found:', ['detailId' => $detailId]);
                return response()->json([
                    'success' => false,
                    'error' => 'Lead detail not found with ID: ' . $detailId
                ], 404);
            }

            Log::info('LeadDetail found:', [
                'id' => $leadDetail->id,
                'lead_id' => $leadDetail->lead_id,
                'current_status' => $leadDetail->verification_status
            ]);

            // Update the lead detail
            $leadDetail->verification_status = $validated['verification_status'];
            $leadDetail->verification_note = $validated['verification_note'] ?? null;
            $leadDetail->verified_at = now();
            $leadDetail->verified_by = Auth::id();

            Log::info('Updating LeadDetail with:', [
                'verification_status' => $leadDetail->verification_status,
                'verified_by' => $leadDetail->verified_by
            ]);

            $saved = $leadDetail->save();

            if (!$saved) {
                Log::error('Failed to save LeadDetail');
                return response()->json([
                    'success' => false,
                    'error' => 'Failed to save verification'
                ], 500);
            }

            Log::info('LeadDetail saved successfully');
            Log::info('Updated LeadDetail:', $leadDetail->toArray());

            // Return success response
            return response()->json([
                'success' => true,
                'message' => 'Lead verified successfully!',
                'data' => [
                    'detail_id' => $leadDetail->id,
                    'verification_status' => $leadDetail->verification_status,
                    'verified_at' => $leadDetail->verified_at->format('Y-m-d H:i:s'),
                ]
            ]);

        } catch (\Illuminate\Validation\ValidationException $e) {
            Log::error('Validation error:', ['errors' => $e->errors()]);
            return response()->json([
                'success' => false,
                'error' => 'Validation failed: ' . implode(', ', array_merge(...array_values($e->errors()))),
                'errors' => $e->errors()
            ], 422);

        } catch (\Exception $e) {
            Log::error('Server error:', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            return response()->json([
                'success' => false,
                'error' => 'Server error: ' . $e->getMessage()
            ], 500);
        }
    }
    public function claimDetails($id)
    {
        $distributor = Auth::user();

        // Fetch the converted lead belonging to this distributor
        $lead = Lead::where('distributor_id', $distributor->id)
            ->where('status', 'converted')
            ->with([
                'executive',
                'dealer',
                'oem',
                'city',
                'leadDetails' => function ($q) {
                    $q->with(['brand', 'variant', 'color']);
                }
            ])
            ->findOrFail($id);

        // For vehicle image - assuming you have one leadDetail (or take first)
        $leadDetail = $lead->leadDetails->first();

        // Map verification status to display status & badge
        $statusMap = [
            Lead::VERIFICATION_PENDING => ['text' => 'Pending Verification', 'class' => 'bg-warning text-dark'],
            Lead::VERIFICATION_SUCCESSFUL => ['text' => 'Successful', 'class' => 'bg-success'],
            Lead::VERIFICATION_DISPUTED => ['text' => 'Disputed', 'class' => 'bg-warning text-dark'],
            Lead::VERIFICATION_REJECTED => ['text' => 'Rejected', 'class' => 'bg-danger'],
        ];

        $claimStatus = $statusMap[$lead->verification_status] ?? ['text' => 'Unknown', 'class' => 'bg-secondary'];

        return view('distributor.claim-details', compact('lead', 'leadDetail', 'claimStatus'));
    }

    public function successfulLeads(Request $request)
    {
        $user = Auth::user();

        if ($user->role != 4) {
            return redirect()->route('login')->with('error', 'Access Denied.');
        }

        // Get all dealer IDs under this distributor
        $dealerIds = User::where('role', 3)
            ->where('parent_id', $user->id)
            ->pluck('id')
            ->toArray();

        // Base query for leads under this distributor with successful verification
        $query = Lead::where(function ($q) use ($user, $dealerIds) {
            $q->where('distributor_id', $user->id)
                ->orWhereIn('dealer_id', $dealerIds);
        })
            ->whereHas('lead_details', function ($q) {
                $q->where('verification_status', 'successful');
            })
            ->with([
                'executive',
                'dealer',
                'lead_details' => function ($q) {
                    $q->where('verification_status', 'successful')
                        ->with(['brand', 'variant', 'color']);
                }
            ]);

        // Apply filters
        if ($request->filled('search')) {
            $query->where(function ($q) use ($request) {
                $q->where('customer_name', 'like', '%' . $request->search . '%')
                    ->orWhere('phone_no', 'like', '%' . $request->search . '%');
            });
        }

        if ($request->filled('from_date') && $request->filled('to_date')) {
            $query->whereHas('lead_details', function ($q) use ($request) {
                $q->where('verification_status', 'successful')
                    ->whereBetween('verified_at', [$request->from_date, $request->to_date]);
            });
        }

        // Get paginated results
        $successfulLeads = $query->orderBy('updated_at', 'desc')->paginate(15);

        // Get statistics
        $thisMonthCount = $query->clone()
            ->whereHas('lead_details', function ($q) {
                $q->where('verification_status', 'successful')
                    ->whereMonth('verified_at', now()->month)
                    ->whereYear('verified_at', now()->year);
            })
            ->count();

        $lastMonthCount = $query->clone()
            ->whereHas('lead_details', function ($q) {
                $q->where('verification_status', 'successful')
                    ->whereMonth('verified_at', now()->subMonth()->month)
                    ->whereYear('verified_at', now()->subMonth()->year);
            })
            ->count();

        // Calculate total value
        $totalValue = 0;
        foreach ($successfulLeads as $lead) {
            foreach ($lead->lead_details as $detail) {
                if ($detail->verification_status === 'successful') {
                    $totalValue += $detail->total_price ?? 0;
                }
            }
        }

        return view('distributor.successful-leads', compact(
            'successfulLeads',
            'thisMonthCount',
            'lastMonthCount',
            'totalValue'
        ));
    }
    // public function payDetails($executiveId)
    // {
    //     $distributor = Auth::user();

    //     if ($distributor->role != 4) {
    //         return redirect()->route('login')->with('error', 'Unauthorized access.');
    //     }

    //     $executive = User::where('role', 2)->findOrFail($executiveId);

    //     // Fetch all successful lead_details for this executive
    //     $leads = LeadDetail::where('verification_status', 'successful')
    //         ->whereHas('lead', function ($q) use ($executive) {
    //             $q->where('executive_id', $executive->id);
    //         })
    //         ->with(['lead', 'brand', 'variant', 'color'])
    //         ->orderBy('verified_at', 'desc')
    //         ->get();

    //     $totalCommission = 0;
    //     foreach ($leads as $leadDetail) {
    //         $totalCommission += ($leadDetail->variant->commission ?? 0) * $leadDetail->vehicle_qty;
    //     }

    //     return view('distributor.pay-details', compact('executive', 'leads', 'totalCommission'));
    // }

    public function payDetails($executiveId)
    {
        // dd('pay details', $executiveId);
        $distributor = Auth::user();
        // dd('distributor', $distributor);
        if ($distributor->role != 4) {
            return redirect()->route('login')->with('error', 'Unauthorized access.');
        }

        // Executive check (role 2 = executive)
        $executive = User::where('role', 2)->findOrFail($executiveId);

        // Fetch successful lead_details for this executive
        $leads = LeadDetail::where('verification_status', 'successful')
            ->whereHas('lead', function ($q) use ($executive) {
                // $q->where('user_id', $executive->id);
                $q->where('executive_id', $executive->id);

            })
            ->with(['lead', 'brand', 'variant', 'color'])
            ->orderBy('verified_at', 'desc')
            ->get();

        // Total commission (variant-wise)
        $totalCommission = 0;
        foreach ($leads as $leadDetail) {
            $totalCommission += ($leadDetail->variant->commission ?? 0) * ($leadDetail->vehicle_qty ?? 1);
        }

        // dd('total commission', $totalCommission);
        return view('distributor.pay-details', compact('executive', 'leads', 'totalCommission'));
    }

    // public function generateSelectedInvoice(Request $request)
    // {
    //     $distributor = Auth::user();

    //     if ($distributor->role != 4) {
    //         return redirect()->route('login')->with('error', 'Unauthorized access.');
    //     }

    //     $request->validate([
    //         'detail_ids' => 'required|array',
    //         'detail_ids.*' => 'exists:lead_details,id',
    //     ]);

    //     $detailIds = $request->detail_ids;

    //     // Fetch all selected details
    //     $details = LeadDetail::whereIn('id', $detailIds)
    //         ->where('verification_status', 'successful')
    //         ->with(['lead', 'brand', 'variant', 'color'])
    //         ->get();

    //     // Access check for all
    //     $dealerIds = User::where('role', 3)
    //         ->where('parent_id', $distributor->id)
    //         ->pluck('id')
    //         ->toArray();

    //     foreach ($details as $detail) {
    //         if (
    //             $detail->lead->distributor_id != $distributor->id &&
    //             !in_array($detail->lead->dealer_id, $dealerIds)
    //         ) {
    //             return redirect()->back()->with('error', 'Unauthorized access to one or more leads.');
    //         }
    //     }

    //     // Pass data to view
    //     $data = [
    //         'details' => $details,
    //         'distributor' => $distributor,
    //     ];

    //     // Return HTML view instead of PDF
    //     return view('distributor.invoice-note', $data);
    // }
    // public function generateInvoiceNote(Request $request, $detailId = null)
    // {
    //     $distributor = Auth::user();

    //     if ($distributor->role != 4) {
    //         return redirect()->route('login')->with('error', 'Unauthorized access.');
    //     }

    //     // Multiple case: POST request se detail_ids aaye
    //     if ($request->isMethod('post') && $request->has('detail_ids')) {
    //         $request->validate([
    //             'detail_ids' => 'required|array',
    //             'detail_ids.*' => 'exists:lead_details,id',
    //         ]);

    //         $detailIds = $request->detail_ids;

    //         $details = LeadDetail::whereIn('id', $detailIds)
    //             ->where('verification_status', 'successful')
    //             ->with(['lead', 'brand', 'variant', 'color'])
    //             ->get();
    //     }
    //     // Single case: GET request se detailId aaya
    //     else {
    //         $detailId = $detailId ?? $request->detailId; // Fallback
    //         $details = LeadDetail::where('id', $detailId)
    //             ->where('verification_status', 'successful')
    //             ->with(['lead', 'brand', 'variant', 'color'])
    //             ->get();

    //         if ($details->isEmpty()) {
    //             return redirect()->back()->with('error', 'No valid vehicle found.');
    //         }
    //     }

    //     // Access check for all details
    //     $dealerIds = User::where('role', 3)
    //         ->where('parent_id', $distributor->id)
    //         ->pluck('id')
    //         ->toArray();

    //     foreach ($details as $detail) {
    //         if (
    //             $detail->lead->distributor_id != $distributor->id &&
    //             !in_array($detail->lead->dealer_id, $dealerIds)
    //         ) {
    //             return redirect()->back()->with('error', 'Unauthorized access to one or more leads.');
    //         }
    //     }

    //     if ($details->isNotEmpty()) {
    //         $lead = $details->first()->lead;
    //         $executiveId = $lead->executive_id;

    //         if ($executiveId) {
    //             Notification::create([
    //                 'user_id' => $executiveId,
    //                 'type' => 'invoice_generated',
    //                 'message' => "Distributor {$distributor->name} ne aapki Lead #{$lead->id} ki invoice generate ki hai.",
    //                 'lead_id' => $lead->id,
    //                 'distributor_id' => $distributor->id,
    //             ]);
    //         }
    //     }

    //     // Data pass karo view ko
    //     $data = [
    //         'details' => $details,
    //         'distributor' => $distributor,
    //     ];

    //     return view('distributor.invoice-note', $data);
    // }



    public function generateCreditNote(Request $request, $detailId = null)
    {
        $distributor = Auth::user();

        if ($distributor->role != 4) {
            return redirect()->route('login')->with('error', 'Unauthorized access.');
        }

        $details = collect();

        // Multiple case: POST se detail_ids aaye
        if ($request->isMethod('post') && $request->has('detail_ids')) {
            $request->validate([
                'detail_ids' => 'required|array',
                'detail_ids.*' => 'exists:lead_details,id',
            ]);

            $detailIds = $request->detail_ids;

            $details = LeadDetail::whereIn('id', $detailIds)
                ->where('verification_status', 'successful')
                ->with(['lead', 'brand', 'variant', 'color'])
                ->get();
        }
        // Single case: GET se detailId aaya
        else {
            $detailId = $detailId ?? $request->detailId; // Fallback
            $details = LeadDetail::where('id', $detailId)
                ->where('verification_status', 'successful')
                ->with(['lead', 'brand', 'variant', 'color'])
                ->get();

            if ($details->isEmpty()) {
                return redirect()->back()->with('error', 'No valid vehicle found.');
            }
        }

        // Access check
        $dealerIds = User::where('role', 3)
            ->where('parent_id', $distributor->id)
            ->pluck('id')
            ->toArray();

        foreach ($details as $detail) {
            if (
                $detail->lead->distributor_id != $distributor->id &&
                !in_array($detail->lead->dealer_id, $dealerIds)
            ) {
                return redirect()->back()->with('error', 'Unauthorized access to one or more leads.');
            }
        }

        // Notification to Executive
        if ($details->isNotEmpty()) {
            $lead = $details->first()->lead;
            $executiveId = $lead->executive_id;

            if ($executiveId) {
                Notification::create([
                    'user_id' => $executiveId,
                    'executive_id' => $executiveId,
                    'type' => 'credit_note_generated',
                    'message' => " Distributor {$distributor->name} has generated the credit note for your Lead {$lead->id}.",
                    'lead_id' => $lead->id,
                    'distributor_id' => $distributor->id,
                ]);
            }
        }

        // Data for view
        $data = [
            'details' => $details,
            'distributor' => $distributor,
        ];
        LeadDetail::whereIn('id', $details->pluck('id'))
            ->update([
                'verification_status' => 'credit_note_generated',
                'updated_at' => now(),
            ]);
        return view('distributor.credit-note', $data);
    }


    public function payouts(Request $request)
    {
        $user = Auth::user();

        if ($user->role != 4) {
            return redirect()->route('login')->with('error', 'Access Denied.');
        }

        // Dealer IDs under this distributor
        $dealerIds = User::where('role', 3)
            ->where('parent_id', $user->id)
            ->pluck('id')
            ->toArray();

        // Fetch successful verified vehicles group by executive
        $payoutDetails = LeadDetail::where('verification_status', 'successful')
            ->whereHas('lead', function ($q) use ($user, $dealerIds) {
                $q->where('distributor_id', $user->id)
                    ->orWhereIn('dealer_id', $dealerIds);
            })
            ->with(['lead', 'lead.executive', 'brand', 'variant'])
            ->select('lead_id', 'variant_id', DB::raw('COUNT(*) as vehicle_count'), DB::raw('SUM(total_price) as total_amount'))
            ->groupBy('lead_id', 'variant_id')
            ->orderBy('verified_at', 'desc')
            ->get()
            ->groupBy('lead.executive_id');



        // Calculate commission per executive
        $payouts = $payoutDetails->map(function ($details, $executiveId) {
            $executive = User::find($executiveId);
            $commission = 0;
            $totalAmount = 0;

            foreach ($details as $detail) {
                $variant = $detail->variant;
                $commission += $variant->commission * $detail->vehicle_count;
                $totalAmount += $detail->total_amount;
            }

            return (object) [
                'executive' => $executive,
                'executive_name' => $executive->name ?? 'N/A',
                'total_leads' => $details->count(),
                'vehicle_sales' => $details->sum('vehicle_count'),
                'total_amount' => $totalAmount,
                'commission' => $commission,
            ];
        });

        return view('distributor.payouts', compact('payouts'));
    }

}
