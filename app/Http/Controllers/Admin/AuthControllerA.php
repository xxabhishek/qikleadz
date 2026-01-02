<?php

// namespace App\Http\Controllers\Admin;

// use App\Http\Controllers\Controller;
// use Illuminate\Http\Request;
// use Illuminate\Support\Facades\Auth;
// use Illuminate\Support\Facades\Hash;
// use App\Models\User;
// use Illuminate\Support\Facades\DB;
// use Illuminate\Support\Facades\Validator;
// use Illuminate\Support\Facades\Log;
// use Illuminate\Support\Facades\Password;

// class AuthController extends Controller
// {
//     /**
//      * Show the login form
//      */
//     public function showLoginForm()
//     {
//         return view('auth.login');
//     }

//     /**
//      * Handle login request - Accepts both email and user_id
//      */
//     public function login(Request $request)
//     {
//         dd($request->all());
//         Log::info('Login attempt', ['login_input' => $request->login_input]);

//         $validator = Validator::make($request->all(), [
//             'login_input' => 'required|string|max:255', // Accepts both email or user_id
//             'pin' => 'required|numeric|digits:4',
//         ]);

//         if ($validator->fails()) {
//             Log::warning('Validation failed', $validator->errors()->toArray());
//             return redirect()->back()
//                 ->withErrors($validator)
//                 ->withInput();
//         }

//         $credentials = $request->only('login_input', 'pin');

//         // Determine if login input is email or user_id
//         $loginInput = $credentials['login_input'];
//         $isEmail = filter_var($loginInput, FILTER_VALIDATE_EMAIL);

//         // Find user by email OR user_id
//         if ($isEmail) {
//             $user = User::where('email', $loginInput)->first();
//             $loginField = 'email';
//         } else {
//             $user = User::where('user_id', $loginInput)->first();
//             $loginField = 'user_id';
//         }

//         if (!$user) {
//             Log::warning('User not found', ['login_input' => $loginInput, 'type' => $loginField]);
//             return redirect()->back()->withErrors([
//                 'login_input' => 'Invalid login credentials.' // Generic error for security
//             ])->withInput();
//         }

//         // Check if pin exists
//         if (!isset($user->pin) || empty($user->pin)) {
//             Log::error('No PIN set for user', ['user_id' => $user->user_id]);
//             return redirect()->back()->withErrors([
//                 'login_input' => 'Account setup incomplete. Contact admin.'
//             ])->withInput();
//         }

//         // Verify PIN
//         if (!Hash::check($credentials['pin'], $user->pin)) {
//             Log::warning('PIN mismatch', ['user_id' => $user->user_id]);
//             return redirect()->back()->withErrors([
//                 'pin' => 'Incorrect PIN.'
//             ])->withInput();
//         }

//         // Check user status
//         if ($user->status !== 'Active') {
//             Log::warning('Inactive user login attempt', ['user_id' => $user->user_id, 'status' => $user->status]);
//             return redirect()->back()->withErrors([
//                 'login_input' => 'Your account is inactive. Please contact the administrator.'
//             ])->withInput();
//         }

//         Auth::login($user, $remember = false);
//         Log::info('Login successful', ['user_id' => $user->user_id, 'login_type' => $loginField]);

//         return redirect()->intended(route('home'));
//     }

//     public function logout(Request $request)
//     {
//         Log::info('Logout', ['user_id' => Auth::id()]);
//         Auth::logout();
//         $request->session()->invalidate();
//         $request->session()->regenerateToken();

//         return redirect('/login');
//     }



//     public function showForgotPasswordForm()
//     {
//         return view('auth.forgot-password');
//     }

//     public function sendResetLinkWeb(Request $request)
//     {
//         $request->validate(['email' => 'required|email']);

//         $email = $request->email;

//         Log::info('🔐 CUSTOM Password reset requested', ['email' => $email]);

//         // Find user
//         $user = User::where('email', $email)->first();

//         if (!$user) {
//             Log::warning('  User not found', ['email' => $email]);
//             // For security, return success even if user not found
//             return back()->with('status', 'If that email address exists in our system, we\'ve sent a PIN reset link to it.');
//         }

//         Log::info('  User found', [
//             'user_id' => $user->user_id,
//             'email' => $user->email
//         ]);

//         // Generate token
//         $token = Str::random(64);

