<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{ $title ?? 'Soraku Stream' }}</title>
    @vite('resources/js/app.jsx', 'resources/css/app.css')
</head>
<body class="bg-gray-900 text-white">
    @inertia
</body>
</html>