describe('addtransaction page', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000')
  })

  it('adds a new income record successfully', () => {
    // login
    cy.get(':nth-child(1) > .relative > .w-full').type('abcd@gmail.com')
    cy.get(':nth-child(2) > .relative > .w-full').type('123456789')
    cy.get('.bg-emerald-600').click()
    // add new category (Income)
    cy.get('.ml-10 > :nth-child(4)').click()
    cy.get('.mb-6 > .flex').click()
    cy.get('.space-y-4 > :nth-child(1) > .w-full').type('test Income3')
    cy.get(':nth-child(2) > .w-full').select('Income')
    cy.get('.space-x-3 > .bg-emerald-600').click({ force: true })
    // add new payment methods
    
    cy.get('.p-4 > :nth-child(2)').click()
    cy.get('.mb-6 > .flex').click()
    cy.get('.space-y-4 > :nth-child(1) > .w-full').type('test payment3')
    cy.get('.space-x-3 > .bg-emerald-600').click()
    // add income
    cy.get('.ml-10 > :nth-child(2)').click()
    cy.get('.mb-6 > .flex > .text-gray-500').click()
    cy.get(':nth-child(1) > .relative > .w-full').type('50')
    cy.get(':nth-child(2) > .relative > .w-full').select('test Income3')
    cy.get(':nth-child(3) > .relative > .w-full').select('test payment3')
    // add new wallet methods
    cy.get('.gap-3 > .flex').click()
    cy.get('.space-y-4 > :nth-child(1) > .w-full').type('test main')
    cy.get('.mt-6').click()
    cy.get(':nth-child(6) > .relative > .w-full').type('...')
    cy.get(':nth-child(7) > .relative > .w-full').type('...')
    cy.get('.space-x-4 > .bg-emerald-600').click()
  })


  it('adds a new expense record successfully', () => {
     // login
    cy.get(':nth-child(1) > .relative > .w-full').type('abcd@gmail.com')
    cy.get(':nth-child(2) > .relative > .w-full').type('123456789')
    cy.get('.bg-emerald-600').click()
    // add new category (Income)
    cy.get('.ml-10 > :nth-child(4)').click()
    cy.get('.mb-6 > .flex').click()
    cy.get('.space-y-4 > :nth-child(1) > .w-full').type('test Income7')
    cy.get(':nth-child(2) > .w-full').select('Income')
    cy.get('.space-x-3 > .bg-emerald-600').click({ force: true })
    
    // add new category (expenses)
    
    cy.get('.mb-6 > .flex').click()
    cy.get('.space-y-4 > :nth-child(1) > .w-full').type('test Expense7')
    cy.get(':nth-child(2) > .w-full').select('Expense')
    cy.get('.space-x-3 > .bg-emerald-600').click()
    // add new payment methods
    
    cy.get('.p-4 > :nth-child(2)').click()
    cy.get('.mb-6 > .flex').click()
    cy.get('.space-y-4 > :nth-child(1) > .w-full').type('test payment7')
    cy.get('.space-x-3 > .bg-emerald-600').click()
    // add income
    cy.get('.ml-10 > :nth-child(2)').click()
    cy.get('.mb-6 > .flex > .text-gray-500').click()
    cy.get(':nth-child(1) > .relative > .w-full').type('50')
    cy.get(':nth-child(2) > .relative > .w-full').select('test Income7')
    cy.get(':nth-child(3) > .relative > .w-full').select('test payment7')
    // add new wallet methods
    cy.get('.gap-3 > .flex').click()
    cy.get('.space-y-4 > :nth-child(1) > .w-full').type('test main5')
    cy.get('.mt-6').click()
    cy.get(':nth-child(6) > .relative > .w-full').type('...')
    cy.get(':nth-child(7) > .relative > .w-full').type('...')
    cy.get('.space-x-4 > .bg-emerald-600').click()

    //add expense
    cy.get('.ml-10 > :nth-child(2)').click()
    cy.get('.mb-6 > .flex > .text-gray-500').click()
    cy.get(':nth-child(1) > .relative > .w-full').type('5')
    cy.get(':nth-child(2) > .relative > .w-full').select('test Expense7')
    cy.get(':nth-child(3) > .relative > .w-full').select('test payment7')
    // add new wallet methods
    cy.get('.border-4').click()

    cy.get(':nth-child(6) > .relative > .w-full').type('...')
    cy.get(':nth-child(7) > .relative > .w-full').type('...')
    cy.get('.space-x-4 > .bg-emerald-600').click()
  })
  

})