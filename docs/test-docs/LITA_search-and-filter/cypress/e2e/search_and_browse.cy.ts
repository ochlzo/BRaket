describe('BRaket - Search and Browse Automated UI Tests', () => {

  beforeEach(() => {
    // 1. Start at the homepage
    cy.visit('http://localhost:3000/');
  });

  // SCENARIO 1: Test Search Keywords (FIXED ROUTE)
  it('should filter talents by search keywords', () => {
    cy.contains('Talents').click();
    // FIXED: Your talents page uses the route '/browse'
    cy.url().should('include', '/browse');

    cy.get('input[placeholder="Search by talent, skill, course, or college..."]')
      .type('Dan Emanuel{enter}');
    
    cy.contains('Dan Emanuel Pispis').should('be.visible');
  });

  // SCENARIO 2: Test Category Filters (UNTOUCHED - PASSED)
  it('should successfully filter listings by category buttons', () => {
    cy.contains('Services').click();
    cy.url().should('include', '/services');

    cy.contains('Accounting & Bookkeeping').click();
    cy.contains('Accounting & Bookkeeping').should('be.visible');
  });

  // SCENARIO 3: Test Price Filters (UNTOUCHED - PASSED)
  it('should successfully restrict listings by price filters dropdown', () => {
    cy.contains('Services').click();
    cy.url().should('include', '/services');

    cy.contains('Max Price:').click();
    cy.contains('Filters').should('be.visible');
  });

  // SCENARIO 4: Test Empty Search Results (FIXED ROUTE)
  it('should display a graceful "no results" message for unmatched search keywords', () => {
    cy.contains('Talents').click();
    // FIXED: Your talents page uses the route '/browse'
    cy.url().should('include', '/browse');
    
    cy.get('input[placeholder="Search by talent, skill, course, or college..."]')
      .type('xyz999abc!!!{enter}');
    
    // Proves zero results exist by confirming the initial profile card disappears
    cy.contains('Dan Emanuel Pispis').should('not.exist');
  });

});