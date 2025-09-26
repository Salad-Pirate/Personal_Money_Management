describe('addtransaction page', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000')
  })

  it('adds a new income record successfully', () => {
    // login
    cy.get(':nth-child(1) > .relative > .w-full').type('abc@gmail.com')
    cy.get(':nth-child(2) > .relative > .w-full').type('123456789')
    cy.get('.bg-emerald-600').click()
    // add income
    cy.get('.ml-10 > :nth-child(2)').click()
    cy.get('.mb-6 > .flex > .text-gray-500').click()
    cy.get(':nth-child(1) > .relative > .w-full').type('20')
    cy.get(':nth-child(2) > .relative > .w-full').select('Freelance')
    cy.get(':nth-child(3) > .relative > .w-full').select('Cash')
    cy.get('.border-green-500').click()
    cy.get(':nth-child(6) > .relative > .w-full').type('Faculty of Information and Communication Technology (ICT)')
    cy.get(':nth-child(7) > .relative > .w-full').type('Borrow money from a friend')
    cy.get('.space-x-4 > .bg-emerald-600').click()
  })


  it('adds a new expense record successfully', () => {
    // login
    cy.get(':nth-child(1) > .relative > .w-full').type('abc@gmail.com')
    cy.get(':nth-child(2) > .relative > .w-full').type('123456789')
    cy.get('.bg-emerald-600').click()
    // add expense
    cy.get('.ml-10 > :nth-child(2)').click()
    
    cy.get(':nth-child(1) > .relative > .w-full').type('20')
    cy.get(':nth-child(2) > .relative > .w-full').select('Food & Dining')
    cy.get(':nth-child(3) > .relative > .w-full').select('Cash')
    cy.get('.border-green-500').click()
    cy.get(':nth-child(6) > .relative > .w-full').type('7-11')
    cy.get(':nth-child(7) > .relative > .w-full').type('...')
    cy.get('.space-x-4 > .bg-emerald-600').click()
  })
  
})