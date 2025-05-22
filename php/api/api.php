<?php

include_once dirname(__FILE__) . "/../corsheaders.php";

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

include_once dirname(__FILE__) . "/../gapiv2/dbconn.php";
include_once dirname(__FILE__) . "/../gapiv2/v2apicore.php";
include_once dirname(__FILE__) . "/../utils.php";
include_once dirname(__FILE__) . "/../security/security.config.php";

// Get authentication details
$appid = getAppId();
$token = getToken();

if (validateJwt($token, false) == false) {
    http_response_code(401);
    echo json_encode([
        'error' => true,
        'message' => 'Unauthorized'
    ]);
    die();
}

$user = getUserFromToken($token);
$userid = $user->id;

include_once "./functions/campaignlinks.php";
include_once "./functions/campaigns.php";
include_once "./functions/applicationsevents.php";
include_once "./functions/applicationreports.php";


// Define the configurations
$babyGoConfig = [
    "adverts" => [
        "tablename" => "adverts",
        "key" => "id",
        "select" => "getAdverts",
        "create" => ["title", "description", "price", "item_condition", "category", "images", "location", "posted_date", "expiry_date", "priority", "priority_expiry_date", "views", "tags", "user_id", "status"],
        "update" => ["title", "description", "price", "item_condition", "category", "images", "location", "posted_date", "expiry_date", "priority", "priority_expiry_date", "views", "tags", "status"],
        "beforecreate" => "beforeCreateAdvert",
    ],
    "user" => [
        "tablename" => "adverts",
        "key" => "user_id",
        "select" => ["id", "user_id", "name", "api_key", "created_at", "modified_at"],
        "create" => false,
        "update" => [],
        "delete" => false,
        "subkeys" => [
            "adverts" => [
                "tablename" => "adverts",
                "key" => "user_id",
                "select" => "getMyAdverts",
            ],
            "messages" => [
                "tablename" => "messages",
                "key" => "user_id",
                "select" => "getMyMessages",
            ],
        ]
    ],
    "messages" => [
        "tablename" => "messages",
        "key" => "id",
        "select" => "getMyMessages",
        "create" => ["ad_id", "from_user_id", "to_user_id", "content", "read_flag", "reply_to_message_id"],
        "beforecreate" => "createMessage",
        "subkeys" => [
            "read" => [
                "tablename" => "messages",
                "key" => "id",
                "select" => "readMail",
            ],
        ]
    ],

    "post" => [
        "endpoint" => "functionName"

    ]
];

runAPI($babyGoConfig);

function reverseApiKey($fields)
{
    $id = $fields['apikey'];
    return decodeApiKey($id);
}

function insertApplication($fields)
{
    global $gapiconn, $userid;

    $query = "INSERT INTO applications (user_id, name, description) VALUES (?, ?, ?)";
    $stmt = $gapiconn->prepare($query);
    $stmt->bind_param("iss", $userid, $fields['name'], $fields['description']);
    $stmt->execute();

    $appId = $stmt->insert_id;
    $stmt->close();

    $apiKey = createApiKey($appId);

    $updateQuery = "UPDATE applications SET api_key = ? WHERE id = ?";
    $stmt = $gapiconn->prepare($updateQuery);
    $stmt->bind_param("si", $apiKey, $appId);
    $stmt->execute();
    $stmt->close();

    return [
        'id' => $appId,
        'api_key' => $apiKey
    ];
}

function createApiKey($id)
{
    // Generate a full UUID (random 16 bytes)
    $data = random_bytes(16);
    $uuid = vsprintf('%08s-%04s-%04x-%04x-%012x', [
        bin2hex(substr($data, 0, 4)),           // first 8 chars
        bin2hex(substr($data, 4, 2)),           // 4 chars
        (hexdec(bin2hex(substr($data, 6, 2))) & 0x0fff) | 0x4000, // version 4
        (hexdec(bin2hex(substr($data, 8, 2))) & 0x3fff) | 0x8000, // variant
        hexdec(bin2hex(substr($data, 10, 6)))   // 12 chars
    ]);

    // Extract and transform
    $parts = explode('-', $uuid);
    $base = $parts[0];                     // First 8 characters
    $baseInt = hexdec($base);
    $encodedInt = $baseInt + $id;
    $encoded = strtolower(str_pad(dechex($encodedInt), 8, '0', STR_PAD_LEFT));

    // Replace second part of UUID with encoded value
    $parts[1] = $encoded;
    return implode('-', $parts);
}

function decodeApiKey($guid)
{
    $parts = explode('-', $guid);
    if (count($parts) < 2) {
        throw new Exception("Invalid GUID format.");
    }

    $base = $parts[0];
    $encoded = $parts[1];

    $baseInt = hexdec($base);
    $encodedInt = hexdec($encoded);

    return $encodedInt - $baseInt;
}

