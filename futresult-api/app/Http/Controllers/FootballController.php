<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class FootballController extends Controller
{
    private const API_URL = 'https://api.football-data.org/v4';
    private const API_KEY = 'b8d30d3396f3400e8eaf7322ed505016';

    private function fetch(string $endpoint, array $params = []): \Illuminate\Http\Response
    {
        $url = self::API_URL . $endpoint;
        if ($params) {
            $url .= '?' . http_build_query($params);
        }

        $ch = curl_init($url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_HTTPHEADER, ['X-Auth-Token: ' . self::API_KEY]);
        curl_setopt($ch, CURLOPT_TIMEOUT, 15);

        $body     = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);

        return response($body ?: '{}', $httpCode)
            ->header('Content-Type', 'application/json');
    }

    public function matches(Request $request, string $code)
    {
        return $this->fetch("/competitions/{$code}/matches", $request->query());
    }

    public function teams(string $code)
    {
        return $this->fetch("/competitions/{$code}/teams");
    }

    public function teamMatches(string $teamId)
    {
        return $this->fetch("/teams/{$teamId}/matches", ['status' => 'FINISHED', 'limit' => 10]);
    }
}
