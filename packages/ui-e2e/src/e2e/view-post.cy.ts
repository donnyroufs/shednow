describe("View Post", () => {
  it("View a post not owned by me", () => {
    cy.setupAuth();
    cy.intercept("GET", "/posts?page=1", {
      body: {
        posts: [
          {
            title: "Post 1",
            authorName: "john",
            slug: "post-1",
          },
        ],
        currentPage: 1,
        totalPages: 1,
      },
    }).as("posts");
    cy.intercept("GET", "/posts/john/post-1", {
      statusCode: 200,
      body: {
        id: "id",
        title: "Post 1",
        slug: "post-1",
        url: "url",
        hasProvidedFeedback: false,
        isMyPost: false,
        feedback: [],
      },
    }).as("post");

    cy.visit("/");
    cy.wait("@auth");
    cy.wait("@posts");

    cy.get('[data-cy="feedback"]').click();
    cy.wait("@post");

    cy.get('[data-cy="feedback-message"]').should("contain.text", "They");
  });

  it("View a post owned by me", () => {
    cy.setupAuth();
    cy.intercept("GET", "/posts?page=1", {
      body: {
        posts: [
          {
            title: "Post 1",
            authorName: "john",
            slug: "post-1",
          },
        ],
        currentPage: 1,
        totalPages: 1,
      },
    }).as("posts");
    cy.intercept("GET", "/posts/john/post-1", {
      statusCode: 200,
      body: {
        id: "id",
        title: "Post 1",
        slug: "post-1",
        url: "url",
        hasProvidedFeedback: false,
        isMyPost: true,
        feedback: [],
        goal: "my goal",
      },
    }).as("post");

    cy.visit("/");
    cy.wait("@auth");
    cy.wait("@posts");

    cy.get('[data-cy="feedback"]').click();
    cy.wait("@post");

    cy.get('[data-cy="feedback-message"]').should("contain.text", "You");
    cy.get('[data-cy="goal"]').should("contain.text", "my goal");
  });
});
