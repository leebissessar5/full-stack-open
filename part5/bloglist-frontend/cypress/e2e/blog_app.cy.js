describe('Blog', () => {
  beforeEach(function() {
    cy.visit('')
    cy.request('POST', `${Cypress.env('BACKEND')}/testing/reset`)
    const user = {
      name: 'John Doe',
      username: 'johndoe',
      password: 'weakpassword'
    }
    const anotherUser = {
      name: 'Fake Doe',
      username: 'fakedoe',
      password: 'weakwordpass'
    }
    cy.request('POST', `${Cypress.env('BACKEND')}/users`, user)
    cy.request('POST', `${Cypress.env('BACKEND')}/users`, anotherUser)
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
          cy.createBlog({ title: 'Blog 1', author: 'Author 1', url: 'http://example.com', likes: 3 })
          cy.createBlog({ title: 'Blog 2', author: 'Author 2', url: 'http://example.com', likes: 1 })
          cy.createBlog({ title: 'Blog 3', author: 'Author 3', url: 'http://example.com', likes: 5 })
          cy.createBlog({ title: 'Blog 4', author: 'Author 4', url: 'http://example.com', likes: 2 })
        })

        it('users can like blogs', function () {
          // Find the blog element and alias it
          cy.contains('Blog 2').parent().as('blog2')

          // Expand blog info and assert initial likes
          cy.get('@blog2').find('button').contains('view').click()
          cy.get('@blog2').contains('likes 1')

          // Click the like button and assert updated likes
          cy.get('@blog2').find('button').contains('like').click()
          cy.get('@blog2').contains('likes 2')

          // Click the like button again and assert updated likes
          cy.get('@blog2').find('button').contains('like').click()
          cy.get('@blog2').contains('likes 3')
        })

        it('creator of blog can see remove button', function() {
          cy.contains('Blog 3').parent().find('button').contains('view').click()
          cy.contains('Blog 3').parent().contains('remove')
        })

        it('blogs can be deleted by the creator', function () {
          // Find the ID of the third blog
          cy.request('GET', 'http://localhost:3003/api/blogs')
            .then((response) => {
              const blogs = response.body
              const thirdBlogId = blogs[2].id
              cy.deleteBlog(thirdBlogId)
            })
          cy.contains('Blog 3').should('not.exist')
        })

        describe('another user logs in', function() {
          beforeEach(function() {
            cy.login({ username: 'fakedoe', password: 'weakwordpass' })
          })

          it('remove button can only be seen by creator', function () {
            cy.contains('Blog 3').parent().find('button').contains('view').click()
            cy.contains('Blog 3').parent().contains('remove').should('not.exist')
          })

          it('blogs are ordered by likes', function () {
            // Get the initial order of blogs
            cy.request('GET', 'http://localhost:3003/api/blogs')
              .then((response) => {
                // check if initially sorted
                const initialOrder = Array.from(response.body.map((blog) => blog.likes))
                expect(initialOrder).to.have.ordered.members(initialOrder.sort((a, b) => b - a))

                // Interact with blogs and increase likes
                cy.contains('Blog 1').parent().find('button').contains('view').click()
                cy.contains('Blog 1').parent().contains('likes 3').as('blog1Likes')
                cy.get('@blog1Likes').find('button').contains('like').click().click()

                cy.contains('Blog 2').parent().find('button').contains('view').click()
                cy.contains('Blog 2').parent().contains('likes 1').as('blog2Likes')
                cy.get('@blog2Likes').find('button').contains('like').click().click().click()

                cy.contains('Blog 3').parent().find('button').contains('view').click()
                cy.contains('Blog 3').parent().contains('likes 5').as('blog3Likes')
                cy.get('@blog3Likes').find('button').contains('like').click()

                cy.contains('Blog 4').parent().find('button').contains('view').click()
                cy.contains('Blog 4').parent().contains('likes 2').as('blog4Likes')

                cy.request('GET', 'http://localhost:3003/api/blogs')
                  .then((response) => {
                    // check if sorted after interaction
                    const newOrder = Array.from(response.body.map((blog) => blog.likes))
                    expect(newOrder).to.have.ordered.members(newOrder.sort((a, b) => b - a))
                  })
              })
          })
        })
      })
    })
  })
})