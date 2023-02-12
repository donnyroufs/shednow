Feature: Create post
  As a user I want to create a post with a recording
  so that I can get feedback from other musicians

  Rule: Should only have one recording
    Scenario: A post gets created and published
      When I create a post with the title "my post" and recording "test.mp3"
      Then I will get a confirmation that its published
