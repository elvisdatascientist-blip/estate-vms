<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class SmsService
{
    protected $apiKey;
    protected $username;
    protected $from;

    public function __construct()
    {
        $this->apiKey = config('services.africastalking.api_key');
        $this->username = config('services.africastalking.username');
        $this->from = config('services.africastalking.from', 'SmartVisitor');
    }

    public function send(string $to, string $message): bool
    {
        // If API credentials not configured, just log
        if (empty($this->apiKey) || empty($this->username)) {
            Log::info("SMS → {$to}: {$message}");
            return true;
        }

        try {
            // Format phone number for Kenya (ensure it starts with +254)
            $to = $this->formatPhoneNumber($to);

            $response = Http::withHeaders([
                'apiKey' => $this->apiKey,
                'Content-Type' => 'application/x-www-form-urlencoded',
                'Accept' => 'application/json',
            ])->asForm()->post('https://api.africastalking.com/version1/messaging', [
                'username' => $this->username,
                'to' => $to,
                'message' => $message,
                'from' => $this->from,
            ]);

            if ($response->successful()) {
                $data = $response->json();
                Log::info("SMS sent successfully to {$to}", ['response' => $data]);
                return true;
            }

            Log::error("SMS failed to {$to}", [
                'status' => $response->status(),
                'response' => $response->body()
            ]);
            return false;

        } catch (\Exception $e) {
            Log::error("SMS exception: {$e->getMessage()}", [
                'to' => $to,
                'trace' => $e->getTraceAsString()
            ]);
            return false;
        }
    }

    /**
     * Format phone number for international format
     * Converts 07XX... to +254XX... or 01XX... to +254XX...
     */
    protected function formatPhoneNumber(string $phone): string
    {
        // Remove any spaces, dashes, or parentheses
        $phone = preg_replace('/[\s\-\(\)]/', '', $phone);

        // If already starts with +254, return as is
        if (str_starts_with($phone, '+254')) {
            return $phone;
        }

        // If starts with 254, add +
        if (str_starts_with($phone, '254')) {
            return '+' . $phone;
        }

        // If starts with 0, replace with +254
        if (str_starts_with($phone, '0')) {
            return '+254' . substr($phone, 1);
        }

        // If starts with 7 or 1 (without leading 0), add +254
        if (preg_match('/^[71]/', $phone)) {
            return '+254' . $phone;
        }

        // Default: assume it's Kenya and add +254
        return '+254' . $phone;
    }

    /**
     * Send visitor arrival notification to tenant
     */
    public function notifyVisitorArrival($visitor): bool
    {
        $tenant = $visitor->tenant;
        $message = "Hi {$tenant->name}, your visitor {$visitor->name} has arrived at the gate and been checked in. - SmartVisitor";
        return $this->send($tenant->phone, $message);
    }

    /**
     * Send visitor overstay notification to tenant
     */
    public function notifyVisitorOverstay($visitor): bool
    {
        $tenant = $visitor->tenant;
        $message = "Alert: Your visitor {$visitor->name} has overstayed their expected departure time ({$visitor->time_out}). Please check. - SmartVisitor";
        return $this->send($tenant->phone, $message);
    }
}
