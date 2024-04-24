class Game {
    // Load a template entity
    entities = [];

    constructor() {
        window.addEventListener("beforeunload", this.OnUnload.bind(this));
    }

    OnUnload() {
        for (let element of this.entities) {
           element.Save("cross");
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
                            eval("newEntity." + element + " = " + eval("entity." + element)); 
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
        let i = this.entities.length
        while(i--) {
            if (this.entities[i].mustBeDestroyed) {
                this.entities[i].OnDestroy();
                this.entities.splice(i);
                return this.CleanEntities();
            }
        }
    }

    Update() {
        this.entities.forEach(entity => {
            if (entity.active) {
                if (!entity.started) {
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
