class Usuarios {
    constructor() {
        this.personas = [];
    }

    agregarPersona(id, nombre, sala) {
        let persona = {
            id,
            nombre,
            sala
        };
        this.personas.push(persona);
        return this.personas;
    }

    getPersona(id) {
        // Busca la persona en el arreglo  y devuelve la primera persona del arreglo devuelto
        let persona = this.personas.filter(per => {
            return per.id === id;
        })[0];
        return persona;
    }

    getPersonas() {
        return this.personas;
    }

    getPersonasPorSala(sala) {
        let personasEnsala = this.personas.filter(persona => {
            return persona.sala === sala;
        });
        return personasEnsala;
    }

    borraPersona(id) {
        let personaBorrada = this.getPersona(id);
        this.personas = this.personas.filter(per => {
            return per.id != id;
        })

        return personaBorrada;
    }
}

module.exports = {
    Usuarios
}