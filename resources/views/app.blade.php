<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, shrink-to-fit=no">
    <meta name="csrf-token" content="{{ csrf_token() }}">

    <title id="dynamicTitle">Streaming Radio Yasmaga FM 96.9 MHz</title>

    <link rel="shortcut icon" id="dynamicFavicon" href="{{ asset('content.webp') }}">

    <link href="https://fonts.googleapis.com/css?family=Nunito:400,600,700" rel="stylesheet">

    @viteReactRefresh
    @vite(['resources/js/src/main.tsx'])
</head>

<body>
<noscript>
    <strong>We're sorry but the app doesn't work properly without JavaScript enabled. Please enable it to continue.</strong>
</noscript>

<div id="root"></div>

<!-- Axios script -->
<script src="https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js"></script>

<script>
    // Function to fetch contents
    const fetchContents = async (name) => {
        try {
            const response = await axios.get('/api/contents', {
                params: {
                    name: name,
                },
            });
            if (response.data && response.data.contents) {
                const contentsWithParsedMetadata = response.data.contents.map((content) => ({
                    ...content,
                    metadata: JSON.parse(content.metadata),
                }));

                if (contentsWithParsedMetadata[0].metadata.type === 'image') {
                    return contentsWithParsedMetadata[0].metadata.image;
                } else {
                    return contentsWithParsedMetadata[0].metadata.value;
                }
            } else {
                return '';
            }
        } catch (error) {
            console.error('Error fetching contents:', error);
            return '';
        }
    };

    const updateApplicationName = async () => {
        const newTitle = await fetchContents('nama aplikasi');
        document.getElementById('dynamicTitle').innerText = newTitle || 'Streaming Radio Yasmaga FM 96.9 MHz';
    };

    const updateLogo = async () => {
        const newLogo = await fetchContents('favicon');
        document.getElementById('dynamicFavicon').href = `/storage/${newLogo}` || '{{ asset('content.webp') }}';
    };

    window.onload = () => {
        updateApplicationName();
        updateLogo();
    };
</script>

</body>
</html>
