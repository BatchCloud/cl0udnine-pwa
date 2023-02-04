if('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/worker.js');
    navigator.serviceWorker.addEventListener('controllerchange', () => {
        console.log('Update Worker')
    });

    navigator.registerProtocolHandler('web+cloudnine', '?handler=%s')
}