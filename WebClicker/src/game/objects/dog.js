let DOG_IDS = 0;

class Dog {
    id = 0;
    status = 0;
    picture = ""
    
    constructor() {
        DOG_IDS += 1;
        this.id = DOG_IDS;
    }

    GetPrice(basePrice) {
        return this.status * basePrice;
    }
}
