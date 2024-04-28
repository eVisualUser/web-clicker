class API {
    apiUrl = ""

    constructor(newApiUrl) {
        this.apiUrl = newApiUrl;
    }

    Request() {
        return fetch(this.apiUrl);
    }

    Request(request) {
        return fetch(this.apiUrl, request);
    }
}
