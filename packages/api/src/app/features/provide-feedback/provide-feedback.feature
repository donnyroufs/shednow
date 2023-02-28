Feature: Provide Feedback
  As a user I want to provide feedback
  so that I can help the author

  Rule: Can only give feedback once on a particular post
    Scenario: I have not given feedback
      Given We have a post with the title "Post 1" created by "John" with no feedback
      When "Jim" gives the feedback "You are rushing here, try doing this instead."
      Then "John" should see the feedback given by "Jim" on his post "Post 1"

    Scenario: I have given feedback
      Given We have a post with the title "Post 1" created by "Jim" with feedback "my amazing feedback" by "John"
      When "John" tries to give feeback
      Then he cannot give feedback because he already has given feedback on "Post 1"

  Rule: The post author cannot give feedback on their own post
    Scenario: Attempts to give feedback on their own post
      Given "John" has a post
      When "John" tries to give feedback
      Then "John" will be told that he is not allowed to give feedback on his own post