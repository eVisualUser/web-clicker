class Employees extends Entity {
    quantity = 0;

    shelter;

    OnStart() {
        this.skippedFromSaving.push("shelter");

        this.shelter = this.GetEntityByName("Shelter");

        setInterval(this.OnTime.bind(this), 1000);

        let buyEmployees = document.getElementById("employee-buy");
        buyEmployees.onclick = this.BuyWorker.bind(this);

        this.UpdateUI();
        BindEvent("OnUI", this.UpdateUI.bind(this));
    }

    UpdateUI() {
        let employeesCount = document.getElementById("employees-count");
        employeesCount.textContent = "Employees: " + this.quantity;

        let buyEmployees = document.getElementById("employee-buy");
        buyEmployees.textContent = "Buy Slave (" + this.shelter.money + "/" + this.workerCost + "💸)";
    }

    OnTime() {
        for(let i = 0; i < this.quantity; i++) {
            this.shelter.Work();
        }
    }

    BuyWorker() {
        if (this.shelter.money >= this.workerCost) {
            this.shelter.money -= this.workerCost;
            this.quantity++;
            this.workerCost = Math.floor(this.workerCost * 1.5);
        }
        EmitEvent("OnUI");
    }
}
