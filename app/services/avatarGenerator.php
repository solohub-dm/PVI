<?php
function hslToRgb($h, $s, $l) {
    $h /= 360;
    $s /= 100;
    $l /= 100;
    $r = $g = $b = 0;

    if ($s == 0) {
        $r = $g = $b = $l;
    } else {
        $hue2rgb = function($p, $q, $t) {
            if ($t < 0) $t += 1;
            if ($t > 1) $t -= 1;
            if ($t < 1/6) return $p + ($q - $p) * 6 * $t;
            if ($t < 1/2) return $q;
            if ($t < 2/3) return $p + ($q - $p) * (2/3 - $t) * 6;
            return $p;
        };
        $q = $l < 0.5 ? $l * (1 + $s) : $l + $s - $l * $s;
        $p = 2 * $l - $q;
        $r = $hue2rgb($p, $q, $h + 1/3);
        $g = $hue2rgb($p, $q, $h);
        $b = $hue2rgb($p, $q, $h - 1/3);
    }
    return [
        round($r * 255),
        round($g * 255),
        round($b * 255)
    ];
}

function getRandomColor($seed) {
    mt_srand($seed);
    $h = mt_rand(0, 359);
    $s = 30 + mt_rand(0, 50);
    $l = 30 + mt_rand(0, 40);
    return hslToRgb($h, $s, $l);
}

function getBgColor($seed) {
  mt_srand($seed + 1000);
  $h = mt_rand(0, 359);
  return hslToRgb($h, 30, 92);
}

function generateAvatar($savePath, $id = null, $pixelSize = 16, $size = 128)
{
    $seed = $id !== null ? crc32($id) : rand();
    $grid = intval($size / $pixelSize);
    $halfGrid = intval(ceil($grid / 2));

    $img = imagecreatetruecolor($size, $size);

    $bgRgb = getBgColor($seed);
    $bgColor = imagecolorallocate($img, $bgRgb[0], $bgRgb[1], $bgRgb[2]);
    imagefilledrectangle($img, 0, 0, $size, $size, $bgColor);

    $fgRgb = getRandomColor($seed + 5000);
    $fgColor = imagecolorallocate($img, $fgRgb[0], $fgRgb[1], $fgRgb[2]);

    mt_srand($seed + 2000);
    $seedArr = [];
    for ($y = 0; $y < $grid; $y++) {
        for ($x = 0; $x < $halfGrid; $x++) {
            $seedArr[$y * $halfGrid + $x] = mt_rand(0, 1) > 0;
        }
    }

    for ($y = 0; $y < $grid; $y++) {
        for ($x = 0; $x < $halfGrid; $x++) {
            $i = $y * $halfGrid + $x;
            if ($seedArr[$i]) {
                $px = $x * $pixelSize;
                $py = $y * $pixelSize;
                imagefilledrectangle($img, $px, $py, $px + $pixelSize - 1, $py + $pixelSize - 1, $fgColor);

                $mx = ($grid - $x - 1) * $pixelSize;
                imagefilledrectangle($img, $mx, $py, $mx + $pixelSize - 1, $py + $pixelSize - 1, $fgColor);
            }
        }
    }

    $dir = dirname($savePath);
    if (!is_dir($dir)) {
        mkdir($dir, 0777, true);
    }
    
    imagepng($img, $savePath);
    imagedestroy($img);
}

function generateAvatarFileName($id, $ext = 'png')
{
    $hash = md5('avatar_' . $id);
    return "avatar_{$hash}.{$ext}";
}

function deleteAvatarFile($url)
{
    if (!empty($url)) {
        $oldPath = dirname(__DIR__, 2) . '/' . $url;
        if (is_file($oldPath)) {
            unlink($oldPath);
        }
    }
}

function getGenerateAvatar($user)
{
    $id = $user->id;
    $url_avatar = $user->url_avatar;

    $avatarFileName = generateAvatarFileName($id, 'png');
    $avatarPath = dirname(__DIR__, 2) . '/uploads/avatars/' . $avatarFileName;

    deleteAvatarFile($url_avatar);

    $dir = dirname($avatarPath);
    if (!is_dir($dir)) {
        mkdir($dir, 0777, true);
    }

    generateAvatar($avatarPath, $id);
    $avatarPath = 'uploads/avatars/' . $avatarFileName;

    return $avatarPath;
}

