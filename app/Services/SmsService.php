<?php

namespace App\Services;

class SmsService
{
    public function send(string $to, string $message): void
    {
        // In local/testing environment, just log the SMS
        \Log::info("SMS → {$to}: {$message}");
    }
}
