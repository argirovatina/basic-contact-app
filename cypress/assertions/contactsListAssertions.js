export function verifyNewContactInList(name, email) {
    cy.get('.header').contains(name).should('exist');
    cy.get('.header + div').contains(email).should('exist');
}

export function noContactsFound() {
    cy.get('.list').should('contain', 'Sorry no contacts');
}