function uploadAvatarSave($user, $file)
{   
    $id = $user->id;
    $url_avatar = $user->url_avatar;

    $targetDir = dirname(__DIR__, 2) . '/uploads/avatars/';
    $ext = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
    $allowed = ['jpg', 'jpeg', 'png', 'webp'];
    if (!in_array($ext, $allowed)) {
        return ['error' => 'Invalid file type'];
    }

    $avatarFileName = generateAvatarFileName($id, $ext);
    $avatarPath = $targetDir . $avatarFileName;

    deleteAvatarFile($url_avatar);

    if (!is_dir($targetDir)) {
        mkdir($targetDir, 0777, true);
    }

    $img = null;
    if ($ext === 'jpg' || $ext === 'jpeg') $img = imagecreatefromjpeg($file['tmp_name']);
    if ($ext === 'png') $img = imagecreatefrompng($file['tmp_name']);
    if ($ext === 'webp') $img = imagecreatefromwebp($file['tmp_name']);
    if (!$img) return ['error' => 'Cannot process image'];

    // Визначаємо розміри вихідного зображення
    $srcWidth = imagesx($img);
    $srcHeight = imagesy($img);

    // Визначаємо розмір для вписування в 128x128 по вужчій стороні (cover)
    $dstSize = 128;
    $ratio = max($dstSize / $srcWidth, $dstSize / $srcHeight); // max для cover
    $newWidth = (int)($srcWidth * $ratio);
    $newHeight = (int)($srcHeight * $ratio);

    // Центруємо зображення (обрізаємо зайве)
    $dstImg = imagecreatetruecolor($dstSize, $dstSize);

    // Прозорий фон для PNG/WebP
    if ($ext === 'png' || $ext === 'webp') {
        imagealphablending($dstImg, false);
        imagesavealpha($dstImg, true);
        $transparent = imagecolorallocatealpha($dstImg, 0, 0, 0, 127);
        imagefilledrectangle($dstImg, 0, 0, $dstSize, $dstSize, $transparent);
    } else {
        $white = imagecolorallocate($dstImg, 255, 255, 255);
        imagefilledrectangle($dstImg, 0, 0, $dstSize, $dstSize, $white);
    }

    // Координати для crop (обрізання по центру)
    $srcX = (int)(($newWidth - $dstSize) / 2);
    $srcY = (int)(($newHeight - $dstSize) / 2);

    // Створюємо тимчасове зображення з новими розмірами (cover)
    $tmpImg = imagecreatetruecolor($newWidth, $newHeight);
    if ($ext === 'png' || $ext === 'webp') {
        imagealphablending($tmpImg, false);
        imagesavealpha($tmpImg, true);
        $transparent = imagecolorallocatealpha($tmpImg, 0, 0, 0, 127);
        imagefilledrectangle($tmpImg, 0, 0, $newWidth, $newHeight, $transparent);
    } else {
        $white = imagecolorallocate($tmpImg, 255, 255, 255);
        imagefilledrectangle($tmpImg, 0, 0, $newWidth, $newHeight, $white);
    }
    imagecopyresampled(
        $tmpImg, $img,
        0, 0, // dst_x, dst_y
        0, 0, // src_x, src_y
        $newWidth, $newHeight, // dst_w, dst_h
        $srcWidth, $srcHeight  // src_w, src_h
    );

    // Обрізаємо по центру до 128x128
    imagecopy(
        $dstImg, $tmpImg,
        0, 0, // dst_x, dst_y
        $srcX, $srcY, // src_x, src_y
        $dstSize, $dstSize // width, height
    );

    imagepng($dstImg, $avatarPath);
    imagedestroy($img);
    imagedestroy($tmpImg);
    imagedestroy($dstImg);

    $avatarPathDb = 'uploads/avatars/' . $avatarFileName;

    return $avatarPathDb;
}