function deleteApplication($fields)
{
    global $gapiconn;

    $appId = $fields['id'];

    // Delete from invitations
    $query = "DELETE FROM invitations WHERE application_id = ?";
    $stmt = $gapiconn->prepare($query);
    $stmt->bind_param("i", $appId);
    $stmt->execute();
    $stmt->close();

    // Delete from application_users
    $query = "DELETE FROM application_users WHERE application_id = ?";
    $stmt = $gapiconn->prepare($query);
    $stmt->bind_param("i", $appId);
    $stmt->execute();
    $stmt->close();

    // Delete from events
    $query = "DELETE FROM events WHERE application_id = ?";
    $stmt = $gapiconn->prepare($query);
    $stmt->bind_param("i", $appId);
    $stmt->execute();
    $stmt->close();

    // Delete from analytics
    $query = "DELETE FROM analytics WHERE application_id = ?";
    $stmt = $gapiconn->prepare($query);
    $stmt->bind_param("i", $appId);
    $stmt->execute();
    $stmt->close();

    // Finally, delete from applications
    $query = "DELETE FROM applications WHERE id = ?";
    $stmt = $gapiconn->prepare($query);
    $stmt->bind_param("i", $appId);
    $stmt->execute();
    $stmt->close();

    return [
        'id' => $appId,
        'deleted' => true
    ];
}

function getAdverts($config, $id)
{
    global $gapiconn, $userid;
    $params = [$userid, $id];
    $query = "SELECT 
        (SELECT COUNT(1) FROM user_favorites 
            WHERE user_favorites.ad_id = adverts.id AND user_id = ?) fav, 
        adverts.* FROM adverts
        where (adverts.status not in ('deleted', 'expired', 'removed')
        OR adverts.id = ?)
    ";
    if ($id) {
        $query .= " AND adverts.id = ?";
        $params[] = $id;
    } 
    $adverts = executeSQL($query, $params, ["JSON" => ["images", "tags"]]);
    return $adverts;
}

function getMyAdverts()
{
    global $gapiconn, $userid;
    $query = "SELECT  * FROM adverts
        where user_id = ?
        and status not in ('deleted', 'expired', 'removed')
    ";
    $adverts = executeSQL($query, [$userid], ["JSON" => ["images", "tags"]]);

    return $adverts;
}

function getMyMessages()
{
    global $gapiconn, $userid;
    $query = "SELECT 
    m.ad_id,
    a.title AS subject,
    CASE 
        WHEN m.from_user_id = ? THEN m.to_user_id
        ELSE m.from_user_id
    END AS participant_user_id,
    JSON_ARRAYAGG(
        JSON_OBJECT(
            'id', m.id,
            'from_user_id', m.from_user_id,
            'to_user_id', m.to_user_id,
            'content', m.content,
            'created_at', m.created_at,
            'read_flag', m.read_flag,
            'reply_to_message_id', m.reply_to_message_id
        )
    ) AS messages
FROM messages m
JOIN adverts a ON m.ad_id = a.id
WHERE m.from_user_id = ? OR m.to_user_id = ?
GROUP BY m.ad_id, a.title, participant_user_id
ORDER BY MAX(m.created_at) DESC;
    ";
    $messages = executeSQL($query, [$userid, $userid, $userid], ["JSON" => "messages"]);
    return $messages;
}

function createMessage($config, $fields)
{
    global $userid;
    $fields["from_user_id"] = $userid;
    return [$config, $fields];
}

function readMail($config, $fields)
{

    $id = $config["where"]["id"];
    global $gapiconn;

    // Fetch the ad_id for the given message id
    $query = "SELECT ad_id FROM messages WHERE id = ?";

    $stmt = $gapiconn->prepare($query);
    $stmt->bind_param("i", $id);
    $stmt->execute();
    $stmt->bind_result($ad_id);
    $row = $stmt->fetch() ? ['ad_id' => $ad_id] : null;
    $stmt->close();

    if (!$row) {
        throw new Exception("Message not found.");
    }

    $ad_id = $row['ad_id'];

    // Update all messages for the current ad to mark them as read
    $updateQuery = "UPDATE messages SET read_flag = 1 WHERE ad_id = ? and id <= ?";
    $stmt = $gapiconn->prepare($updateQuery);
    $stmt->bind_param("ii", $ad_id, $id);
    $stmt->execute();
    $stmt->close();

    return getMyMessages();
}

function beforeCreateAdvert($config, $fields)
{
    global $userid;
    $fields["user_id"] = $userid;
    $fields["posted_date"] = date("Y-m-d H:i:s");
    $fields["expiry_date"] = date("Y-m-d H:i:s", strtotime("+30 days"));
    if ($fields["priority"] == 1) {
        $fields["priority_expiry_date"] = date("Y-m-d H:i:s", strtotime("+30 days"));
    } else {
        $fields["priority_expiry_date"] = null;
    }
    if ($fields["images"] == null) {
        $fields["images"] = json_encode([]);
    } else {
        $fields["images"] = json_encode($fields["images"]);
    }
    if ($fields["tags"] == null) {
        $fields["tags"] = json_encode([]);
    } else {
        $fields["tags"] = json_encode($fields["tags"]);
    }
    return [$config, $fields];
}