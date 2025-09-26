describe('login page', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000')
  })

  it('shows validation errors when signing in with empty fields', () => {
    cy.get('.bg-emerald-600').click()
    cy.get(':nth-child(1) > .relative > .w-full').should('exist')
    cy.get(':nth-child(1) > .text-red-500').should('be.visible')
    cy.get(':nth-child(2) > .relative > .w-full').should('exist')
    cy.get(':nth-child(2) > .text-red-500').should('be.visible')
  })

  it('logs in successfully with valid credentials', () => {
    
    cy.get(':nth-child(1) > .relative > .w-full').type('abc@gmail.com')
    
    cy.get(':nth-child(2) > .relative > .w-full').type('123456789')
    
    cy.get('.bg-emerald-600').click()
  })
})