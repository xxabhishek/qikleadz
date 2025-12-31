<?php
// public/test-after-update.php
require __DIR__.'/../vendor/autoload.php';
$app = require_once __DIR__.'/../bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use App\Models\User;
use Illuminate\Support\Facades\Hash;

$user = User::where('email', 'admin@gmail.com')->first();

echo "<h3>Testing PIN '1234':</h3>";
echo "Current PIN hash: " . substr($user->pin, 0, 30) . "...<br>";
echo "Hash check for '1234': " . (Hash::check('1234', $user->pin) ? '✅ MATCHES!' : '❌ NO MATCH') . "<br>";

echo "<h3>Try other common PINs:</h3>";
$commonPins = ['0000', '1111', '2222', '3333', '4444', '5555', '6666', '7777', '8888', '9999', '4321'];
foreach ($commonPins as $pin) {
    echo "PIN $pin: " . (Hash::check($pin, $user->pin) ? '✅' : '❌') . "<br>";
}

echo "<h3>Update User with New PIN:</h3>";
echo '<form method="POST">
    <label>New PIN: <input type="text" name="new_pin" maxlength="4"></label>
    <button type="submit">Update</button>
</form>';

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['new_pin'])) {
    $newPin = $_POST['new_pin'];
    $user->pin = Hash::make($newPin);
    $user->password = Hash::make($newPin);
    $user->save();
    echo "✅ PIN updated to '$newPin'!";
}
