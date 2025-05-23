describe('Search and view artwork', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('should search and open an artwork modal', () => {
    cy.get('input[placeholder="Type your search"]').type('monet')

    cy.get('[data-testid="artwork-card"]').first().click()

    cy.get('[data-testid="modal-title"]').should('exist')

    cy.get('[data-testid="close-modal"]').click()
    cy.get('[data-testid="modal-title"]').should('not.exist')
    
    cy.get('[data-testid="favorite-button"]').first().click()
  })
})
