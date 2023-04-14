import auxiliar from "../auxiliar/auxiliar"
let user1 = auxiliar.geraUsuario()


context('VALIDAR: Ação de login', () => {

    before(() => {
        cy.cadastrarUsuario('comSaldo', user1.email, user1.nome, user1.senha, user1.senha)
        cy.salvarLocalStorage()
    });


    it('Deve fazer login com informações válidas', () => {
        
        cy.login(user1.email, user1.senha)
        
        cy.url().should('eq', 'https://bugbank.netlify.app/home')

        cy.get('#textName').contains('Olá '+ user1.nome+',')
        cy.get('.home__ContainerText-sc-1auj767-7 > :nth-child(2)').contains('bem vindo ao BugBank :)')
        
        cy.clearAllCookies()
    })


    it('Não deve fazer login com informações inválidas', () => {
        cy.login('emailnaocadastrado@gmail.com ', 'senhainvalida')
        cy.get('.styles__ContainerContent-sc-8zteav-1').should('be.visible')
        cy.get('#modalText').contains('Usuário ou senha inválido. Tente novamente ou verifique suas informações!')

    })


})

context('VALIDAR: Campos obrigatórios', () => {

    beforeEach(() => {
        cy.visit('/')
        cy.get('.otUnI').click({force: true})
    })

    it('Campo: E-MAIL', () => {
        cy.get('.style__ContainerFormLogin-sc-1wbjw6k-0 > :nth-child(1) > .input__warging').contains('É campo obrigatório')
    })

    it('Campo: SENHA', () => {
        cy.get('.style__ContainerFormLogin-sc-1wbjw6k-0 > .login__password > .style__ContainerFieldInput-sc-s3e9ea-0 > .input__warging').contains('É campo obrigatório')
    })

})
