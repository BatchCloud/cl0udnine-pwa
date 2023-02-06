document.addEventListener('alpine:init', () => {
    /** @method $component */
    Alpine.$component = (xComponent) => document
        .querySelector('[x-component="'+xComponent+'"]')
        ?._x_dataStack[0];

    Alpine.magic('component', () => Alpine.$component);
});


function modal(id) {
    return {
        id,

        get show() {
            return this.$component('modalStack').active === this.id;
        },
    };
}

function modalStack() {
    return {
        items: [],

        get active() {
            return this.items[this.items.length-1] || null;
        },

        add(id) {
            this.items.push(id);
        },

        remove(id = this.active) {
            this.items = this.items.filter(item => item !== id);
        },
    };
}

document.addEventListener('alpine:init', () => {
    /** @method $modal */
    Alpine.magic('modal', () => ({
        get stack() {
            return Alpine.$component('modalStack');
        },

        open(id) {
            this.stack.add(id);
        },

        close() {
            this.stack.remove(this.stack.active);
            return this;
        },
    }));
});

function system() {
    return {
        init() {

            if ('serviceWorker' in navigator) {
                navigator.serviceWorker.register('/worker.js');
                navigator.serviceWorker.addEventListener('controllerchange', () => {
                    console.log('Update Worker')
                    this.$modal.open('worker-update-modal')
                });

                navigator.registerProtocolHandler('web+cloudnine', '?handler=%s')
            }
        },
    }
};