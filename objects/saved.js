class Saved {
    name = "Entity";
    skippedFromSaving = ["skippedFromSaving", "name"]

    IndexProfile(newProfile) {
        let profiles = this.GetAllProfiles();

        if (profiles.find((profile) => profile == newProfile && profile != "") == null) {
            profiles.push(newProfile);
        }
        profiles = profiles.toString();
        Storage.set("profiles", profiles);
    }

    GetAllProfiles() {
        let storage = Storage.get("profiles");
        if (storage != null) {
            let profiles = storage.split(',');
            return profiles;
        }
        return [];
    }

    Load(profile = "default") {
        let profileName = profile + "." + this.name;
        
        let storage = Storage.get(profileName);
        if (storage != null) {
            storage = JSON.parse(storage);
            for(const element in storage) {
                eval("this." + element + " = " + eval("storage." + element)); 
            }
        }
    }
    
    Save(profile = "default") {
        let out = "{"
        let index = 0;
        for(const element in this) {
            if (this.skippedFromSaving.find((skipped) => element == skipped) == null) {
                out += "    \n\"" + element + "\":" + " " + JSON.stringify(eval("this." + element)) + ",";
            }
        }
        out = out.substring(0, out.length - 1);
        out += "\n}";
        
        let profileName = profile + "." + this.name;
        this.IndexProfile(profileName);
        Storage.set(profileName, out);
    }
}
