class Saved {
    skippedFromSaving = ["skippedFromSaving"]

    NewExpirationDate() {
        let expirationDate = new Date();
        expirationDate.setMonth(expirationDate.getMonth()+1);
        return expirationDate;
    }

    IndexProfile(newProfile) {
        let profiles = this.GetAllProfiles();

        if (profiles.find((profile) => profile == newProfile) == null) {
            console.log("Added new profile: " + newProfile);
            profiles.push(newProfile);
        }
        Cookie.set("profiles", profiles.toString(), this.NewExpirationDate());
    }

    GetAllProfiles() {
        let profiles = Cookie.get("profiles").split(',');
        if (profiles[0] == '{')
            profiles = [];

        return profiles;
    }

    Load(profile = "default") {
        let cookie = JSON.parse(Cookie.get(profile));
        for(const element in cookie) {
            eval("this." + element + " = " + eval("cookie." + element)); 
        }
    }
    
    Save(profile = "default") {
        this.IndexProfile(profile);
        let out = "{"
        let index = 0;
        for(const element in this) {
            if (this.skippedFromSaving.find((skipped) => element == skipped) == null) {
                out += "    \n\"" + element + "\":" + " " + "\"" + eval("this." + element) + "\",";
            }
        }
        out = out.substring(0, out.length - 1);
        out += "\n}";
        
        Cookie.set(profile, out, this.NewExpirationDate());
    }
}
