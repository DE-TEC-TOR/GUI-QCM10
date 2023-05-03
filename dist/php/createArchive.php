<?php

$data_path = "/media/mmcblk0p1/data/";
$zip_path = "/media/mmcblk0p1/zip/";
$zip_ext = "_archive.zip";

// Converts it into a PHP object
$data = json_decode($file_get_contents('php://input'));
$zipname = $data->datetime;
$filename = ($data->filelist)[0];
$include = $data->include;
$IP = $data->IP_addr;

$zip = new ZipArchive;
if ($zip->open($zip_path . $zipname . $zip_ext) === true) {
    $zip->addFile($data_path . $filename, $filename);
    $zip->close();
    $response->zipname = $zip_path . $zipname . $zip_ext;
    $response->IP_addr = $IP;
    echo json_encode($response);
} else {
    echo json_encode(["error" => "Cannot create archive file"]);
}
