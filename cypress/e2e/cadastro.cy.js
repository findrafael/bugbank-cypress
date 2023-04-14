
import auxiliar from "../auxiliar/auxiliar"
let user1 = auxiliar.geraUsuario()
let user2 = auxiliar.geraUsuario()

// cadastro pode ser 'semSaldo' ou 'comSaldo'

context('VALIDAR: Ação de cadastros', () => {

  afterEach(() => {
    cy.salvarLocalStorage()
    cy.salvarCookies()
  })

  beforeEach(() => {
    cy.restaurarLocalStorage()
    cy.restaurarCookies()
  })

  describe('Cadastro de conta com saldo inicial', () => {


  it('Deve realizar o cadastro', () => {

    cy.cadastrarUsuario('comSaldo', user1.email, user1.nome, user1.senha, user1.senha)

    cy.get('#modalText').contains('foi criada com sucesso')

  })

  it('Deve realizar o login e validar se há saldo na conta', () => {
    cy.login(user1.email, user1.senha)
    cy.get('#textBalance > span').contains('R$ 1.000,00')
  })

  it('Deve fazer logout', () => {
    cy.visit('/')
    cy.get('.home__ContainerLink-sc-1auj767-2').click({force: true})
    cy.clearAllCookies()
  })


  });


  describe('Cadastro de conta sem saldo inicial', () => {

    it('Deve realizar o cadastro de uma conta SEM saldo inicial', () => {

      cy.cadastrarUsuario('semSaldo', user2.email, user2.nome, user2.senha, user2.senha)
    
      cy.get('#modalText').contains('foi criada com sucesso')

    })

    it('Deve realizar o login e validar se há saldo na conta', () => {
      cy.login(user2.email, user2.senha)
      cy.get('#textBalance > span').contains('R$ 0,00')
    })
    
    it('Deve fazer logout', () => {
      cy.visit('/')
      cy.get('.home__ContainerLink-sc-1auj767-2').click({force: true})
      cy.clearAllCookies()
    })

  })

})

context('VALIDAR: Campos vazios', () => {

    it('CAMPO VAZIO: email', () => {

      cy.cadastrarUsuario("semSaldo",'{shift}',user1.nome, user1.senha, user1.senha)

      cy.get('#modalText')
      .should('be.visible')
      .contains('Email não pode ser vazio')

    })

    it('CAMPO VAZIO: nome', () => {

      cy.cadastrarUsuario("semSaldo",user1.email,'{shift}', user1.senha, user1.senha)
      cy.get('#modalText')
      .should('be.visible')
      .contains('Nome não pode ser vazio')

    })

    it('CAMPO VAZIO: senha', () => {

      cy.cadastrarUsuario("semSaldo",user1.email, user1.nome, '{shift}', user1.senha)
      cy.get('#modalText')
      .should('be.visible')
      .contains('Senha não pode ser vazio')

    })

    it('CAMPO VAZIO: confirmação senha', () => {

      cy.cadastrarUsuario("semSaldo",user1.email, user1.nome, user1.senha, '{shift}')
      cy.get('#modalText')
      .should('be.visible')
      .contains('Confirmar senha não pode ser vazio')

    })

})

context('VALIDAR: Campos obrigatórios', () => {
  
    beforeEach(() => {
        cy.visit('/')
        cy.get('.ihdmxA').click({force: true})
        cy.get('.styles__ContainerFormRegister-sc-7fhc7g-0 > .style__ContainerButton-sc-1wsixal-0').click({force: true})
    })

    it('Campo: E-MAIL', () => {
        cy.get(':nth-child(2) > .input__warging').contains('É campo obrigatório')
    })

    it('Campo: NOME', () => {
        cy.get(':nth-child(3) > .input__warging').contains('É campo obrigatório')
    })

    it('Campo: SENHA', () => {
        cy.get(':nth-child(4) > .style__ContainerFieldInput-sc-s3e9ea-0 > .input__warging').contains('É campo obrigatório')
    })

    it('Campo: CONFIRMA SENHA', () => {
        cy.get(':nth-child(5) > .style__ContainerFieldInput-sc-s3e9ea-0 > .input__warging').contains('É campo obrigatório')
    })
  
})

context('VALIDAR: Tipagem dos campos', () => {

    beforeEach(() => {
        cy.visit('/')
        cy.get('.ihdmxA').click({force: true})
        cy.get(':nth-child(2) > .input__default').type('NÃOÉUMEMAIL', {force: true})
    })

    it('Campo e-mail deve ser do tipo: E-MAIL', () => {
        cy.get('.kOeYBn > .input__warging').contains('Formato inválido')
    })

})

  

  
