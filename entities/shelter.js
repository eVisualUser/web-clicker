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
    }

    Work() {
        let random = parseInt(GetRandomNumber(-1, this.dogs.length));
        if (random < 0) random = 0;

        let randomDog = this.dogs[random];
        if (randomDog != null) {
            randomDog.status += 1;
        }
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
        this.UpdateUIInfo();
        this.UpdateUIDog();
        if (this.active) {
            setTimeout(this.OnTime.bind(this), 1000);
        }

        if (this.money <= 0) {
            EmitEvent("Reset");
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
    }

    async UpdateUIDog() {
        let dogsView = document.getElementById("dog-view");

        if (this.dogAPI != null) {
            let i = dogsView.children.length;
            for(let dog of this.dogs) {
                let dogView = GetChildByAttribute(dogsView, dog.id);;
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
            }
        }
    }

    UpdateUIInfo() {
        let shelterMoney = document.getElementById("shelter-money");
        if (shelterMoney != null) {
            shelterMoney.textContent = "Money: " + this.money;
        }

        let shelterCost = document.getElementById("shelter-cost");
        if (shelterCost != null) {
            let timeBuf = this.time;
            if (timeBuf == 0)
                timeBuf += 1;

            shelterCost.textContent = "Cost per month (" + ((this.monthDuration / 1000) - (timeBuf / 1000)) + "s): " + this.GetCostPerMonth();
        }

        let shelterSize = document.getElementById("shelter-size");
        if (shelterSize != null) {
            shelterSize.textContent = "Size: " + this.size;
        }

        let shelterUpgrade = document.getElementById("shelter-upgrade");
        if (shelterUpgrade != null) {
            shelterUpgrade.textContent = "Upgrade Shelter (" + this.money + "/" + this.GetUpgradeCost() + "$)";
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
            this.UpdateUIInfo();
        }
    }
}
