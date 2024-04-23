class Shelter extends Entity {
    name = "Shelter";

    money = 1000;

    OnStart() {
        console.log("Money: " + this.money);
    }
}
