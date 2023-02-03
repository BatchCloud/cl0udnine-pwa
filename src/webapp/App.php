<!doctype html>
<html lang="de">
<head>
    <meta charset="UTF-8">
    <meta name="viewport"
          content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>cl0udnine</title>

    <link href="/dist/main.css" rel="stylesheet">
    <script defer src="/dist/cdn.min.js"></script>
</head>
<body>



    <div x-data="{open: false}">
        <button x-on:click="open=!open" class="bg-blue-500 p-8">Open</button>
        <div x-show="open">
            Hallo Welt
        </div>
    </div>



    <script defer src="/dist/cdn.min.js"></script>
</body>
</html>


