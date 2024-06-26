class Shelter extends Entity {
    name = "Shelter";

    size = 1;

    time = 0;

    dogs = [new Dog()];

    dogPricePerStatus = 10;

    dogAPI;

    async OnStart() {
        this.skippedFromSaving.push("dogAPI");
        this.skippedFromSaving.push("monthDuration");
        
        this.dogAPI = this.GetEntityByName("DogAPI");

        if (this.dogs[0].picture.length == 0) {
            this.dogs[0].picture = await this.dogAPI.GetDogImage();
        }
        
        this.UpdateUIInfo();
        this.UpdateUIDog();

        setTimeout(this.OnTime.bind(this), 1000);

        BindEvent("OnUI", this.OnUI.bind(this));
        Storage.set("BestScore", this.money);
    }

    OnUI() {
        this.UpdateUIInfo();
    }

    Work() {
        let random = GetRandomInt(0, this.dogs.length);

        let randomDog = this.dogs[random];
        if (randomDog != null) {
            randomDog.status += 1;
        }
        this.UpdateUIDog();
    }

    GetCostPerMonth() {
        return this.baseCostPerMinute * this.size;
    }

    async OnTime() {
        this.time += 1000;
        if (this.time >= this.monthDuration) {
            await this.OnEndOfMonth();
            this.time = 0;
        }
        EmitEvent("OnUI");
        if (this.active) {
            setTimeout(this.OnTime.bind(this), 1000);
        }

        let bestScore = parseInt(Storage.get("BestScore"));
        if (this.money > bestScore) {
            Storage.set("BestScore", this.money);
        }

        if (this.money <= 0) {
            EmitEvent("Lose");
        }
    }

    async OnEndOfMonth() {
        EmitEvent("EndOfMonth");
        this.money -= this.GetCostPerMonth();
        while(this.dogs.length < this.size) {
            let dog = new Dog();
            dog.picture = await this.dogAPI.GetDogImage();
            this.dogs.push(dog);
        }
        this.UpdateUIDog();
    }

    async UpdateUIDog() {
        let dogsView = document.getElementById("dog-view");

        if (this.dogAPI != null) {
            let i = 0;
            for(let dog of this.dogs) {
                dog.id = i;
                let dogView = GetChildByAttribute(dogsView, i);
                if (dogView == null) {
                    dogView = document.createElement("div");
                    dogView.id = dog.id;

                    dogsView.appendChild(dogView);

                    let dogName = document.createElement("p");
                    dogName.id = "DogName";

                    dogView.appendChild(dogName);

                    let dogPicture = document.createElement("img");
                    dogPicture.id = "DogPicture";
                    if (dog.picture.length == 0) {
                        dog.picture = await this.dogAPI.GetDogImage();
                    }
                    dogPicture.src = dog.picture;

                    dogView.appendChild(dogPicture);

                    let dogStatus = document.createElement("p");
                    dogStatus.id = "DogStatus";

                    dogView.appendChild(dogStatus);
                }

                let dogStatus = GetChildByAttribute(dogView, "DogStatus");
                dogStatus.textContent = "Status: " + dog.status;

                let dogPicture = GetChildByAttribute(dogView, "DogPicture");
                dogPicture.src = dog.picture;
                i++;
            }
        }
    }

    UpdateUIInfo() {
        let shelterMoney = document.getElementById("shelter-money");
        if (shelterMoney != null) {
            shelterMoney.textContent = "Money: " + this.money + "💸";
        }

        let shelterCost = document.getElementById("shelter-cost");
        if (shelterCost != null) {
            let timeBuf = this.time;
            if (timeBuf == 0)
                timeBuf += 1;

            shelterCost.textContent = "Cost per month (" + Math.ceil((this.monthDuration / 1000) - (timeBuf / 1000)) + "s): " + this.GetCostPerMonth();
        }

        let shelterSize = document.getElementById("shelter-size");
        if (shelterSize != null) {
            shelterSize.textContent = "Size: " + this.size;
        }

        let shelterUpgrade = document.getElementById("shelter-upgrade");
        if (shelterUpgrade != null) {
            shelterUpgrade.textContent = "Upgrade Shelter (" + this.money + "/" + this.GetUpgradeCost() + "💸)";
            shelterUpgrade.onclick = this.OnUpgrade.bind(this);
        }
    }

    GetUpgradeCost() {
        return this.upgradeCostPerSize * this.size;
    }

    OnSellDog(id = 0) {
        DOG_IDS--;
    }

    OnUpgrade() {
        let upgradeCost = this.GetUpgradeCost();
        if (this.money >= upgradeCost) {
            this.size += 1;
            this.money -= upgradeCost;
            EmitEvent("OnUI");
        }
    }
}
