describe('setting page', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000')
  })

  it('adds a new category successfully', () => {
    // login
    cy.get(':nth-child(1) > .relative > .w-full').type('abc@gmail.com')
    cy.get(':nth-child(2) > .relative > .w-full').type('123456789')
    cy.get('.bg-emerald-600').click()
    // add new category
    cy.get('.ml-10 > :nth-child(4)').click()
    cy.get('.mb-6 > .flex').click()
    cy.get('.space-y-4 > :nth-child(1) > .w-full').type('Family support')
    cy.get(':nth-child(2) > .w-full').select('Income')
    cy.get('.space-x-3 > .bg-emerald-600').click()
  })

  it('adds a new payment methods successfully', () => {
    // login
    cy.get(':nth-child(1) > .relative > .w-full').type('abc@gmail.com')
    cy.get(':nth-child(2) > .relative > .w-full').type('123456789')
    cy.get('.bg-emerald-600').click()
    // add new payment methods
    cy.get('.ml-10 > :nth-child(4)').click()
    cy.get('.p-4 > :nth-child(2)').click()
    cy.get('.mb-6 > .flex').click()
    cy.get('.space-y-4 > :nth-child(1) > .w-full').type('QR code')
    cy.get('.space-x-3 > .bg-emerald-600').click()
  })

//   it('edit a cash wallet successfully', () => {
//     // login
//     cy.get(':nth-child(1) > .relative > .w-full').type('abc@gmail.com')
//     cy.get(':nth-child(2) > .relative > .w-full').type('123456789')
//     cy.get('.bg-emerald-600').click()
//     // add new payment methods
//     cy.get('.ml-10 > :nth-child(4)').click()
//     cy.get('.p-4 > :nth-child(3)').click()
//     cy.get(':nth-child(1) > .justify-between > .space-x-2 > .hover\:text-emerald-600').click()
//     cy.get('.space-y-4 > :nth-child(3) > .w-full').type('200')
//     cy.get('.space-x-3 > .bg-emerald-600').click()
//   })

  it('logout successfully', () => {
    // login
    cy.get(':nth-child(1) > .relative > .w-full').type('abc@gmail.com')
    cy.get(':nth-child(2) > .relative > .w-full').type('123456789')
    cy.get('.bg-emerald-600').click()
    // add new category
    cy.get('.ml-10 > :nth-child(4)').click()
    cy.get('.p-4 > :nth-child(4)').click()
    cy.get('.pt-6 > .flex').click()
    
  })

})