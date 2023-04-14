
import auxiliar from "../auxiliar/auxiliar"
let user1 = auxiliar.geraUsuario()
let user2 = auxiliar.geraUsuario()

context('VALIDAR: Cenários - Extrato', () => {

before(() => {
    // cria usuário 1 *COM SALDO*

    cy.cadastrarUsuario('comSaldo', user1.email, user1.nome, user1.senha, user1.senha)
    cy.pegarConta().then(conta => {
        user1.conta = conta
    })

    cy.cadastrarUsuario('semSaldo', user2.email, user2.nome, user2.senha, user2.senha)
    cy.pegarConta().then(conta => {
        user2.conta = conta
    })

    cy.login(user1.email, user1.senha)

    cy.salvarLocalStorage()


})

afterEach(() =>{
    cy.salvarLocalStorage()
    cy.salvarCookies()
})

beforeEach(() =>{
    cy.restaurarLocalStorage()
    cy.restaurarCookies()
    
})

describe('Deve validar o saldo atual da conta', () => {

    it('Abre o extrato e valida o saldo atual', () => {

        cy.visit('https://bugbank.netlify.app/bank-statement')

        cy.get('#textBalanceAvailable')
        .should('be.visible')
        .contains('R$ 1.000,00')

    })

})

describe('Deve validar o valor de entrada na conta', () => {
    
    it('Abre o extrato e valida o valor de entrada', () => {

        cy.visit('https://bugbank.netlify.app/bank-statement')
    
        cy.get('#textTransferValue')
        .should('have.css', 'color')
        .and('equal', 'rgb(0, 128, 0)')
    
        cy.get('#textDescription').contains('Saldo adicionado ao abrir conta')
    
        cy.get('#textDateTransaction')
        .invoke('text').should('match', /^\d{2}\/\d{2}\/\d{4}$/)

    })

})

describe('Deve validar o valor de saída na conta', () => {

    it('Faz uma transferência com a descrição em branco', () => {
        cy.fazTransferencia(user2.conta, '200', '{shift}')
    })

    it('Abre o extrato e valida o valor de saída', () => {

        cy.visit('https://bugbank.netlify.app/bank-statement')
    
        cy.get(':nth-child(2) > .bank-statement__ContainerDescAndValue-sc-7n8vh8-15 > #textTransferValue')
        .should('have.css', 'color')
        .and('equal', 'rgb(255, 0, 0)')
    
        cy.get(':nth-child(2) > .bank-statement__ContainerDateAndType-sc-7n8vh8-14 > #textTypeTransaction')
        .contains('Transferência enviada')
    
        cy.get(':nth-child(2) > .bank-statement__ContainerDateAndType-sc-7n8vh8-14 > #textDateTransaction')
        .invoke('text').should('match', /^\d{2}\/\d{2}\/\d{4}$/)

        cy.get(':nth-child(2) > .bank-statement__ContainerDescAndValue-sc-7n8vh8-15 > #textDescription')
        .contains('-')

        cy.get(':nth-child(2) > .bank-statement__ContainerDescAndValue-sc-7n8vh8-15 > #textTransferValue')
        .contains('-')
    })
})

})