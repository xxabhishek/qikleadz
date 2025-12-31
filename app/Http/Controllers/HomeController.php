<?php

namespace App\Http\Controllers;


use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\LeadDetail;
use App\Models\DealerAreaMap;
use App\Models\Lead;
use Illuminate\Support\Facades\Session;


class HomeController extends Controller
{
    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
        $this->middleware('auth');
    }

    /**
     * Show the application dashboard.
     *
     * @return \Illuminate\Contracts\Support\Renderable
     */
    // public function index()
    // {
    //     // return view('home');

    //     ini_set('memory_limit', '-1');
    //     // Get the session data
    //     $sessionData = session()->all(); // or Session::all();
    //     $user=Auth::user();
    //     $user_id=$user->id;
    //     // dd($user->id);
    //     return view('home');
    // }


    //    public function index()
// {
//     // ✅ First safety check
//     if (!Auth::check()) {
//         return redirect()->route('login');
//     }

    //     $user = Auth::user();

    //     // Store user info in session
//     Session::put('username', $user->name);
//     Session::put('user_id', $user->id);
//     Session::put('role', $user->role);
//     Session::put('country_id', $user->country_id);
//     Session::put('user_code', $user->user_id);

    //     // Role-based redirection
//     switch ($user->role) {
//         case 1: // Admin
//             return redirect()->route('admin.dashboard');

    //         case 2: // Sales Executive
//             return redirect()->route('frontend.exeDashboard');

    //         case 3: // Dealer
//             return redirect()->route('dealer.dashboard');

    //         case 4: // Distributor
//             return redirect()->route('distributor.dashboard');

    //         default:
