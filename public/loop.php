<?php
// find-loop.php
require __DIR__.'/../vendor/autoload.php';
$app = require_once __DIR__.'/../bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

echo "<h2>Debug Redirect Loop</h2>";

// Check current session
echo "<h3>Session Status:</h3>";
echo "Session ID: " . session()->getId() . "<br>";
echo "Is authenticated: " . (auth()->check() ? 'YES' : 'NO') . "<br>";

if (auth()->check()) {
    echo "User: " . auth()->user()->email . "<br>";
    echo "Role: " . auth()->user()->role . "<br>";
}

// Check middleware
echo "<h3>Kernel Middleware:</h3>";
$kernel = app(\Illuminate\Contracts\Http\Kernel::class);
$reflection = new ReflectionClass($kernel);
$middlewareProperty = $reflection->getProperty('middleware');
$middlewareProperty->setAccessible(true);
$middleware = $middlewareProperty->getValue($kernel);

foreach ($middleware as $m) {
    echo $m . "<br>";
}

// Clear everything
echo "<hr><h3>Clearing Everything:</h3>";
session()->flush();
echo "Session cleared<br>";

\Illuminate\Support\Facades\Artisan::call('route:clear');
echo "Routes cleared<br>";

echo "<a href='/login' style='padding:10px;background:blue;color:white;'>Go to Login</a>";