<?php
require_once __DIR__ . '/../models/users/User.php';
require_once __DIR__ . '/../services/avatarGenerator.php';


class AvatarController
{

    public static function addGeneratedAvatar($user)
    {
        return get_class($user)::addGeneratedAvatar($user);
    }

    public static function upload($user, $file)
    {
        return get_class($user)::uploadAvatar($user->id, $user->url_avatar, $file);
    }

    // public static function updateAvatar($user)
    // {
    //     if (empty($user->url_avatar)) {
    //         return 'uploads/avatars/default.png';
    //     }

    //     $avatarPath = __DIR__ . '/../../uploads/avatars/' . basename($user->url_avatar);
    //     if (!is_file($avatarPath)) {
    //         return 'uploads/avatars/default.png';
    //     }

    //     $ext = pathinfo($user->url_avatar, PATHINFO_EXTENSION);
    //     $avatarFileName = self::generateAvatarFileName($user->id, $ext);
    //     $avatarPath = __DIR__ . '/../../uploads/avatars/' . $avatarFileName;

    //     return 'uploads/avatars/' . $avatarFileName;
    // }

    // public static function generateAvatarFileName($id, $ext = 'png')
    // {
    //     $hash = md5('avatar_' . $id);
    //     return "avatar_{$hash}.{$ext}";
    // }

    // public static function deleteAvatar($url) {
    //     if (!empty($url)) {
    //         $oldPath = __DIR__ . '/../../uploads/avatars/' . basename($url);
    //         if (is_file($oldPath)) {
    //             unlink($oldPath);
    //         }
    //     }
    // }

    // public static function addGeneratedAvatar($user)
    // {
    //     $avatarFileName = self::generateAvatarFileName($user->id, 'png');
    //     $avatarPath = __DIR__ . '/../../uploads/avatars/' . $avatarFileName;

    //     static::deleteAvatar($user->url_avatar);

    //     $dir = dirname($avatarPath);
    //     if (!is_dir($dir)) {
    //         mkdir($dir, 0777, true);
    //     }

    //     generateAvatar($avatarPath, $user->id);

    //     $class = get_class($user);
    //     $class::updateAvatar($user->id, 'uploads/avatars/' . $avatarFileName);

    //     return 'uploads/avatars/' . $avatarFileName;
    // }

    // public static function upload($user, $file)
    // {
    //     $targetDir = __DIR__ . '/../../uploads/avatars/';
    //     $ext = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
    //     $allowed = ['jpg', 'jpeg', 'png'];
    //     if (!in_array($ext, $allowed)) {
    //         return ['error' => 'Invalid file type'];
    //     }

    //     $avatarFileName = self::generateAvatarFileName($user->id, $ext);
    //     $avatarPath = $targetDir . $avatarFileName;

    //     static::deleteAvatar($user->url_avatar);

    //     if (!is_dir($targetDir)) {
    //         mkdir($targetDir, 0777, true);
    //     }

    //     $img = null;
    //     if ($ext === 'jpg' || $ext === 'jpeg') $img = imagecreatefromjpeg($file['tmp_name']);
    //     if ($ext === 'png') $img = imagecreatefrompng($file['tmp_name']);
    //     if (!$img) return ['error' => 'Cannot process image'];

    //     $resized = imagecreatetruecolor(128, 128);
    //     imagecopyresampled($resized, $img, 0, 0, 0, 0, 128, 128, imagesx($img), imagesy($img));
    //     imagepng($resized, $avatarPath);
    //     imagedestroy($img);
    //     imagedestroy($resized);

    //     $class = get_class($user);
    //     $class::updateAvatar($user->id, 'uploads/avatars/' . $avatarFileName);

    //     return 'uploads/avatars/' . $avatarFileName;
    // }
}
