class Entity extends Saved {
    active = true;
    mustBeDestroyed = false;
    others = [];
    started = false;

    OnLoad() {
        this.skippedFromSaving.push("started");
        this.skippedFromSaving.push("others");
    }
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
