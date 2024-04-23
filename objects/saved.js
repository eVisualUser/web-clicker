class Saved {
    skippedFromSaving = ["skippedFromSaving"]

    Load(profile = "default") {
        let cookie = JSON.parse(Cookie.get(profile));
        for(const element in cookie) {
            eval("this." + element + " = " + eval("cookie." + element)); 
        }
    }
    
    Save(profile = "default") {
        let out = "{"
        let index = 0;
        for(const element in this) {
            if (this.skippedFromSaving.find((skipped) => element == skipped) == null) {
                out += "    \n\"" + element + "\":" + " " + "\"" + eval("this." + element) + "\",";
            }
        }
        out = out.substring(0, out.length - 1);
        out += "\n}";
        
        let expirationDate = new Date();
        expirationDate.setMonth(expirationDate.getMonth()+1);

        Cookie.set(profile, out, expirationDate);
    }
}
