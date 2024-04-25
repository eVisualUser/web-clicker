function GetRandomNumber(min, max) {
    return Math.random() * (max - min) + min;
}

function GetChildByAttribute(parent, name) {
    for(let i = 0; i < parent.children.length; i++) {
        if (parent.children[i].id == name) {
            return parent.children[i];
        }
    }

    return null;
}