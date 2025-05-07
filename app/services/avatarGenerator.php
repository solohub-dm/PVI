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

function generateAvatar($savePath, $id = null, $pixelSize = 6, $size = 128)
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