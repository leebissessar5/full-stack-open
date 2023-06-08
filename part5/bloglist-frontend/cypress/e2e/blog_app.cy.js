describe('Blog', () => {
  beforeEach(function() {
    cy.visit('')
    cy.request('POST', `${Cypress.env('BACKEND')}/testing/reset`)
    const user = {
      name: 'John Doe',
      username: 'johndoe',
      password: 'weakpassword'
    }
    cy.request('POST', `${Cypress.env('BACKEND')}/users`, user)
  })

  it('Login form is shown', function() {
    cy.contains('username')
    cy.contains('password')
  })

  // it('login form can be opened', function() {
  //   cy.get('#username').type('johndoe')
  //   cy.get('#password').type('weakpassword')
  //   cy.get('#login-button').click()

  //   cy.contains('John Doe logged in')
  // })
})