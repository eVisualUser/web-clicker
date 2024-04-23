class Player extends Entity {
    name = "Player";

    GetRandomNumber(min, max) {
        return Math.random() * (max - min) + min;
    }

    async OnStart() {
        /*let dogAPI = this.GetEntityByName("DogAPI");
        if (dogAPI != null) {
            let image = document.createElement("img");
            const dogImage = await dogAPI.GetDogImage();
            image.src = dogImage;
            
            document.body.appendChild(image);
        }*/
    }

    async OnUpdate() {

    }
}
