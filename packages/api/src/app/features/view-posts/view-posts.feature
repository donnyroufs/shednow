Feature: View posts
  As a visitor I want to see all the current posts
  so that I can give feedback on recordings.

  Scenario: We have no posts
    Given there are no posts
    When I look for posts
    Then I will find nothing

  Rule: Sorted by most recent added
    Scenario: There are posts
      Given we have the posts
      | title  | createdAt  |
      | Post 2 | 02-16-2023 |
      | Post 1 | 02-17-2023 |
      When I look for posts
      Then I will first see "Post 1" and then "Post 2"

  Rule: All users
    Scenario: There are posts created by multiple users
      Given we have the posts
        | title  | authorName |
        | Post 1 | John       |
        | Post 2 | Jim        |
      When I look for posts
      Then I will find "2" posts with each a seperate author

  Rule: There are many sets of posts
    Scenario: Look through the next set of posts
      Given we have "11" posts and the last post has the title "last post"
      When we look through the next set of posts
      Then we find "1" post with the title "last post"
