/// <reference types='cypress' />
/// <reference types='../support' />

import HomePageObject from '../support/pages/home.pageObject';
import SignInPageObject from '../support/pages/signIn.pageObject';
import SettingsPageObject from '../support/pages/settings.pageObject';

const signInPage = new SignInPageObject();
const homePage = new HomePageObject();
const settingsPage = new SettingsPageObject();

describe('Settings page', () => {
  let user;

  beforeEach(() => {
    cy.task('db:clear');
    cy.task('generateUser').then((generateUser) => {
      user = generateUser;
      cy.register(user.email, user.username, user.password);
    });

    signInPage.visit();
    signInPage.typeEmail(user.email);
    signInPage.typePassword(user.password);
    signInPage.clickSignInBtn();
  });

  it('should provide an ability to update username', () => {
    cy.task('generateUser').then((newUser) => {
      const newUsername = newUser.username;

      homePage.usernameLink.click();
      cy.contains('a', 'Edit Profile Settings').click();
      cy.url().should('include', 'settings');

      settingsPage.updateUsername(newUsername);
      settingsPage.clickUpdateSettingsBtn();

      cy.get('.swal-title').should('be.visible');
      homePage.visit();
      homePage.assertHeaderContainUsername(newUsername);
    });
  });

  it('should provide an ability to update bio', () => {
    cy.task('generateUser').then((newUser) => {
      const newBio = 'Updated bio for testing';

      homePage.usernameLink.click();
      cy.contains('a', 'Edit Profile Settings').click();
      cy.url().should('include', 'settings');

      settingsPage.updateBio(newBio);
      settingsPage.clickUpdateSettingsBtn();

      cy.get('.swal-title').should('be.visible');
      cy.visit(`/#/@${user.username}`);
      cy.contains('p', newBio).should('be.visible');
    });
  });

  it('should provide an ability to update email', () => {
    cy.task('generateUser').then((newUser) => {
      const randomNum = Math.ceil(Math.random(1000) * 1000);
      const newEmail = `newemail_${randomNum}@test.com`;

      homePage.usernameLink.click();
      cy.contains('a', 'Edit Profile Settings').click();
      cy.url().should('include', 'settings');

      settingsPage.updateEmail(newEmail);
      settingsPage.clickUpdateSettingsBtn();

      cy.get('.swal-title').should('be.visible');
      // Verify by logging out and logging back in with new email
      homePage.usernameLink.click();
      cy.contains('a', 'Edit Profile Settings').click();
      settingsPage.clickLogoutBtn();

      signInPage.visit();
      signInPage.typeEmail(newEmail);
      signInPage.typePassword(user.password);
      signInPage.clickSignInBtn();

      homePage.assertHeaderContainUsername(user.username);
    });
  });

  it('should provide an ability to update password', () => {
    cy.task('generateUser').then((newUser) => {
      const newPassword = 'NewPass123!';

      homePage.usernameLink.click();
      cy.contains('a', 'Edit Profile Settings').click();
      cy.url().should('include', 'settings');

      settingsPage.updatePassword(newPassword);
      settingsPage.clickUpdateSettingsBtn();

      cy.get('.swal-title').should('be.visible');

      // Verify by logging out and logging back in with new password
      homePage.usernameLink.click();
      cy.contains('a', 'Edit Profile Settings').click();
      settingsPage.clickLogoutBtn();

      signInPage.visit();
      signInPage.typeEmail(user.email);
      signInPage.typePassword(newPassword);
      signInPage.clickSignInBtn();

      homePage.assertHeaderContainUsername(user.username);
    });
  });

  it('should provide an ability to log out', () => {
    homePage.usernameLink.click();
    cy.contains('a', 'Edit Profile Settings').click();
    cy.url().should('include', 'settings');

    settingsPage.clickLogoutBtn();

    homePage.usernameLink.should('not.exist');
  });
});
