describe('Favorite and unmark favorite artwork', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('should click on dark mode button', () => {
    cy.get('button[aria-label="Toggle dark mode"]').click()
    cy.get('html').should('have.class', 'dark')
    cy.get('button[aria-label="Toggle dark mode"]').click()
    cy.get('html').should('not.have.class', 'dark')
  })
})
