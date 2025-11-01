<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\Vote;
use Illuminate\Http\Request;

class WaterController extends Controller
{
    public function index()
    {
        $yes = Vote::where('choice', 'yes')->count();
        $no = Vote::where('choice', 'no')->count();

        return Inertia::render('WaterSituation', [
            'stats' => [
                'yes' => $yes,
                'no' => $no,
            ],
        ]);
    }

    public function vote(Request $request)
    {
        $request->validate(['choice' => 'required|in:yes,no']);
        Vote::create(['choice' => $request->choice]);
        return redirect()->back();
    }
}
