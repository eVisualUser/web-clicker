class Entity {
    active = true;
    mustBeDestroyed = false;
    name = "Entity";
    others = [];
    started = false;

    OnLoad() {}
    OnStart() {}
    async OnUpdate() {}
    OnDestroy() {}

    Destroy() {
        this.mustBeDestroyed = true;
    }

    Deactivate() {
        this.active = false;
    }

    Activate() {
        this.active = true;
    }

    GetEntityByName(name) {
        let result = null;
        this.others.forEach(other => {
            if (other.active && other.name == name) {
                result = other;
            }
        });
        if (result == null) {
            console.error("Failed to get entity named: " + name);
        }
        return result;
    }
}
