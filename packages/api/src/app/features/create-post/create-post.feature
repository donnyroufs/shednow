Feature: Create post
  As a user I want to create a post with a recording
  so that I can get feedback from other musicians

  Rule: Should only have one recording
    Scenario: A post gets created and published
      When I create a post with the title "my post" and recording "test.mp3"
      Then I will get a confirmation that its published

  Rule: Has a goal
    Scenario: A goal is provided
      When I create a post with the goal "improve picking speed"
      Then the post will be created with the provided goal "improve picking speed"

    Scenario: A goal has not been provided
      When I create a post with no goal
      Then I will be told that I need to provide a goal
