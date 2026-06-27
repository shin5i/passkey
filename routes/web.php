<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});

Route::get('/dashboard', function () {
    return view('dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});


#サーバーのWordpressの以下のファイルがLaravelの認証状態を取得するためのResponseを返す
#/home/sh5web/www/tokyo6/wp-content/mu-plugins/mu-plugins/laravel-auth-check.php
Route::get('/api/internal-auth-check', function () {
    if (Auth::check()) {
        return response()->json([
            'authenticated' => true,
            'user_id' => Auth::id()
        ]);
    }

    return response()->json([
        'authenticated' => false
    ], 401); // 未ログイン時は 401 Unauthorized を返す
});


require __DIR__.'/auth.php';
