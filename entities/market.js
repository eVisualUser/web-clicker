class Market extends Entity {
    name = "WorldMarket"

    shelter;

    monthlyClients = 0;
    monthlyStatus = 0;

    /**
    * Return the number of client available.
    */
    GetClientCount() {
        return GetRandomInt(1, this.shelter.clientCapacity * this.shelter.size);
    }

    /**
    * The minimal status that a client need to bought a dog.
    */
    GetMinimalStatus() {
        return GetRandomInt(Math.floor(this.minimalStatusModifier * this.shelter.size), this.shelter.size * this.statusMinimumModifier);
    }
    
    OnStart() {
        this.skippedFromSaving.push("shelter");

        BindEvent("EndOfMonth", this.OnEndOfMonth.bind(this));

        this.shelter = this.GetEntityByName("Shelter");

        this.UpdateMonthlyInfo();
    }

    UpdateMonthlyInfo() {
        this.monthlyClients = this.GetClientCount();
        this.monthlyStatus = this.GetMinimalStatus();

        let monthClients = document.getElementById("market-month-clients");
        if (monthClients != null) {
            monthClients.textContent = "Clients for this month: " + this.monthlyClients;
        }

        let monthStatus = document.getElementById("market-minimum-status");
        if (monthStatus != null) {
            monthStatus.textContent = "Status for this month: " + this.monthlyStatus;
        }
    }

    OnEndOfMonth() {
        let i = this.shelter.dogs.length;
        while(i--) {
            if (this.monthlyClients == 0) {
                break;
            }

            if (this.shelter.dogs[i].status >= this.monthlyStatus) {
                this.shelter.money += this.shelter.dogPrice;
                this.shelter.dogs.splice(i);
                this.shelter.OnSellDog(i);
                this.monthlyClients--;
            }
        }

        this.UpdateMonthlyInfo();
    }
}
