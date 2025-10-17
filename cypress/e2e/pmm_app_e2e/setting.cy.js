describe('setting page', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000')
  })

  it('adds a new category successfully', () => {
    // login
    cy.get(':nth-child(1) > .relative > .w-full').type('abcd@gmail.com')
    cy.get(':nth-child(2) > .relative > .w-full').type('123456789')
    cy.get('.bg-emerald-600').click()
    // add new category
    cy.get('.ml-10 > :nth-child(4)').click()
    cy.get('.mb-6 > .flex').click()
    cy.get('.space-y-4 > :nth-child(1) > .w-full').type('Salary')
    cy.get(':nth-child(2) > .w-full').select('Income')
    cy.get('.space-x-3 > .bg-emerald-600').click()
  })

  it('adds a new payment methods successfully', () => {
    // login
    cy.get(':nth-child(1) > .relative > .w-full').type('abcd@gmail.com')
    cy.get(':nth-child(2) > .relative > .w-full').type('123456789')
    cy.get('.bg-emerald-600').click()
    // add new payment methods
    cy.get('.ml-10 > :nth-child(4)').click()
    cy.get('.p-4 > :nth-child(2)').click()
    cy.get('.mb-6 > .flex').click()
    cy.get('.space-y-4 > :nth-child(1) > .w-full').type('Cash')
    cy.get('.space-x-3 > .bg-emerald-600').click()
  })

  it('adds a new wallet methods successfully', () => {
    // login
    cy.get(':nth-child(1) > .relative > .w-full').type('abcd@gmail.com')
    cy.get(':nth-child(2) > .relative > .w-full').type('123456789')
    cy.get('.bg-emerald-600').click()
    // add new wallet methods
    cy.get('.ml-10 > :nth-child(4)').click()
    cy.get('.p-4 > :nth-child(3)').click()
    cy.get('.p-6 > .justify-between > .flex').click()
    cy.get('.space-y-4 > :nth-child(1) > .w-full').type('main')
    cy.get(':nth-child(2) > .w-full').select('Bank Account')
    
    cy.get('.space-x-3 > .bg-emerald-600').click()
  })

  it('logout successfully', () => {
    // login
    cy.get(':nth-child(1) > .relative > .w-full').type('abcd@gmail.com')
    cy.get(':nth-child(2) > .relative > .w-full').type('123456789')
    cy.get('.bg-emerald-600').click()
    // add new category
    cy.get('.ml-10 > :nth-child(4)').click()
    cy.get('.p-4 > :nth-child(4)').click()
    cy.get('.pt-6 > .flex').click()
    
  })

})