//             Auth::logout();
//             return redirect()->route('login')
//                 ->with('error', 'Unauthorized access.');
//     }
// }

  public function index()
{
    $user = auth()->user();

    if (!$user) {
        return redirect()->route('login');
    }

    switch ($user->role) {
        case 1: return redirect()->route('admin.dashboard');
        case 2: return redirect()->route('executive.dashboard');
        case 3: return redirect()->route('dealer.dashboard');
        case 4: return redirect()->route('distributor.dashboard');
        default:
            Auth::logout();
            return redirect()->route('login')->withErrors(['login_input' => 'Invalid user role.']);
    }
}



    public function ExeDashboard()
    {
        // dd('ok');
        $user = Auth::user();

        $userId = $user->id;
        // dd($userId,$user);

        // Total earnings (dummy for now, you can replace with real payment calculation)
        $earnings = Lead::where('executive_id', $userId)
            ->count() * 200; // Example: assume each lead = $200

        // Vehicles Sold (count leads with status = Sold)
        $vehiclesSold = Lead::where('executive_id', $userId)
            // ->where('status', 'Sold')
            ->count();

        // dd($earnings,$vehiclesSold);

        $creditNotes = 0; // you can add your real logic here later

        // Leads Section
// Leads Counts (from lead_details by status)
        $draftLeads = LeadDetail::whereHas('lead', function ($q) use ($userId) {
            $q->where('executive_id', $userId)
                ->whereNull('deleted_at'); // Exclude soft-deleted Leads
        })
            ->whereRaw('LOWER(status) = ?', ['draft'])
            ->whereNull('deleted_at')
            ->distinct('lead_id')
            ->count('lead_id');

        $openLeads = LeadDetail::whereHas('lead', function ($q) use ($userId) {
            $q->where('executive_id', $userId)
                ->whereNull('deleted_at'); // Exclude soft-deleted Leads
        })
            ->whereRaw('LOWER(status) = ?', ['open'])
            ->whereNull('deleted_at')
            ->distinct('lead_id')
            ->count('lead_id');

        $convertedLeads = LeadDetail::whereHas('lead', function ($q) use ($userId) {
            $q->where('executive_id', $userId)
                ->whereNull('deleted_at');
        })
            ->whereRaw('LOWER(status) = ?', ['converted'])
            ->whereNull('deleted_at')
            ->distinct('lead_id')
            ->count('lead_id');

        $unrealizedLeads = LeadDetail::whereHas('lead', function ($q) use ($userId) {
            $q->where('executive_id', $userId);
        })
            ->whereRaw('LOWER(status) = ?', ['unrealized'])
            ->whereNull('deleted_at')
            ->distinct('lead_id')
            ->count('lead_id');

        // 🚀 Vehicle model-wise open leads
        $vehicleModels = LeadDetail::with(['variant.brand', 'variant.galleries'])
            ->whereHas('lead', fn($q) => $q->where('executive_id', $userId))
            ->where('status', 'Open')
            ->select('variant_id', \DB::raw('count(*) as total'))
            ->groupBy('variant_id')
            ->get();
        // dd($vehicleModels);

        // dd($userId,$openLeads,$draftLeads);
        return view('dealer.dashboard-lead', compact(
            'earnings',
            'vehiclesSold',
            'creditNotes',
            'draftLeads',
            'openLeads',
            'convertedLeads',
            'unrealizedLeads',
            'vehicleModels'
        ));
    }

    public function DealerDashboard()
    {
        $user = Auth::user();

        $userId = Session::get('user_id');
        $username = Session::get('username');

        // Ensure only dealers can access this
        if ($user->role != 3) {
            return redirect()->back()->withErrors(['error' => 'Unauthorized Access']);
        }

        $userId = $user->id;
        $userName = $user->name;

        // 🧭 Get Dealer Mapped Areas (comma-separated -> array)
        $dealerMap = DealerAreaMap::where('user_id', $userId)->first();

        if (!$dealerMap) {
            // No mapping found
            $openLeads = $convertedLeads = $unrealizedLeads = 0;
            return view('frontend.dealer-dashboard', compact('openLeads', 'convertedLeads', 'unrealizedLeads', 'userName'));
        }

        // Convert stored area IDs ("1,3,5") → [1,3,5]
        $mappedAreaIds = array_map('intval', explode(',', $dealerMap->area_id));
        $mappedCityId = $dealerMap->city_id; // Single city ID

        // dd($mappedAreaIds,$mappedCityId);

        // 🔹 Open Leads Count
        $TotalAssignLeads = LeadDetail::whereHas('lead', function ($q) use ($mappedAreaIds, $mappedCityId) {
            $q->where('city_id', $mappedCityId)
                ->whereIn('area_id', $mappedAreaIds)
                ->whereNull('deleted_at');
        })->count();

        $openLeads = LeadDetail::whereHas('lead', function ($q) use ($mappedAreaIds, $mappedCityId) {
            $q->where('city_id', $mappedCityId)
                ->whereIn('area_id', $mappedAreaIds)
                ->whereNull('deleted_at');
        })->where('status', 'Open')->count();


        // 🔹 Converted Leads Count
        $convertedLeads = LeadDetail::whereHas('lead', function ($q) use ($mappedAreaIds, $mappedCityId) {
            $q->where('city_id', $mappedCityId)
                ->whereIn('area_id', $mappedAreaIds)
                ->whereNull('deleted_at');
        })->where('status', 'Converted')->count();

        // 🔹 Unrealized Leads Count
        $unrealizedLeads = LeadDetail::whereHas('lead', function ($q) use ($mappedAreaIds, $mappedCityId) {
            $q->where('city_id', $mappedCityId)
                ->whereIn('area_id', $mappedAreaIds)
                ->whereNull('deleted_at');
        })->where('status', 'Unrealized')->count();

        // ✅ Return data to view
        return view('frontend.dealer-dashboard', compact(
            'TotalAssignLeads',
            'openLeads',
            'convertedLeads',
            'unrealizedLeads',
            'userName'
        ));
    }

    public function DistributorDashboard()
    {
        // dd("DistributorDashboard");
        $user = Auth::user();

        // Ensure only dealers can access this

        $userId = $user->id;


          return view('distributor.distributor-dashboard');

    }

}