//         // Store token in database (custom implementation)
//         DB::table('password_reset_tokens')->updateOrInsert(
//             ['email' => $email],
//             [
//                 'token' => Hash::make($token),
//                 'created_at' => now()
//             ]
//         );

//         // Send email
//         try {
//             $resetUrl = url('/reset-password/' . $token . '?email=' . urlencode($email));

//             Mail::send('auth.custom-reset-email', ['url' => $resetUrl], function ($message) use ($user) {
//                 $message->to($user->email);
//                 $message->subject('Reset Your PIN - QikLeadz');
//             });

//             Log::info('📧 Custom reset email sent', ['email' => $email]);

//             return back()->with('status', 'We have emailed your PIN reset link!');

//         } catch (\Exception $e) {
//             Log::error('  Email sending failed', ['error' => $e->getMessage()]);
//             return back()->withErrors(['email' => 'Failed to send reset email. Please try again.']);
//         }
//     }

//     /**
//      * Show reset password form
//      */
//     public function showResetPasswordForm($token)
//     {
//         $email = request()->get('email');

//         Log::info('📝 Showing reset form', [
//             'token_preview' => substr($token, 0, 10) . '...',
//             'email' => $email
//         ]);

//         return view('auth.reset-password', [
//             'token' => $token,
//             'email' => $email
//         ]);
//     }

//     /**
//      * Reset password - CUSTOM IMPLEMENTATION
//      */
//     public function resetPasswordWeb(Request $request)
//     {
//         $request->validate([
//             'token' => 'required',
//             'email' => 'required|email',
//             'pin' => 'required|numeric|digits:4|confirmed',
//         ]);

//         $email = $request->email;
//         $token = $request->token;
//         $pin = $request->pin;

//         Log::info('🔄 CUSTOM Password reset attempt', ['email' => $email]);

//         // Step 1: Find user
//         $user = User::where('email', $email)->first();

//         if (!$user) {
//             Log::error('  User not found', ['email' => $email]);
//             return back()
//                 ->withInput($request->only('email'))
//                 ->withErrors(['email' => 'We can\'t find a user with that email address.']);
//         }

//         Log::info('  User found', ['user_id' => $user->user_id]);

//         // Step 2: Check token
//         $tokenRecord = DB::table('password_resets')
//             ->where('email', $email)
//             ->first();

//         if (!$tokenRecord) {
//             Log::error('  No reset token found', ['email' => $email]);
//             return back()
//                 ->withInput($request->only('email'))
//                 ->withErrors(['email' => 'Invalid or expired reset token.']);
//         }

//         // Step 3: Verify token
//         if (!Hash::check($token, $tokenRecord->token)) {
//             Log::error('  Token mismatch', [
//                 'provided' => substr($token, 0, 10) . '...',
//                 'stored' => substr($tokenRecord->token, 0, 10) . '...'
//             ]);
//             return back()
//                 ->withInput($request->only('email'))
//                 ->withErrors(['email' => 'Invalid or expired reset token.']);
//         }

//         // Step 4: Check expiration (60 minutes)
//         $createdAt = \Carbon\Carbon::parse($tokenRecord->created_at);
//         if ($createdAt->addMinutes(60)->isPast()) {
//             Log::error('  Token expired', ['created_at' => $tokenRecord->created_at]);

//             DB::table('password_reset_tokens')->where('email', $email)->delete();

//             return back()
//                 ->withInput($request->only('email'))
//                 ->withErrors(['email' => 'This reset token has expired. Please request a new one.']);
//         }

//         // Step 5: Update PIN
//         try {
//             $user->pin = Hash::make($pin);
//             $user->save();

//             // Delete token
//             DB::table('password_reset_tokens')->where('email', $email)->delete();

//             Log::info('  PIN reset successful', ['user_id' => $user->user_id]);

//             return redirect()->route('login')
//                 ->with('success', 'Your PIN has been reset successfully! You can now login with your new PIN.');

//         } catch (\Exception $e) {
//             Log::error('  PIN update failed', [
//                 'error' => $e->getMessage(),
//                 'user_id' => $user->user_id
//             ]);

//             return back()
//                 ->withInput($request->only('email'))
//                 ->withErrors(['email' => 'Failed to reset PIN. Please try again.']);
//         }
//     }
// }








namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;

class AuthController extends Controller
{
    /**
     * Show the login form
     */
    public function showLoginForm()
    {
        return view('auth.login');
    }



