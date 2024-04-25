class Market extends Entity {
    name = "WorldMarket"

    shelter;

    /**
    * Return the number of client available.
    */
    GetClientCount() {
        return this.shelter.size * GetRandomNumber(1, this.shelter.clientCapacity);
    }

    /**
    * The minimal status that a client need to bought a dog.
    */
    GetMinimalStatus() {
        return GetRandomNumber(this.shelter.size, 10);
    }
    
    OnStart() {
        this.skippedFromSaving.push("shelter");

        CreateEvent("EndOfMonth");
        BindEvent("EndOfMonth", this.OnEndOfMonth.bind(this));

        this.shelter = this.GetEntityByName("Shelter");
    }

    OnEndOfMonth() {
        let clients = this.GetClientCount();
        let minimumStatus = this.GetMinimalStatus();

        let i = this.shelter.dogs.length;
        while(i--) {
            if (clients == 0) {
                break;
            }

            if (this.shelter.dogs[i].status >= minimumStatus) {
                this.shelter.money += this.shelter.dogPrice;
                this.shelter.dogs.splice(i);
                this.shelter.OnSellDog(i);
                clients--;
            }
        }
    }
}
