<?php
header('Content-Type: application/json');

// CORS ayarları
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

// POST verilerini al
$data = json_decode(file_get_contents('php://input'), true);

if (!isset($data['phone']) || !isset($data['message'])) {
    echo json_encode([
        'success' => false,
        'error' => 'Telefon numarası ve mesaj gereklidir.'
    ]);
    exit;
}

// WaAPI bilgileri
$apiKey = 'WPAPI BILGILERINI GIR';
$instanceId = 'ID GIR (TELEFON TANIMLADIKTAN SONRA YAZAR)';

// Telefon numarasını doğru formata çevir
$phone = $data['phone'];
if (!str_ends_with($phone, '@c.us')) {
    $phone = $phone . '@c.us';
}

// WaAPI endpoint'i
$apiUrl = "https://waapi.app/api/v1/instances/{$instanceId}/client/action/send-message";

// API isteği için veri hazırlama
$postData = [
    'chatId' => $phone,
    'message' => $data['message']
];

// cURL ile API isteği gönderme
$ch = curl_init($apiUrl);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($postData));
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Authorization: Bearer ' . $apiKey,
    'Content-Type: application/json',
    'Accept: application/json'
]);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);

// cURL hata kontrolü
if (curl_errno($ch)) {
    echo json_encode([
        'success' => false,
        'error' => 'cURL Hatası: ' . curl_error($ch)
    ]);
    curl_close($ch);
    exit;
}

curl_close($ch);

// API yanıtını kontrol et
$responseData = json_decode($response, true);

if ($httpCode === 200) {
    echo json_encode([
        'success' => true,
        'message' => 'Mesaj başarıyla gönderildi',
        'response' => $responseData
    ]);
} else {
    echo json_encode([
        'success' => false,
        'error' => $responseData['message'] ?? 'Mesaj gönderilemedi',
        'debug_info' => [
            'http_code' => $httpCode,
            'response' => $responseData,
            'request_data' => $postData
        ]
    ]);
} 