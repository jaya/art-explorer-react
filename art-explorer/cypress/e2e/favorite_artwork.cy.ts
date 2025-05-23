describe('Favorite and unmark favorite artwork', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('should favorite an artwork and show on favorites page and remove from favorites', () => {
    cy.get('input[placeholder="Type your search"]').type('monet')

    cy.get('[data-testid="favorite-button"]').first().click()
    
    cy.get('a[href="/favorites"]').click()
    cy.get('[data-testid="artwork-card"]').first().should('exist')

    cy.get('[data-testid="favorite-button"]').first().click()
    cy.contains('p', 'No favorites found')
  })
})
