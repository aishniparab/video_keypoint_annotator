<?php
echo "test";
$payload = json_decode(file_get_contents("php://input"), true);
var_dump($payload);

?>