class Game {
    // Load a template entity
    entities = [];

    reset = false;

    constructor() {
        window.addEventListener("unload", this.OnUnload.bind(this));

        BindEvent("Reset", this.OnReset.bind(this));
        BindEvent("Lose", this.OnLose.bind(this));

        document.getElementById("export-button").onclick = this.Export.bind(this);
        document.getElementById("import-button").addEventListener("change", this.Import.bind(this));
        document.getElementById("reset-button").onclick = (_event) => { EmitEvent("Reset") };
        document.getElementById("import-button-relay").onclick = (_) => {
            document.getElementById("import-button").click();
        };
    }

    Clear() {
        let profiles = Storage.get("profiles");
        if (profiles != null) {
            profiles.split(',').forEach((profile) => {
                Storage.remove(profile);
            });
            Storage.remove("profiles");
        }
    }

    OnLose() {
        this.Clear();

        this.reset = true;
        window.location.replace("./lose.html");
    }

    OnReset() {
        this.Clear();

        this.reset = true;
        window.location.reload(true);
    }

    OnUnload() {
        if (!this.reset) {
            this.entities.forEach((entity) => {
                console.log("Save all");
                entity.Save("cross");
            });
        }
    }

    Export() {
        let profiles = Storage.get("profiles");
        let out = [] 
        if (profiles != null) {
            profiles.split(',').forEach((profile) => {
                out.push([profile, Storage.get(profile)]);
            });
        }
        out = JSON.stringify(out);

        const file = new File([out], "game-save.wcsf", {
            type: "file/text",
        });

        let url = URL.createObjectURL(file);

        open(url);
        
        return out;
    }

    async Import(event) {
        let file = event.target.files[0];
        if (file != null) {
            const reader = new FileReader();
            reader.addEventListener("load", (event) => {
                let data = JSON.parse(event.target.result);

                data.forEach((array) => {
                    let profile = array[0];
                    let content = array[1];

                    if (profile != null && content != null) {
                        Storage.set(profile, content);
                    }
                });

                console.log("Reload");
                window.removeEventListener("unload", this.OnUnload.bind(this));
                this.reset = true;
                window.location.reload(true);
            });
            reader.readAsText(file, "UTF-8");
        }
    }

    async LoadLevel(path) {
        await fetch(path)
            .then(res => res.json())
            .then(async data => {
                data.content.forEach(entity => {
                    let newEntity = eval('new ' + entity.object + '()');

                    for(let element in entity) {
                        if (element != "object") {
                            eval("newEntity." + element + " = " + "entity." + element); 
                        }
                    }

                    newEntity.others = this.entities;
                    newEntity.Load("cross");
                    newEntity.OnLoad();
                    
                    this.entities.push(newEntity);
                });

                for (const level of data.levels) {
                    await this.LoadLevel(level);
                }
            });
    }

    CleanEntities() {
        let i = this.entities.length;
        while(i--) {
            if (this.entities[i].mustBeDestroyed) {
                this.entities[i].OnDestroy();
                this.entities[i] = null;
                delete this.entities[i];
                this.entities.length -= 1;
                console.log("Removed entity");
                return this.CleanEntities();
            }
        }
    }

    Update() {
        this.entities.forEach(entity => {
            if (entity.active) {
                if (!entity.started) {
                    entity.others = this.entities;
                    entity.OnStart();
                    entity.started = true;
                }

                entity.OnUpdate();
            }
        });
        
        this.CleanEntities();

        window.requestAnimationFrame(this.Update.bind(this));
    }
}

async function Start() {
    let game = new Game();
    await game.LoadLevel("levels/level.json");

    window.requestAnimationFrame(game.Update.bind(game));
}

window.addEventListener("DOMContentLoaded", Start);
