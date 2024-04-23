class Shelter extends Entity {
    name = "Shelter";

    size = 1;

    OnStart() {
    
        setInterval(this.OnEndOfMonth.bind(this), this.monthDuration);
    }

    GetCostPerMonth() {
        return this.baseCostPerMinute * this.size;
    }

    OnEndOfMonth() {
        this.money -= this.GetCostPerMonth();
    }
}
