import { verifyNewContactInList, noContactsFound } from '../assertions/contactsListAssertions';

describe("User searches contact in the list", () => {
    beforeEach(() => {
        cy.intercept({method: 'GET', url: '/contacts'}, {fixture: 'contactsList.json'}).as('getContacts');
        cy.visit('/');
    })
    it("and list is filtered by search word", () => {
        cy.fixture('contactsList').then((contacts) => {
            let name = contacts[0]["name"]
            let email = contacts[0]["email"]
            searchContact(name);
            verifyNewContactInList(name, email);
            cy.matchImageSnapshot();
            cy.lighthouse();
        });
    });
    it("and message is shown when no contacts found", () => {
        searchContact('notfound');
        noContactsFound();
        cy.matchImageSnapshot();
    });
})

function searchContact(name) {
    cy.get('[placeholder="Search Contacts"]').type(name);
    cy.get('.search.icon').click();
}