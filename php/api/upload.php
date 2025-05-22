<?php
header('Content-Type: application/json');

$input = json_decode(file_get_contents('php://input'), true);
$response = [
    'success' => false,
    'files' => [],
    'errors' => []
];

// Check if input is valid JSON and is an array
if (!is_array($input)) {
    $response['errors'][] = 'Invalid input JSON.';
    echo json_encode($response);
    exit;
}

$uploadDir = __DIR__ . '/uploads/';
if (!is_dir($uploadDir)) {
    mkdir($uploadDir, 0755, true);
}

foreach ($input as $key => $base64data) {
    if (!preg_match('/^data:image\/(\w+);base64,/', $base64data, $matches)) {
        $response['errors'][] = "$key: Invalid image format.";
        continue;
    }

    $ext = $matches[1];
    $base64 = substr($base64data, strpos($base64data, ',') + 1);
    $decodedData = base64_decode($base64);

    if ($decodedData === false) {
        $response['errors'][] = "$key: Failed to decode base64.";
        continue;
    }

    $filename = uniqid("img_", true) . '.' . $ext;
    $filepath = $uploadDir . $filename;

    if (file_put_contents($filepath, $decodedData)) {
        $response['files'][] = [
            'name' => $filename,
            'size' => strlen($decodedData),
            'url' => '/uploads/' . $filename
        ];
    } else {
        $response['errors'][] = "$key: Failed to save file.";
    }
}

$response['success'] = count($response['files']) > 0;
echo json_encode($response);
