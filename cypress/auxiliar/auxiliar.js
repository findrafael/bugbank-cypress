const faker = require('faker-br');

export default class auxiliar{

    static geraUsuario(){
        return {
            'nome': faker.name.firstName(),
            'email': faker.internet.email(),
            'senha': faker.internet.password()
        }
    }

}