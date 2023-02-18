// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

// eslint-disable-next-line @typescript-eslint/no-namespace
declare namespace Cypress {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface Chainable<Subject> {
    setupAuth(): void;
  }
}
//
// -- This is a parent command --
Cypress.Commands.add("setupAuth", () => {
  cy.intercept("/auth/me", {
    id: "7d59358b-3563-425d-b7bd-011ed82011ae",
    name: "Donny Roufs",
    email: "donny@gmail.com",
    avatarUrl:
      "https://lh3.googleusercontent.com/a/AEdFTp4DkqfKcSDYfchAPyNzZpkzN5ICUsWmVE7UvhaM9Q=s96-c",
  }).as("auth");
});
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })
