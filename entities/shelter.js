class Shelter extends Entity {
    name = "Shelter";

    size = 1;

    time = 0;

    OnStart() {
        this.UpdateUI();
        setInterval(this.OnTime.bind(this), 1000);
    }

    Work(efficiency) {

    }

    GetCostPerMonth() {
        return this.baseCostPerMinute * this.size;
    }

    OnTime() {
        this.time += 1000;
        if (this.time >= this.monthDuration) {
            this.OnEndOfMonth();
            this.time = 0;
        }
        this.UpdateUI();
    }

    OnEndOfMonth() {
        this.money -= this.GetCostPerMonth();
    }

    UpdateUI() {
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
            shelterUpgrade.textContent = "Upgrade Shelter (" + this.GetUpgradeCost() + "/" + this.money + "$)";
            shelterUpgrade.onclick = this.OnUpgrade.bind(this);
        }
    }

    GetUpgradeCost() {
        return this.upgradeCostPerSize * this.size;
    }

    OnUpgrade() {
        console.log("I upgrade !!!");
        let upgradeCost = this.GetUpgradeCost();
        if (this.money >= upgradeCost) {
            this.size += 1;
            this.money -= upgradeCost;
            this.UpdateUI();
        }
    }
}