    // public function login(Request $request)
    // {
    //     // dd($request->all());
    //     // Validate input
    //     $validator = Validator::make($request->all(), [
    //         'login_input' => 'required|string|max:255',
    //         'pin' => 'required|string|max:10',
    //     ]);

    //     if ($validator->fails()) {
    //         return redirect()->back()
    //             ->withErrors($validator)
    //             ->withInput();
    //     }

    //     $loginInput = $request->login_input;
    //     $providedPin = $request->pin;

    //     // Determine if login input is email or user_id
    //     $isEmail = filter_var($loginInput, FILTER_VALIDATE_EMAIL);

    //     // Find user
    //     $user = $isEmail
    //         ? User::where('email', $loginInput)->first()
    //         : User::where('user_id', $loginInput)->first();

    //     if (!$user) {
    //         return redirect()->back()->withErrors([
    //             'login_input' => 'Invalid login credentials.'
    //         ])->withInput();
    //     }

    //     // Check user status
    //     if ($user->status !== 'Active') {
    //         return redirect()->back()->withErrors([
    //             'login_input' => 'Your account is inactive. Please contact the administrator.'
    //         ])->withInput();
    //     }

    //     // Check PIN or Password
    //     $pinValid = (!empty($user->pin) && Hash::check($providedPin, $user->pin));
    //     $passwordValid = (!empty($user->password) && Hash::check($providedPin, $user->password));

    //     if (!$pinValid && !$passwordValid) {
    //         return redirect()->back()->withErrors([
    //             'pin' => 'Invalid PIN.'
    //         ])->withInput();
    //     }

    //     // ✅ Login the user (ONCE!)
    //     Auth::login($user, $request->filled('remember'));

    //     // ✅ Regenerate session
    //     $request->session()->regenerate();

    //     // ✅ Store session data
    //     session([
    //         'username' => $user->name,
    //         'user_id' => $user->id,
    //         'role' => $user->role,
    //         'country_id' => $user->country_id,
    //         'user_code' => $user->user_id,
    //         'authenticated' => true
    //     ]);

    //     Log::info('Login successful', [
    //         'user_id' => $user->id,
    //         'role' => $user->role,
    //         'redirecting_to' => 'home'
    //     ]);
    // }


    public function login(Request $request)
    {
        // Validate input fields
        $validator = Validator::make($request->all(), [
            'login_input' => 'required|string|max:255',
            'pin' => 'required|string|max:10',
        ]);

        if ($validator->fails()) {
            return redirect()->back()
                ->withErrors($validator)
                ->withInput();
        }

        $loginInput = $request->login_input;
        $providedPin = $request->pin;

        // Determine if input is email or user_id
        $isEmail = filter_var($loginInput, FILTER_VALIDATE_EMAIL);

        // Find the user
        $user = $isEmail
            ? User::where('email', $loginInput)->first()
            : User::where('user_id', $loginInput)->first();

        if (!$user) {
            return redirect()->back()
                ->withErrors(['login_input' => 'Invalid login credentials.'])
                ->withInput();
        }

        // Check if account is active
        if ($user->status !== 'Active') {
            return redirect()->back()
                ->withErrors(['login_input' => 'Your account is inactive. Please contact the administrator.'])
                ->withInput();
        }

        // Verify PIN or fallback to password field (for backward compatibility)
        $pinValid = !empty($user->pin) && Hash::check($providedPin, $user->pin);
        $passwordValid = !empty($user->password) && Hash::check($providedPin, $user->password);

        if (!$pinValid && !$passwordValid) {
            return redirect()->back()
                ->withErrors(['pin' => 'Invalid PIN.'])
                ->withInput();
        }

        // Login the user
        Auth::login($user, $request->filled('remember'));

        // Regenerate session to prevent session fixation
        $request->session()->regenerate();

        // Store useful data in session
        session([
            'username' => $user->name,
            'user_id' => $user->id,
            'role' => $user->role,
            'country_id' => $user->country_id,
            'user_code' => $user->user_id,
            'authenticated' => true,
        ]);

        // Log successful login
        Log::info('Login successful', [
            'user_id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'role' => $user->role,
            'ip' => $request->ip(),
        ]);

        // Critical: Redirect to the home route for role-based handling
        return redirect()->route('home');
    }


    public function logout(Request $request)
    {
        Log::info('Logout', ['user_id' => Auth::id()]);
        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect('/login');
    }

    public function showForgotPasswordForm()
    {
        return view('auth.forgot-password');
    }

