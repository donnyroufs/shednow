describe("view posts", () => {
  describe("we have no posts", () => {
    it("I will find nothing", () => {
      cy.intercept("GET", "http://localhost:3333/api/posts?page=1", {
        body: {
          posts: [],
          currentPage: 1,
          totalPages: 1,
        },
      }).as("posts");

      cy.visit("/");
      cy.wait("@posts");

      cy.get('[data-cy="empty-message"]').should(
        "contain",
        "No posts available at the moment"
      );
    });
  });

  describe("all users", () => {
    it("I will find 2 posts from two different authors", () => {
      cy.intercept("GET", "http://localhost:3333/api/posts?page=1", {
        body: {
          posts: [
            {
              title: "Post 1",
              authorName: "john",
            },
            {
              title: "Post 2",
              authorName: "Jim",
            },
          ],
          currentPage: 1,
          totalPages: 1,
        },
      }).as("posts");

      cy.visit("/");
      cy.wait("@posts");

      cy.get('[data-cy="posts"]').should("contain", "Post 1");
      cy.get('[data-cy="posts"]').should("contain", "Post 2");
    });
  });

  describe("Look through the next set of posts", () => {
    it("there is a load more button", () => {
      cy.intercept("GET", "http://localhost:3333/api/posts?page=1", {
        body: {
          posts: [
            {
              title: "Post 1",
              authorName: "john",
            },
          ],
          currentPage: 1,
          totalPages: 2,
        },
      }).as("posts");

      cy.visit("/");
      cy.wait("@posts");

      cy.get('[data-cy="posts"]').should("contain", "Post 1");

      cy.intercept("GET", "http://localhost:3333/api/posts?page=2", {
        body: {
          posts: [
            {
              title: "Post 2",
              authorName: "Jim",
            },
          ],
          currentPage: 2,
          totalPages: 2,
        },
      }).as("posts");

      cy.get('[data-cy="load-more"]').click();
      cy.wait("@posts");

      cy.get('[data-cy="posts"]').should("contain", "Post 2");
    });
  });
});
