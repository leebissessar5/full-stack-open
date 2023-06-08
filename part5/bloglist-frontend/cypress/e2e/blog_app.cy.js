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

  describe('Login',function() {
    it('succeeds with correct credentials', function() {
      cy.get('#username').type('johndoe')
      cy.get('#password').type('weakpassword')
      cy.get('#login-button').click()

      cy.contains('John Doe logged in')
    })

    it('fails with wrong credentials', function() {
      cy.get('#username').type('johndoe')
      cy.get('#password').type('wrongpassword')
      cy.get('#login-button').click()

      cy.get('.error')
        .should('contain', 'wrong username or password')
        .and('have.css', 'color', 'rgb(255, 0, 0)')
        .and('have.css', 'border-style', 'solid')
      cy.get('html').should('not.contain', 'John Doe logged in')
    })

    describe('When logged in', function() {
      beforeEach(function() {
        cy.login({ username: 'johndoe', password: 'weakpassword' })
      })

      it('A blog can be created', function() {
        cy.contains('new blog').click()
        cy.get('#title-field').type('a blog created by cypress')
        cy.get('#author-field').type('cypress')
        cy.get('#url-field').type('https://example.com')
        cy.get('#create-button').click()
        cy.contains('a blog created by cypress')
      })

      describe('and a blog exists', function () {
        beforeEach(function () {
          cy.createBlog({ title: 'First blog', author: 'cypress', url: 'http://example.com' })
          cy.createBlog({ title: 'Second blog', author: 'cypress', url: 'http://example.com' })
          cy.createBlog({ title: 'Third blog', author: 'cypress', url: 'http://example.com' })
        })

        it('users can like blogs', function () {
          // expand blog info
          cy.contains('Second blog').parent().find('button').contains('view').click()
          cy.contains('Second blog').parent().contains('likes 0')

          // likes should be 1 after initial click
          cy.contains('Second blog').parent().find('button').contains('like').click()
          cy.contains('Second blog').parent().contains('likes 1')

          // test a second time
          cy.contains('Second blog').parent().find('button').contains('like').click()
          cy.contains('Second blog').parent().contains('likes 2')
        })

        it('blogs can be deleted', function () {
          // Find the ID of the third blog
          cy.request('GET', 'http://localhost:3003/api/blogs')
            .then((response) => {
              const blogs = response.body
              const thirdBlogId = blogs[2].id
              cy.deleteBlog(thirdBlogId)
            })
          cy.contains('Third Blog').should('not.exist')
        })
      })
    })
  })
})