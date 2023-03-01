describe("Should only have one recording", () => {
  it("When I create a post with the title 'my post' and recording 'test.mp3' I will get a confirmation that its published", () => {
    cy.setupAuth();
    cy.intercept("GET", "/posts?page=1", {
      body: {
        posts: [],
        currentPage: 1,
        totalPages: 1,
      },
    });

    cy.visit("/");
    cy.wait("@auth");

    cy.intercept("/posts", {
      statusCode: 201,
    });

    cy.get('[data-cy="navigate-create-post"]').click();
    cy.get('[data-cy="title"]').type("my post");
    cy.get('[data-cy="goal"]').type("my goal");
    cy.get('[data-cy="file"]').selectFile("test.mp3", {
      action: "select",
      force: true,
    });

    cy.get("button").last().click();

    cy.url().should("equal", "http://localhost:4200/");
  });
});
