Aim - Voting Application


What? 
- A functionality where user can give vote to the given set of candidates


voting app functionality -> 
1. user signin/ signup
2. see the list of candidates
3. vote one of the candidates
4. there is a route which shows the list of candidates and their live vote counts sorted by their vote count
5. user data must contain there one unique goverment id proof named : aadhar card number
6. There should be one admin who can only maintain the table of candidates and he can't able to vote at all
7. user can change their password
8. user can login only with aadharcard number and password
9. Admin can't vote at all


---------------------------------------------------------------------

Routes (end points)

User Authentication:
  /signup: POST - Create a new user account.
  /login: POST - Log in to an existing account. { aadhar card no. + password }

Voting: 
  /candidates: GET - Get the list of candidates.
  /vote/:candidateId: POST - Vote for a specific candidate.

Vote Counts:
  /vote/counts: GET - Get the list of candidates sorted by their vote counts.

User Profile: 
  /profile: GET - Get the user's profile information.
  /profile/password: PUT - change the user's password.

Admin candidate Management: 
  /candidates: POST - Create a new candidate.
  /candidates/:candidateId: PUT - Update an existing candidate.
  /candidates/:candidateId: DELETE - Delete a candidate from the list.
