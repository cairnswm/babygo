<?php

include_once dirname(__FILE__) . "/../corsheaders.php";
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
$accessTrackerConfig = [
    "adverts" => [
        "tablename" => "adverts",
        "key" => "id",
        "select" => "getAdverts",
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

    "application" => [
        "tablename" => "applications",
        "key" => "id",
        "select" => ["id", "user_id", "name", "api_key", "created_at", "modified_at"],
        "create" => ["user_id", "name", "api_key"],
        "update" => ["name"],
        "delete" => true,
        "beforeselect" => "",
        "beforecreate" => "",
        "beforeupdate" => "",
        "beforedelete" => "",
        "subkeys" => [
            "events" => [
                "tablename" => "events",
                "key" => "application_id",
                "select" => "getEvents",
                "beforeselect" => ""
            ],
            "analytics" => [
                "tablename" => "analytics",
                "key" => "application_id",
                "select" => ["id", "application_id", "date", "total_visits", "unique_visitors", "avg_session_duration", "views_in_order", "latest_views", "views_per_day", "created_at", "modified_at"],
                "beforeselect" => ""
            ],
            "users" => [
                "tablename" => "application_users",
                "key" => "application_id",
                "select" => ["id", "application_id", "user_id", "email", "firstname", "lastname", "role", "created_at", "modified_at"],
                "beforeselect" => ""
            ],
            "invitations" => [
                "tablename" => "invitations",
                "key" => "application_id",
                "select" => ["id", "application_id", "email", "role", "token", "accepted", "sent_at", "accepted_at", "created_at", "modified_at"],
                "beforeselect" => ""
            ],
            "invites" => [
                "tablename" => "invitations",
                "key" => "application_id",
                "select" => ["id", "application_id", "user_id", "email", "role", "token", "accepted", "sent_at", "accepted_at", "created_at", "modified_at"],
                "beforeselect" => ""
            ],
            "site" => [
                "tablename" => "pages",
                "key" => "application_id",
                "select" => "getSiteEvents",
                "beforeselect" => ""
            ],
            "sitebyday" => [
                "tablename" => "pages",
                "key" => "application_id",
                "select" => "getSiteEventsByDay",
                "beforeselect" => ""
            ],
            "page" => [
                "tablename" => "pages",
                "key" => "application_id",
                "select" => "getPageEvents",
                "beforeselect" => ""
            ],
            "pagebyday" => [
                "tablename" => "pages",
                "key" => "application_id",
                "select" => "getPageEventsByDay",
                "beforeselect" => ""
            ],
            "item" => [
                "tablename" => "pages",
                "key" => "application_id",
                "select" => "getItemEvents",
                "beforeselect" => ""
            ],
            "itembyday" => [
                "tablename" => "pages",
                "key" => "application_id",
                "select" => "getItemEventsByDay",
                "beforeselect" => ""
            ],
            "bycountry" => [
                "tablename" => "pages",
                "key" => "application_id",
                "select" => "getMostActiveCountries",
                "beforeselect" => ""
            ]
        ]
    ],

    "event" => [
        "tablename" => "events",
        "key" => "id",
        "select" => ["id", "application_id", "event_date", "ip_address", "page", "item_id", "type", "data", "created_at", "modified_at"],
        "create" => ["application_id", "event_date", "ip_address", "page", "item_id", "type", "data"],
        "update" => [],
        "delete" => false,
        "beforeselect" => "",
        "beforecreate" => "",
        "beforeupdate" => "",
        "beforedelete" => ""
    ],

    "analytics" => [
        "tablename" => "analytics",
        "key" => "id",
        "select" => ["id", "application_id", "date", "total_visits", "unique_visitors", "avg_session_duration", "views_in_order", "latest_views", "views_per_day", "created_at", "modified_at"],
        "create" => ["application_id", "date", "total_visits", "unique_visitors", "avg_session_duration", "views_in_order", "latest_views", "views_per_day"],
        "update" => false,
        "delete" => false,
        "beforeselect" => "",
        "beforecreate" => "",
        "beforeupdate" => "",
        "beforedelete" => ""
    ],

    "location" => [
        "tablename" => "ip_geolocation_cache",
        "key" => "id",
        "select" => ["id", "ip_address", "country", "region", "city", "last_updated", "created_at", "modified_at"],
        "create" => ["ip_address", "country", "region", "city", "last_updated"],
        "update" => ["country", "region", "city", "last_updated"],
        "delete" => false,
        "beforeselect" => "",
        "beforecreate" => "",
        "beforeupdate" => "",
        "beforedelete" => ""
    ],
    "campaign" => [
        "tablename" => "campaigns",
        "key" => "id",
        "select" => ["id", "name", "user_id", "application_id", "created_at", "modified_at"],
        "create" => ["name", "user_id", "application_id"],
        "update" => ["name"],
        "delete" => true,
        "beforeselect" => "",
        "beforecreate" => "",
        "beforeupdate" => "",
        "beforedelete" => "",
        "subkeys" => [
            "links" => [
                "tablename" => "links",
                "key" => "campaign_id",
                "select" => "getCampaignClicksPerLink",
            ],
            "clicks" => [
                "tablename" => "clicks",
                "key" => "campaign_id",
                "select" => "getClicksForCampaign",
            ],
        ]
    ],
    "link" => [
        "tablename" => "links",
        "key" => "id",
        "select" => ["id", "user_id", "campaign_id", "short_code", "destination", "title", "expires_at"],
        "create" => ["campaign_id", "short_code", "destination", "title", "expires_at"],
        "update" => ["short_code", "destination", "title", "expires_at"],
        "delete" => true,
        "beforeselect" => "",
        "beforecreate" => "",
        "beforeupdate" => "",
        "beforedelete" => "",
        "subkeys" => [
            "visits" => [
                "tablename" => "clicks",
                "key" => "link_id",
                "select" => ["id", "link_id", "ip_address", "user_agent", "referer", "created_at"],
            ],
            "clicks" => [
                "tablename" => "clicks",
                "key" => "link_id",
                "select" => "getDailyClicksPerLink",
            ],
            "country" => [
                "tablename" => "clicks",
                "key" => "link_id",
                "select" => "getCountryForLinks",
            ],
        ]
    ],
    "post" => [
        "createApplication" => "insertApplication",
        "decodeApiKey" => "reverseApiKey",
        "deleteApplication" => "deleteApplication",
        "insertLink" => "insertLink",
        "linkClicksByDate" => "getDailyClicksPerLink"

    ]
];

runAPI($accessTrackerConfig);

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

function getAdverts()
{
    global $gapiconn, $userid;
    $query = "SELECT 
        (SELECT COUNT(1) FROM user_favorites 
            WHERE user_favorites.ad_id = adverts.id AND user_id = ?) fav, 
        adverts.* FROM adverts
    ";
    $adverts = executeSQL($query, [$userid], ["JSON" => ["images", "tags"]]);
    return $adverts;
}

function getMyAdverts()
{
    global $gapiconn, $userid;
    $query = "SELECT  * FROM adverts
        where user_id = ?
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
    GROUP BY m.ad_id, a.title
    ORDER BY MAX(m.created_at) DESC;
    ";
    $messages = executeSQL($query, [$userid, $userid], ["JSON" => "messages"]);
    return $messages;
}