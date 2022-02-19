import { verifyNewContactInList, noContactsFound } from '../assertions/contactsListAssertions';

describe("/contacts", () => {
    context("when gets list of contacts", () => {
        it("each contact has correct name and email", () => {
            cy.intercept({method: 'GET', url: '/contacts'}, {fixture: 'contactsList.json'}).as('getContacts');
            cy.visit('/');
            cy.fixture('contactsList').then((contacts) => {
                contacts.forEach(contact => {
                    verifyNewContactInList(contact.name, contact.email);
                });
            });
        });
    });
    context("creates new contact", () => {
        it("request includes correct id, name and email", () => {
            cy.fixture('contactDetails').then((contact) => {
                cy.intercept({method: 'POST', url: '/contacts'}, {statusCode: 200, body: {name: contact.name, email: contact.email}}).as('addContact');
                addContact(contact.name, contact.email);
                cy.wait('@addContact').then((interception) => {
                    expect(interception.request.body["email"]).to.eq(contact.email);
                    expect(interception.request.body["name"]).to.eq(contact.name);
                    expect(interception.request.body).to.have.property('id');
                    expect(interception.request.body["id"]).not.to.be.empty;
                    expect(interception.request.body["id"]).to.be.a('string');
                });
            });  
         });
         it("new cotact appears on contact list", () => {
            cy.fixture('contactDetails').then((contact) => {
                cy.visit('/');
                noContactsFound();
                cy.intercept({method: 'POST', url: '/contacts'}, {statusCode: 200, body: {name: contact.name, email: contact.email}}).as('addContact');
                addContact(contact.name, contact.email);
                verifyNewContactInList(contact.name, contact.email);
                cy.matchImageSnapshot();
            });
         })
         context("validates input", () => {
            it("cannot save with empty username", () => {
                addContact('', 'email');
                cy.on('window:alert', (text) => {
                    expect(text).to.contains('ALl the fields are mandatory!');
                });
            });
            it("cannot save with empty email", () => {
                addContact('name', '');
                cy.on('window:alert', (text) => {
                    expect(text).to.contains('ALl the fields are mandatory!');
                });
            });
            it("cannot save with empty username and email", () => {
                addContact('', '');
                cy.on('window:alert', (text) => {
                    expect(text).to.contains('ALl the fields are mandatory!');
                    cy.matchImageSnapshot();
                });
            });
        });
    });
});

function addContact(name, email) {
    cy.visit('/add');
    if (name === '') {
        cy.get('[data-testid="name"]')
            .focus()
            .blur();    
    } else {
        cy.get('[data-testid="name"]').type(name);
    }
    if (email === '') {
        cy.get('[data-testid="name"]')
            .focus()
            .blur();    
    } else {
        cy.get('[data-testid="email"]').type(email);
    }
    cy.get('[data-testid="submit button"]').click();
}
