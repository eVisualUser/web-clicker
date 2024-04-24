class Player extends Entity {
    name = "Player";

    button = document.getElementById("clicker-button");
    shelter;

    GetRandomNumber(min, max) {
        return Math.random() * (max - min) + min;
    }

    async OnStart() {
        this.skippedFromSaving.push("button");
        this.skippedFromSaving.push("shelter");

        if (this.button == null) {
            console.error("Failed to get element with id: click-button");
        } else {
            this.shelter = this.GetEntityByName("Shelter");
            if (this.shelter == null) {
                console.error("Missing Shelter");
            }
            this.button.addEventListener("click", this.OnClick.bind(this));
        }
        /*let dogAPI = this.GetEntityByName("DogAPI");
        if (dogAPI != null) {
            let image = document.createElement("img");
            const dogImage = await dogAPI.GetDogImage();
            image.src = dogImage;
            
            document.body.appendChild(image);
        }*/
    }

    OnClick() {
        this.shelter.Work();
    }
}
