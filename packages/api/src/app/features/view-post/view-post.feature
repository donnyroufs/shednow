Feature: View Post
  As a user I want to view a post
  so that I can read its feedback

  Scenario: View a post not owned by me
    Given The post "Post 1" by "Jim"
    And I am "Jim"
    When I look at "Post 1" by "Jim"
    Then we will "Post 1" by "Jim" owned by me

  Scenario: View a post owned by me
    Given The post "Post 1" by "John"
    And I am "Jim"
    When I look at "Post 1" by "John"
    Then we will find "Post 1" by "John" not owned by me
