import auxiliar from "../auxiliar/auxiliar"
let user1 = auxiliar.geraUsuario()
let user2 = auxiliar.geraUsuario()

context('VALIDAR: Ação de transferência', () => {

    before(() => {
        // cria usuário 1 *COM SALDO*

        cy.cadastrarUsuario('comSaldo', user1.email, user1.nome, user1.senha, user1.senha)
        cy.pegarConta().then(conta => {
            user1.conta = conta
        })

        // cria usuário 2 *SEM SALDO*

        cy.cadastrarUsuario('semSaldo', user2.email, user2.nome, user2.senha, user2.senha)
        cy.pegarConta().then(conta => {
            user2.conta = conta
        })

        cy.salvarLocalStorage()
    })

    describe('Deve fazer uma transferência de 200 reais com sucesso', () => {
    
        afterEach(() =>{
            cy.salvarLocalStorage()
            cy.salvarCookies()
        })
        
        beforeEach(() =>{
            cy.restaurarLocalStorage()
            cy.restaurarCookies()
        })

        it('Deve fazer login no usuário 1', () => {
            cy.login(user1.email, user1.senha)
        })

        it('Preenche o formulário com as informações de conta do Usuário 2', () => {

            cy.fazTransferencia(user2.conta, '200', 'Presente de Natal')
            cy.get('.styles__ContainerContent-sc-8zteav-1').should('be.visible')
            cy.get('#modalText').contains('Transferencia realizada com sucesso')
            cy.get('#btnCloseModal').click()

        })

        it('Deve validar o saldo atual da conta', () => {
            cy.visit('/')
            cy.get('#textBalance').contains('Saldo em conta R$ 800,00')
        })

    })

    describe('Não deve fazer uma transferência para uma conta inexistente/inválida', () => {
        
        afterEach(() =>{
            cy.salvarLocalStorage()
            cy.salvarCookies()
        })
        
        beforeEach(() =>{
            cy.restaurarLocalStorage()
            cy.restaurarCookies()
        })


        it('Preenche o formulário com as informações de uma conta inexistente/inválida', () => {

            const containvalida = {'numconta': '000', 'digito': '0'}

            cy.fazTransferencia(containvalida, '200', 'Presente de Natal')
            cy.get('.styles__ContainerContent-sc-8zteav-1').should('be.visible')
            cy.get('#modalText').contains('Conta inválida ou inexistente')

        })

        it('Deve validar se o saldo atual da conta não mudou', () => {
            cy.visit('/')
            cy.get('#textBalance').contains('Saldo em conta R$ 800,00')
        })

    })

    describe('Não deve fazer uma transferência de valor maior que o saldo', () => {
        
        afterEach(() =>{
            cy.salvarLocalStorage()
            cy.salvarCookies()
        })
        
        beforeEach(() =>{
            cy.restaurarLocalStorage()
            cy.restaurarCookies()
        })


        it('Preenche o formulário com as informações de conta do Usuário 2', () => {

            cy.fazTransferencia(user2.conta, '9999999', 'Presente de Natal')
            cy.get('.styles__ContainerContent-sc-8zteav-1').should('be.visible')
            cy.get('#modalText').contains('Você não tem saldo suficiente para essa transação')

        })

        it('Deve validar se o saldo atual da conta não mudou', () => {
            cy.visit('/')
            cy.get('#textBalance').contains('Saldo em conta R$ 800,00')
        })

    })

    describe('Não deve fazer uma transferência de valor menor ou igual a zero', () => {
        
        afterEach(() =>{
            cy.salvarLocalStorage()
            cy.salvarCookies()
        })
        
        beforeEach(() =>{
            cy.restaurarLocalStorage()
            cy.restaurarCookies()
        })

        it('Preenche o formulário com as informações de conta do Usuário 2', () => {

            cy.fazTransferencia(user2.conta, '0', 'Presente de Natal')
            cy.get('.styles__ContainerContent-sc-8zteav-1').should('be.visible')
            cy.get('#modalText').contains('Valor da transferência não pode ser 0 ou negativo')

        })

        it('Deve validar se o saldo atual da conta não mudou', () => {
            cy.visit('/')
            cy.get('#textBalance').contains('Saldo em conta R$ 800,00')
        })

    })

})

context('VALIDAR: Tipagem dos campos', () => {

    before(() => {
        // cria usuário 1 *COM SALDO*

        cy.cadastrarUsuario('comSaldo', user1.email, user1.nome, user1.senha, user1.senha)
        cy.pegarConta().then(conta => {
            user1.conta = conta
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
        cy.visit('/')
        cy.get('#btn-TRANSFERÊNCIA').click({force: true})
    })



    it('CAMPO: Número da Conta - STRING', () => {



        cy.get(':nth-child(1) > .input__default')
        .type('NÃOÉNUMERO')
        .should('have.value', /^[\d]+$/)

    })

    it('CAMPO: Dígito da Conta - STRING', () => {


        cy.get('.account__data > :nth-child(2) > .input__default')
        .type('NÃOÉNUMERO')
        .should('have.value', /^[\d]+$/)

    })

})

