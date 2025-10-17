describe('setting page', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000')
  })

  it('adds a new category (Income) successfully', () => {
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

  it('adds a new category (Expense) successfully', () => {
    // login
    cy.get(':nth-child(1) > .relative > .w-full').type('abcd@gmail.com')
    cy.get(':nth-child(2) > .relative > .w-full').type('123456789')
    cy.get('.bg-emerald-600').click()
    // add new category
    cy.get('.ml-10 > :nth-child(4)').click()
    cy.get('.mb-6 > .flex').click()
    cy.get('.space-y-4 > :nth-child(1) > .w-full').type('books')
    cy.get(':nth-child(2) > .w-full').select('Expense')
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

  // it('adds a new income record successfully', () => { 
  //   // login
  //   cy.get(':nth-child(1) > .relative > .w-full').type('abcd@gmail.com')
  //   cy.get(':nth-child(2) > .relative > .w-full').type('123456789')
  //   cy.get('.bg-emerald-600').click()
  //   // add income
  //   cy.get('.ml-10 > :nth-child(2)').click()
  //   cy.get('.mb-6 > .flex > .text-gray-500').click()
  //   cy.get(':nth-child(1) > .relative > .w-full').type('50')
  //   cy.get(':nth-child(2) > .relative > .w-full').select('Salary')
  //   cy.get(':nth-child(3) > .relative > .w-full').select('Cash')
  //   // add new wallet methods
  //   cy.get('.gap-3 > .flex').click()
  //   cy.get('.space-y-4 > :nth-child(1) > .w-full').type('main')
  //   cy.get('.mt-6')
  //   cy.get(':nth-child(6) > .relative > .w-full').type('Faculty of Information and Communication Technology (ICT)')
  //   cy.get(':nth-child(7) > .relative > .w-full').type('...')
  //   cy.get('.space-x-4 > .bg-emerald-600').click()
  // })
})