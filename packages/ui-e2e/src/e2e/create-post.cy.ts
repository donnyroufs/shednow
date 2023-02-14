describe("Should only have one recording", () => {
  beforeEach(() => cy.visit("/create-post"));

  it("When I create a post with the tile 'my post' and recording 'test.mp3' I will get a confirmation that its published", () => {
    cy.intercept("http://localhost:3333/api/posts", {
      statusCode: 201,
    });

    cy.get('[data-cy="title"]').type("my post");
    cy.get('[data-cy="file"]').selectFile("test.mp3", {
      action: "select",
      force: true,
    });

    cy.get("button").last().click();

    cy.url().should("equal", "http://localhost:4200/");
  });
});
