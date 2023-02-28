describe("Provide feedback", () => {
  describe("Can only give feedback once on a particular post", () => {
    it("I have not given feedback", () => {
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
      cy.intercept("POST", "/posts/john/post-1/feedback", {
        statusCode: 201,
      }).as("feedback");

      cy.visit("/");
      cy.wait("@auth");
      cy.wait("@posts");

      cy.get('[data-cy="feedback"]').click();
      cy.wait("@post");

      cy.get('[data-cy="content"]').type(
        "You are rushing here, try doing this instead."
      );
      cy.get('[data-cy="form"]').submit();

      cy.wait("@feedback").then((response) => {
        expect(response.response!.statusCode).to.eq(201);
      });
    });

    it("I have given feedback", () => {
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
          isMyPost: false,
          hasProvidedFeedback: true,
          feedback: [],
        },
      }).as("post");

      cy.visit("/");
      cy.wait("@auth");
      cy.wait("@posts");

      cy.get('[data-cy="feedback"]').click();
      cy.wait("@post");

      cy.get('[data-cy="content"]').should("be.disabled");
    });
  });

  describe("The post author cannot give feedback on their own post", () => {
    it("Attempts to give feedback on their own post", () => {
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
        },
      }).as("post");

      cy.visit("/");
      cy.wait("@auth");
      cy.wait("@posts");

      cy.get('[data-cy="feedback"]').click();
      cy.wait("@post");

      cy.get('[data-cy="content"]').should("not.exist");
    });
  });
});