    public function sendResetLinkWeb(Request $request)
    {
        $request->validate(['email' => 'required|email']);

        $email = $request->email;

        Log::info('🔐 Password reset requested', ['email' => $email]);

        // Find user
        $user = User::where('email', $email)->first();

        if (!$user) {
            Log::warning('User not found', ['email' => $email]);
            // For security, return success even if user not found
            return back()->with('status', 'If that email address exists in our system, we\'ve sent a PIN reset link to it.');
        }

        Log::info('User found', [
            'user_id' => $user->user_id,
            'email' => $user->email
        ]);

        // Generate token
        $token = Str::random(64);

        // Store token in database (using password_resets table)
        DB::table('password_resets')->updateOrInsert(
            ['email' => $email],
            [
                'token' => Hash::make($token),
                'created_at' => now()
            ]
        );

        // Send email
        try {
            $resetUrl = url('/reset-password/' . $token . '?email=' . urlencode($email));

            Mail::send('auth.custom-reset-email', ['url' => $resetUrl], function ($message) use ($user) {
                $message->to($user->email);
                $message->subject('Reset Your PIN - QikLeadz');
            });

            Log::info('📧 Custom reset email sent', ['email' => $email]);

            return back()->with('status', 'We have emailed your PIN reset link!');

        } catch (\Exception $e) {
            Log::error('Email sending failed', ['error' => $e->getMessage()]);
            return back()->withErrors(['email' => 'Failed to send reset email. Please try again.']);
        }
    }

    /**
     * Show reset password form
     */
    public function showResetPasswordForm($token)
    {
        $email = request()->get('email');

        Log::info('📝 Showing reset form', [
            'token_preview' => substr($token, 0, 10) . '...',
            'email' => $email
        ]);

        return view('auth.reset-password', [
            'token' => $token,
            'email' => $email
        ]);
    }

    /**
     * Reset password
     */
    public function resetPasswordWeb(Request $request)
    {
        $request->validate([
            'token' => 'required',
            'email' => 'required|email',
            'pin' => 'required|numeric|digits:4|confirmed',
        ]);

        $email = $request->email;
        $token = $request->token;
        $pin = $request->pin;

        Log::info('🔄 Password reset attempt', ['email' => $email]);

        // Find user
        $user = User::where('email', $email)->first();

        if (!$user) {
            Log::error('User not found', ['email' => $email]);
            return back()
                ->withInput($request->only('email'))
                ->withErrors(['email' => 'We can\'t find a user with that email address.']);
        }

        Log::info('User found', ['user_id' => $user->user_id]);

        // Check token
        $tokenRecord = DB::table('password_resets')
            ->where('email', $email)
            ->first();

        if (!$tokenRecord) {
            Log::error('No reset token found', ['email' => $email]);
            return back()
                ->withInput($request->only('email'))
                ->withErrors(['email' => 'Invalid or expired reset token.']);
        }

        // Verify token
        if (!Hash::check($token, $tokenRecord->token)) {
            Log::error('Token mismatch', [
                'provided' => substr($token, 0, 10) . '...',
                'stored' => substr($tokenRecord->token, 0, 10) . '...'
            ]);
            return back()
                ->withInput($request->only('email'))
                ->withErrors(['email' => 'Invalid or expired reset token.']);
        }

        // Check expiration (60 minutes)
        $createdAt = \Carbon\Carbon::parse($tokenRecord->created_at);
        if ($createdAt->addMinutes(60)->isPast()) {
            Log::error('Token expired', ['created_at' => $tokenRecord->created_at]);

            DB::table('password_resets')->where('email', $email)->delete();

            return back()
                ->withInput($request->only('email'))
                ->withErrors(['email' => 'This reset token has expired. Please request a new one.']);
        }

        // Update PIN
        try {
            $user->pin = Hash::make($pin);
            $user->save();

            // Delete token
            DB::table('password_resets')->where('email', $email)->delete();

            Log::info('PIN reset successful', ['user_id' => $user->user_id]);

            return redirect()->route('login')
                ->with('success', 'Your PIN has been reset successfully! You can now login with your new PIN.');

        } catch (\Exception $e) {
            Log::error('PIN update failed', [
                'error' => $e->getMessage(),
                'user_id' => $user->user_id
            ]);

            return back()
                ->withInput($request->only('email'))
                ->withErrors(['email' => 'Failed to reset PIN. Please try again.']);
        }
    }
}
