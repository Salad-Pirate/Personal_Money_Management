describe('register page', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000')
  })

  it('shows validation errors when signing in with empty fields', () => {
    cy.get('.text-gray-600 > .text-emerald-600').click()
    cy.get('.bg-emerald-600').click()
    cy.get(':nth-child(1) > .relative > .w-full').should('exist')
    cy.get(':nth-child(1) > .text-red-500').should('be.visible')
    cy.get(':nth-child(2) > .relative > .w-full').should('exist')
    cy.get(':nth-child(2) > .text-red-500').should('be.visible')
    cy.get(':nth-child(3) > .relative > .w-full').should('exist')
    cy.get(':nth-child(3) > .text-red-500').should('be.visible')
  })

  it('register successfully with valid credentials', () => {
    cy.get('.text-gray-600 > .text-emerald-600').click()
    cy.get(':nth-child(1) > .relative > .w-full').type('test008')
    cy.get(':nth-child(2) > .relative > .w-full').type('abcd@gmail.com')
    cy.get(':nth-child(3) > .relative > .w-full').type('123456789')
    cy.get('.bg-emerald-600').click()

  })
})