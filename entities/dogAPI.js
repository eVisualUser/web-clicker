class DogAPI extends Entity {
    name = "DogAPI";
    
    api = new API("https://dog.ceo/api/breeds/image/random");

    OnStart() {
        this.skippedFromSaving.push("api");
    }

    async GetDogImage() {
        let imageUrl = "";
        console.log(this.api.apiUrl);
        await fetch(this.api.apiUrl)
            .then((res) => res.json())
            .then((data) => imageUrl = data.message);
        return imageUrl;
    }

    OnDestroy() {
        this.api = null;
    }
}
