let copia_localstorage
let copia_cookies


// funções do local storage

Cypress.Commands.add('salvarLocalStorage', () => {
    cy.window().then(window => {
        copia_localstorage = JSON.stringify(window.localStorage)
    })
})

Cypress.Commands.add('restaurarLocalStorage', () => {
    cy.window().then(window => {
        if(!copia_localstorage){
            cy.log("Nenhuma informação foi salva na variável COPIA_LOCALSTORAGE")
        } else {
            const chaves = Object.keys(JSON.parse(copia_localstorage))
            chaves.forEach(chave => {
                window.localStorage.setItem(chave, JSON.parse(copia_localstorage)[chave])
            })
        }
    })
})



// funções dos cookies

Cypress.Commands.add('salvarCookies', () => {
    cy.getCookies().then(cookies => {
      copia_cookies = JSON.stringify(cookies)
    })
})

Cypress.Commands.add('restaurarCookies', () => {
    
    if (!copia_cookies) return
  
    const cookies = JSON.parse(copia_cookies)
    cookies.forEach(cookie => {
      cy.setCookie(cookie.name, cookie.value, {
        domain: cookie.domain,
        path: cookie.path,
        secure: cookie.secure,
        httpOnly: cookie.httpOnly,
        expiry: cookie.expiry,
      })
    })
})



Cypress.Commands.add('login', (email, senha) => {

    cy.visit('/')

    cy.get('.style__ContainerFormLogin-sc-1wbjw6k-0 > :nth-child(1) > .input__default').type(email, {force: true})

    cy.get('.style__ContainerFormLogin-sc-1wbjw6k-0 > .login__password > .style__ContainerFieldInput-sc-s3e9ea-0 > .input__default').type(senha, {force: true})

    cy.get('.otUnI').click({force: true})


})

Cypress.Commands.add('cadastrarUsuario', (saldo, email, nome, senha, confirmaSenha) => {

    cy.visit('/')
    cy.get('.ihdmxA').click({force: true})

    cy.get(':nth-child(2) > .input__default').type(email, {force: true}) // email
    cy.get(':nth-child(3) > .input__default').type(nome, {force: true}) // nome
    cy.get(':nth-child(4) > .style__ContainerFieldInput-sc-s3e9ea-0 > .input__default').type(senha, {force: true}) // senha
    cy.get(':nth-child(5) > .style__ContainerFieldInput-sc-s3e9ea-0 > .input__default').type(confirmaSenha, {force: true}) // confirmação da senha

    if(saldo == 'semSaldo'){
        cy.log('*** Conta criada sem saldo! ***')
    }
    
    if(saldo == 'comSaldo'){
        cy.log('*** Conta criada com saldo! ***')
        cy.get('#toggleAddBalance').click({force: true})
    }

    cy.get('.styles__ContainerFormRegister-sc-7fhc7g-0 > .style__ContainerButton-sc-1wsixal-0').click({force: true})

})

Cypress.Commands.add('pegarConta', () => {

    cy.get('#modalText').invoke('text').then((text) => { // Extrai o texto do modal e faz a manipulação

        const regex = /A conta (\d{1,3})-(\d) foi criada com sucesso/g // Regex para buscar o padrão esperado
        const match = regex.exec(text) // Executa a regex no texto
        const numconta = { // Salva o número da conta e dígito em um objeto
          numconta: match[1],
          digito: match[2]
        }
        // Faz alguma ação com o objeto numconta, como salvá-lo em uma variável ou usá-lo em algum teste
        return numconta

      })
      
})



Cypress.Commands.add('fazTransferencia', (conta, valor, descricao) => {

    cy.visit('/')
    
    cy.get('#btn-TRANSFERÊNCIA').click({force: true})

    cy.get(':nth-child(1) > .input__default').type(conta.numconta, {force: true}) // numero conta
    cy.get('.account__data > :nth-child(2) > .input__default').type(conta.digito, {force: true}) // digito

    cy.get('.styles__ContainerFormTransfer-sc-1oow0wh-0 > :nth-child(2) > .input__default').type(valor, {force: true}) // valor

    cy.get(':nth-child(3) > .input__default').type(descricao, {force: true}) // descricao

    cy.get('.style__ContainerButton-sc-1wsixal-0').click({force: true}) // botao transferir

})