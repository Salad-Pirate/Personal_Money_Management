describe('Visit main page', () => {
  it('logs in successfully with valid credentials', () => {
    cy.visit('https://muict.app/salad-pirate-frontend');
    cy.get(':nth-child(1) > .relative > .w-full').type('icekung8448@gmail.com')
    cy.get(':nth-child(2) > .relative > .w-full').type('123456789')
    cy.get('.bg-emerald-600').click()
  });
//    it('shows validation errors when signing in with empty fields', () => {
//     cy.get('.text-gray-600 > .text-emerald-600').click()
//     cy.get('.bg-emerald-600').click()
//     cy.get(':nth-child(1) > .relative > .w-full').should('exist')
//     cy.get(':nth-child(1) > .text-red-500').should('be.visible')
//     cy.get(':nth-child(2) > .relative > .w-full').should('exist')
//     cy.get(':nth-child(2) > .text-red-500').should('be.visible')
//     cy.get(':nth-child(3) > .relative > .w-full').should('exist')
//     cy.get(':nth-child(3) > .text-red-500').should('be.visible')
//   })

//   it('register successfully with valid credentials', () => {
    

//   })
});
