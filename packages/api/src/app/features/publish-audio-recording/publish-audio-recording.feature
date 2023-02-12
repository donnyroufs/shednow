Feature: Publish audio recording
  As a user I want to create a post with a recording
  so that I can get feedback from other musicians

  Rule: A published post can and should only have 1 audio clip
    Scenario: A post gets created
      Given we have an recording named "test.mp3"
      When I create a post with the name "my post"
      And the recording "test.mp3"
      Then I expect to find "my post" with "test.mp3" as audio
